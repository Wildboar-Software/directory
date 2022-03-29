#!/bin/bash

# Before you run this script, you need to:
# Authenticate to the Kubernetes cluster.
# Set the AZURE_STORAGE_SAS_TOKEN environment variable.
# Update the version numbers in: Chart.yaml, package.json.
#
# You will also want to ensure that IPv6 is disabled on your workstation.

namespace="test"
chart_repo="meerkathelmtest"
storage_account_name="meerkatdsahelmtest"
chart_container="asdf"
meerkat_chart="meerkat-dsa"
azure_subscription_name="Azure subscription 1"
azure_rg="production"
zone="mkdemo.wildboar.software"

# instances=("root")
# instances=("root" "gb" "ru" "ru-moscow")
instances=("root" "gb")

# Make sure we are on the right Azure subscription
az account set --subscription "$azure_subscription_name" || true

# Make sure the Kubernetes namespace exists
kubectl create ns $namespace || true

# Add the Bitnami Helm repo so we can install the databases
helm repo add bitnami https://charts.bitnami.com/bitnami || true
helm repo update

# Uninstall the Helm Chart. We do this at the start of the script because the
# LoadBalancer must be deleted before we attempt to create a new one.
for instance in ${instances[@]}; do

    # Delete the pre-install job, if it exists
    kubectl delete job meerkat-dsa-$instance-migrate -n $namespace || true
    # Delete the Meerkat DSA instance, if it exists.
    helm uninstall meerkat-dsa-$instance -n $namespace || true
    # Delete the DSA's database, if it exists.
    helm uninstall meerkat-db-$instance -n $namespace || true
    # Delete the secret used for the database, if it exists.
    kubectl delete secret mysql-db-$instance -n $namespace || true
    # Delete the secret used for the DSA, if it exists.
    kubectl delete secret meerkat-db-$instance -n $namespace || true
    # Delete the persistent volume claim created by the database.
    # (This is not deleted automatically by Helm.)
    kubectl delete pvc data-meerkat-db-$instance-mysql-0 -n $namespace || true

    # I was having an issue getting a new instance to start. I think the issue
    # is that the password settings for a given chart are only applied the first
    # time it is deployed. When you delete a bitnami/mysql release, it does NOT
    # delete the PVCs it created, which means that the OLD password will
    # persist. Since this script deletes and re-installs under the same name
    # every time, it must necessarily have a deterministic password.
    # See this GitHub issue: https://github.com/bitnami/charts/issues/9083
    dbpassword="asdf_$instance"

    # Create the database secrets as required by the bitnami/mysql chart.
    # See: https://artifacthub.io/packages/helm/bitnami/mysql
    kubectl create secret generic mysql-db-$instance \
        --from-literal=mysql-root-password=$dbpassword \
        --from-literal=mysql-replication-password=$dbpassword \
        --from-literal=mysql-password=$dbpassword \
        --namespace=$namespace

    # Create the secrets for the DSA to use to authenticate to the database.
    kubectl create secret generic meerkat-db-$instance \
        --from-literal=databaseUrl=mysql://root:$dbpassword@meerkat-db-$instance-mysql.$namespace.svc.cluster.local:3306/directory \
        --namespace=$namespace

    # Create one separate MySQL database for each DSA to be deployed.
    # See: https://artifacthub.io/packages/helm/bitnami/mysql
    helm install meerkat-db-$instance bitnami/mysql \
        --debug \
        --set auth.existingSecret=mysql-db-$instance \
        --set auth.database=directory \
        --namespace=$namespace

done

# The extra sed at the end removes the carriage return.
PUBLISHING_MEERKAT_VERSION=$(cat k8s/charts/meerkat-dsa/Chart.yaml | grep appVersion | sed 's/appVersion: //' | sed 's/\r$//')

echo "Publishing Meerkat DSA version $PUBLISHING_MEERKAT_VERSION."

# For some reason, the SQL files persist between builds. We need to remove the
# whole folder so the migrations will be guaranteed correct.
rm -rf dist

# Avoid caching just so we're sure we're getting the latest everything.
nx run meerkat:build:production --skip-nx-cache

