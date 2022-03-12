#!/bin/sh

# Before you run this script, you need to:
# Authenticate to the Kubernetes cluster.
# Set the AZURE_STORAGE_SAS_TOKEN environment variable.
# Update the version numbers in: Chart.yaml, package.json.

# The extra sed at the end removes the carriage return.
PUBLISHING_MEERKAT_VERSION=$(cat k8s/charts/meerkat-dsa/Chart.yaml | grep appVersion | sed 's/appVersion: //' | sed 's/\r$//')

echo "Publishing Meerkat DSA version $PUBLISHING_MEERKAT_VERSION."

# For some reason, the SQL files persist between builds. We need to remove the
# whole folder so the migrations will be guaranteed correct.
rm -rf dist

# Avoid caching just so we're sure we're getting the latest everything.
nx run meerkat:build --skip-nx-cache

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

# Package up the helm app files
helm package .

# Create the helm repo index. This is idempotent.
helm repo index . --url https://meerkatdsahelmtest.blob.core.windows.net/asdf

# Change back to the root directory
cd ../../..

# Upload the chart index
az storage blob upload \
    --account-name=meerkatdsahelmtest \
    --container-name=asdf \
    --overwrite \
    --file=k8s/charts/meerkat-dsa/index.yaml

# Upload the charts
for FILE in k8s/charts/meerkat-dsa/*.tgz; do
    az storage blob upload \
        --account-name=meerkatdsahelmtest \
        --container-name=asdf \
        --overwrite \
        --file=$FILE
done

# Add the helm repo
helm repo add meerkathelmtest https://meerkatdsahelmtest.blob.core.windows.net/asdf

# Update the Helm repo
helm repo update

# Delete the pre-install job, if it exists
kubectl delete job meerkat || true

# Uninstall the Helm Chart
helm uninstall meerkat || true

# Install the Helm chart
helm install meerkat meerkathelmtest/meerkat-dsa \
    --debug \
    --set service.type=LoadBalancer \
    --set adminService.type=LoadBalancer \
    --set logLevel=debug \
    --set databaseSecretName=meerkat-dsa-database