# Build and tag the Docker image
docker build \
    -f meerkat.dockerfile \
    -t wildboarsoftware/meerkat-dsa:$PUBLISHING_MEERKAT_VERSION \
    -t wildboarsoftware/meerkat-dsa:latest \
    .

# Publish the Docker image (requires being authenticated to Docker Hub)
docker push wildboarsoftware/meerkat-dsa:$PUBLISHING_MEERKAT_VERSION
docker push wildboarsoftware/meerkat-dsa:latest

# Change into the Charts directory
cd k8s/charts/meerkat-dsa

# Package up the Helm app files
helm package .

# Create the Helm repo index. This is idempotent.
helm repo index . --url https://$storage_account_name.blob.core.windows.net/$chart_container

# Change back to the root directory
cd ../../..

# Upload the chart index
az storage blob upload \
    --account-name=$storage_account_name \
    --container-name=$chart_container \
    --overwrite \
    --file=k8s/charts/meerkat-dsa/index.yaml

# Upload the charts
for FILE in k8s/charts/meerkat-dsa/*.tgz; do
    az storage blob upload \
        --account-name=$storage_account_name \
        --container-name=$chart_container \
        --overwrite \
        --file=$FILE
done

# Add the Helm repo
helm repo add $chart_repo https://$storage_account_name.blob.core.windows.net/$chart_container || true

# Update the Helm repo
helm repo update

# Build tools to seed and use the directory
nx run create-test-dit:build:production
nx run x500-cli:build:production

# Install the Helm chart
for instance in ${instances[@]}; do

    # Delete existing DNS records
    az network dns record-set a delete -g $azure_rg -z $zone -n dsa01.$instance -y || true
    az network dns record-set a delete -g $azure_rg -z $zone -n webadm01.$instance -y || true

    # Install the Meerkat DSA instance
    # TODO: Enable TLS
    helm install meerkat-dsa-$instance $chart_repo/$meerkat_chart \
        --debug \
        --set fullnameOverride=meerkat-$instance \
        --set service.type=LoadBalancer \
        --set adminService.type=LoadBalancer \
        --set log.level=debug \
        --set "myAccessPointNSAPs={idm://dsa01.$instance.$zone:4632,ldap://dsa01.$instance.$zone:389}" \
        --set chaining.minAuthLevel=0 \
        --set chaining.minAuthLocalQualifier=0 \
        --set chaining.tlsOptional=true \
        --set ob.minAuthLevel=0 \
        --set ob.minAuthLocalQualifier=0 \
        --set ob.autoAccept=true \
        --set databaseReset=true \
        --set dangerouslyExposeWebAdmin=true \
        --set databaseSecretName=meerkat-db-$instance \
        --namespace=$namespace

    # We wait one minute for the public IPs to be available.
    sleep 60

    DIRECTORY_SERVICE_IP=$(kubectl get svc --namespace $namespace meerkat-$instance-directory --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")
    WEB_ADMIN_SERVICE_IP=$(kubectl get svc --namespace $namespace meerkat-$instance-web-admin --template "{{ range (index .status.loadBalancer.ingress 0) }}{{.}}{{ end }}")

    # Create the new DNS records
    # We use a very short TTL for now, since we're testing.
    az network dns record-set a add-record \
        --resource-group $azure_rg \
        --zone-name $zone \
        --ttl 60 \
        --record-set-name dsa01.$instance \
        --ipv4-address $DIRECTORY_SERVICE_IP

    # Create the new DNS records
    az network dns record-set a add-record \
        --resource-group $azure_rg \
        --zone-name $zone \
        --ttl 60 \
        --record-set-name webadm01.$instance \
        --ipv4-address $WEB_ADMIN_SERVICE_IP

    echo "Meerkat DSA '$instance' deployed successfully."

done

# Seed the DIT
for instance in ${instances[@]}; do

    node ./dist/apps/create-test-dit/main.js \
        --accessPoint="idm://dsa01.$instance.$zone:4632" \
        --profile=$instance \
        -t

    echo "Seeded DIT for '$instance' DSA."

done
