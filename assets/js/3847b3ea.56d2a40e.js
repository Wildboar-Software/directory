"use strict";(self.webpackChunkdirectory=self.webpackChunkdirectory||[]).push([[5581],{3905:(e,t,a)=>{a.d(t,{Zo:()=>d,kt:()=>m});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var l=n.createContext({}),u=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):r(r({},t),e)),a},d=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=u(a),m=i,h=p["".concat(l,".").concat(m)]||p[m]||c[m]||o;return a?n.createElement(h,r(r({ref:t},d),{},{components:a})):n.createElement(h,r({ref:t},d))}));function m(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=a.length,r=new Array(o);r[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,r[1]=s;for(var u=2;u<o;u++)r[u]=a[u];return n.createElement.apply(null,r)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},9222:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>m,frontMatter:()=>s,metadata:()=>u,toc:()=>c});var n=a(7462),i=a(3366),o=(a(7294),a(3905)),r=["components"],s={},l="Setup",u={unversionedId:"setup",id:"setup",title:"Setup",description:"System Requirements",source:"@site/docs/setup.md",sourceDirName:".",slug:"/setup",permalink:"/directory/docs/setup",draft:!1,editUrl:"https://github.com/Wildboar-Software/directory/edit/main/website/docs/setup.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Uses",permalink:"/directory/docs/uses"},next:{title:"Configuration",permalink:"/directory/docs/env"}},d={},c=[{value:"System Requirements",id:"system-requirements",level:2},{value:"Installation / Deployment",id:"installation--deployment",level:2},{value:"Database",id:"database",level:3},{value:"Bitnami Helm Chart",id:"bitnami-helm-chart",level:4},{value:"Configuration",id:"configuration",level:3},{value:"Local",id:"local",level:3},{value:"Docker / Docker-Compose",id:"docker--docker-compose",level:3},{value:"Kubernetes",id:"kubernetes",level:3},{value:"DSA Initialization",id:"dsa-initialization",level:2},{value:"Access Control",id:"access-control",level:2},{value:"Creating the administrative user",id:"creating-the-administrative-user",level:3},{value:"Set a password for the administrative user",id:"set-a-password-for-the-administrative-user",level:3},{value:"Creating the administrative point",id:"creating-the-administrative-point",level:3},{value:"Creating access control subentries",id:"creating-access-control-subentries",level:3},{value:"Making the administrative point an access control administrative point",id:"making-the-administrative-point-an-access-control-administrative-point",level:3}],p={toc:c};function m(e){var t=e.components,a=(0,i.Z)(e,r);return(0,o.kt)("wrapper",(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"setup"},"Setup"),(0,o.kt)("h2",{id:"system-requirements"},"System Requirements"),(0,o.kt)("p",null,"Meerkat DSA requires NodeJS version 17 or higher. With heavy usage, you can\nexpect Meerkat DSA's memory usage to get up to 300MB. It would be wise to\nanticipate the extreme and ensure that Meerkat DSA has at least 500MB of memory."),(0,o.kt)("p",null,"In addition to this, Meerkat DSA needs a database (as detailed below), which may\ntake a lot more memory. You may also wish to set up a reverse HTTP proxy such as\nNginx, Caddy, or Apache, which will also consume some resources."),(0,o.kt)("p",null,"Added together, you should probably have no less than 1 GB of memory free for\nMeerkat DSA, the database, and a reverse proxy (if used)."),(0,o.kt)("p",null,"Meerkat DSA has only been tested on x86-64 platforms, so no guarantees can be\nmade about how it will run on other architectures. Meerkat DSA should run just\nfine on Windows, Mac OS, Linux, and possibly more operating systems, and it has\nbeen briefly tested on all three."),(0,o.kt)("p",null,"X.500 directory traffic is typically not time-sensitive, so high latency is\nusually tolerable. However, the network may need to be able to afford high\nthroughput, since certain operations, such as ",(0,o.kt)("inlineCode",{parentName:"p"},"search")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"list"),", can\npotentially return a lot of data all at once."),(0,o.kt)("h2",{id:"installation--deployment"},"Installation / Deployment"),(0,o.kt)("p",null,"It is recommended that you install Meerkat DSA in a Kubernetes cluster using\nHelm. However, Meerkat DSA can be installed as a Docker Compose app and can also\nrun locally."),(0,o.kt)("h3",{id:"database"},"Database"),(0,o.kt)("p",null,"In any case that you deploy Meerkat DSA, you will need to configure a MySQL\ndatabase that will hold the DSA's data. Ideally, you should use a secure\npassword and TLS to secure the connection to the database. It is also strongly\nrecommended that Meerkat DSA coexist in a physically nearby location to the\ndatabase so that latency is low; if your Meerkat DSA instance has to send its\nqueries to a MySQL database on the other side of the planet, it will mean that\nMeerkat DSA will respond slowly to requests!"),(0,o.kt)("p",null,"You will need to manually create a database within your database server that\nMeerkat DSA can use exclusively. Conventionally, this is named ",(0,o.kt)("inlineCode",{parentName:"p"},"directory"),", but\nyou can name it anything you want as long as you configure your ",(0,o.kt)("inlineCode",{parentName:"p"},"DATABASE_URL"),"\nto use that database."),(0,o.kt)("admonition",{type:"note"},(0,o.kt)("p",{parentName:"admonition"},"The ",(0,o.kt)("inlineCode",{parentName:"p"},"bitnami/mysql")," Helm chart will allow you to define a database to create\non startup, so you will not need to manually log into this database server to\ncreate this database. Different container images may also allow you to define\na database to create on startup as well.")),(0,o.kt)("p",null,'The MySQL database will then need to be seeded with database schema. In\ntechnical terms, we need to "deploy a migration" to the database. You will need\na user account that has all permissions to alter database schema. It is fine if\nthis is a root / administrator account, since this will only be used once. How\nyou actually deploy the migration will depend on how you have deployed Meerkat\nDSA, so this will be described on a case-by-case basis in the sections to\nfollow.'),(0,o.kt)("p",null,"After the database migration is complete, you can run Meerkat DSA with a\ndatabase account having just create + read + update + delete permissions for\nthe database."),(0,o.kt)("h4",{id:"bitnami-helm-chart"},"Bitnami Helm Chart"),(0,o.kt)("p",null,"One of the easiest ways to get a MySQL instance ready to go in a Kubernetes\ncluster is the\n",(0,o.kt)("a",{parentName:"p",href:"https://artifacthub.io/packages/helm/bitnami/mysql"},"Bitnami Helm chart"),"."),(0,o.kt)("p",null,"Here is one way to do this:"),(0,o.kt)("p",null,"Run this command to create a secret in Kubernetes:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl create secret generic <your secret name> \\\n  --from-literal=mysql-root-password=<your root password> \\\n  --from-literal=mysql-replication-password=<your rep password> \\\n  --from-literal=mysql-password=<your other password> \\\n  --namespace=<your namespace>\n")),(0,o.kt)("p",null,"Add the Bitnami Helm repo via this command:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"helm repo add bitnami https://charts.bitnami.com/bitnami\n")),(0,o.kt)("p",null,"Finally, install MySQL from the Bitnami Helm repo via this command:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"helm install <your database name> bitnami/mysql \\\n  --set auth.existingSecret=<your secret name> \\\n  --set auth.database=directory \\\n  --atomic \\\n  --namespace=<your namespace>\n")),(0,o.kt)("h3",{id:"configuration"},"Configuration"),(0,o.kt)("p",null,"Meerkat DSA is configured through environment variables. These environment\nvariables and their effects are documented ",(0,o.kt)("a",{parentName:"p",href:"/directory/docs/env"},"here"),"."),(0,o.kt)("p",null,"At minimum, you MUST define ",(0,o.kt)("inlineCode",{parentName:"p"},"DATABASE_URL"),". Besides that, you SHOULD define the\nfollowing other environment variables:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_SIGNING_CERTS_CHAIN_FILE"),", which is documented ",(0,o.kt)("a",{parentName:"li",href:"/directory/docs/env#meerkatsigningcertschainfile"},"here"),"."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_SIGNING_KEY_FILE"),", which is documented ",(0,o.kt)("a",{parentName:"li",href:"/directory/docs/env#meerkatsigningkeyfile"},"here"),"."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_TLS_CERT_FILE"),", which is documented ",(0,o.kt)("a",{parentName:"li",href:"/directory/docs/env#meerkattlscertfile"},"here"),"."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"MEERKAT_TLS_KEY_FILE"),", which is documented ",(0,o.kt)("a",{parentName:"li",href:"/directory/docs/env#meerkattlskeyfile"},"here"),"."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"NODE_ENV"),", which should always be set to ",(0,o.kt)("inlineCode",{parentName:"li"},"production")," unless you are\ndebugging or developing Meerkat DSA."),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"LANG"),", which should be set to the locale identifier for your desired locale.\nThis will determine the language used for logging as well as the language for\nerror messages. For American English, this should be ",(0,o.kt)("inlineCode",{parentName:"li"},"en_US.utf8"),".")),(0,o.kt)("admonition",{type:"note"},(0,o.kt)("p",{parentName:"admonition"},"The ",(0,o.kt)("inlineCode",{parentName:"p"},"LANG")," environment variable will NOT affect the web administration console.\nThe web administration console does not support internationalization at all.")),(0,o.kt)("h3",{id:"local"},"Local"),(0,o.kt)("p",null,"To do this, you must have Node.js version 17 or higher installed. This will\nalso install Node Package Manager (",(0,o.kt)("inlineCode",{parentName:"p"},"npm"),"). You will also need Git installed.\nYou will also need a MySQL database somewhere ofr"),(0,o.kt)("p",null,"You can run Meerkat DSA locally by cloning the\n",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Wildboar-Software/directory"},"source repository for Meerkat DSA"),"\nby running ",(0,o.kt)("inlineCode",{parentName:"p"},"git clone https://github.com/Wildboar-Software/directory"),"."),(0,o.kt)("p",null,"Then run ",(0,o.kt)("inlineCode",{parentName:"p"},"npm install"),". This will install all of the dependencies for this\nproject to build and work."),(0,o.kt)("p",null,"Run ",(0,o.kt)("inlineCode",{parentName:"p"},"npx nx run meerkat:build:production")," to build Meerkat DSA for the system\nyou are running. This will put the compiled output into\n",(0,o.kt)("inlineCode",{parentName:"p"},"./dist/apps/meerkat/main.js"),". You can run this JavaScript file via\n",(0,o.kt)("inlineCode",{parentName:"p"},"node ./dist/apps/meerkat/main.js"),", however, it will probably not work right\naway."),(0,o.kt)("p",null,"You will need to configure Meerkat DSA using environment variables. How\nyou do this will depend on whether you are using Windows, Linux, Mac, or some\nother operating system, but you can look at what you need to get it up and\nrunning on the ",(0,o.kt)("a",{parentName:"p",href:"/directory/docs/env"},"Configuration Environment Variables documentation"),"."),(0,o.kt)("p",null,"There is technically only one environment variable that is required, which is\n",(0,o.kt)("inlineCode",{parentName:"p"},"DATABASE_URL"),". Set this to the URL of your database."),(0,o.kt)("p",null,"Once you have your environment variables defined to configure Meerkat DSA as\nyou'd like, you will need to actually configure the database with the schema\nneeded to store Meerkat DSA's data, which you can do by running\n",(0,o.kt)("inlineCode",{parentName:"p"},"npx prisma migrate deploy --schema=apps/meerkat/src/prisma/schema.prisma"),"."),(0,o.kt)("p",null,"Then run ",(0,o.kt)("inlineCode",{parentName:"p"},"node ./dist/apps/meerkat/main.js"),". You should see your application\nstart up on the console (unless you turned off console logging)."),(0,o.kt)("h3",{id:"docker--docker-compose"},"Docker / Docker-Compose"),(0,o.kt)("p",null,"You can define your own Docker-Compose stack that will pull the Meerkat DSA\nimage ",(0,o.kt)("inlineCode",{parentName:"p"},"ghcr.io/wildboar-software/meerkat-dsa")," and wire it up to a MySQL\ndatabase, but the\n",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Wildboar-Software/directory"},"source repository for Meerkat DSA"),"\nhas a\n",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Wildboar-Software/directory/blob/master/pkg/docker-compose.yaml"},"starter template"),"\nthat you can use."),(0,o.kt)("p",null,"The starter template will create a MySQL database, deploy the migrations to it,\nand start Meerkat DSA. Pretty much all you have to do is configure the\nenvironment variables and mount volumes for your signing key and cert, your\nTLS key and cert, your CA certificates bundle, your CRLs, your init script, and\nany other files that you may want to be in the container."),(0,o.kt)("h3",{id:"kubernetes"},"Kubernetes"),(0,o.kt)("admonition",{type:"info"},(0,o.kt)("p",{parentName:"admonition"},"There is a lot that goes into using Kubernetes and Helm--far more than I could\npossibly teach you in this documentation. Therefore, this documentation will\nassume that you have a working understanding of Kubernetes.")),(0,o.kt)("p",null,"As with Docker-Compose, you may define your own Kubernetes manifests to deploy\nMeerkat DSA, however, ",(0,o.kt)("a",{parentName:"p",href:"https://wildboarsoftware.com/en"},"Wildboar Software")," has\ndefined a ",(0,o.kt)("a",{parentName:"p",href:"https://helm.sh/"},"Helm")," chart for easy installation and removal."),(0,o.kt)("p",null,"To install via Helm, first you must have ",(0,o.kt)("inlineCode",{parentName:"p"},"helm")," installed, which you can do by\nfollowing ",(0,o.kt)("a",{parentName:"p",href:"https://helm.sh/docs/intro/install/"},"these instructions"),". You must\nalso have a Kubernetes cluster running."),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"Note that you do not have to run the official Kubernetes control\nplane. There are plenty of other great alternatives such as K3s, Microk8s, and\nMinikube, all of which should work, and some of which are more suitable for\nlower-powered devices.")),(0,o.kt)("p",null,"If you haven't ",(0,o.kt)("a",{parentName:"p",href:"#database"},"set up the database"),", by now, do so."),(0,o.kt)("p",null,"When you have ",(0,o.kt)("inlineCode",{parentName:"p"},"helm")," installed, a Kubernetes cluster up and running, and you\nhave authenticated to the cluster, you need to define a Kubernetes secret that\nyour Meerkat DSA deployment can use to access your database. This needs to be\na Kubernetes ",(0,o.kt)("inlineCode",{parentName:"p"},"Secret")," and not a ",(0,o.kt)("inlineCode",{parentName:"p"},"ConfigMap"),", because your database URL will most\nlikely include a username and password. You can create this secret using this\ncommand:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"kubectl create secret generic <your secret name> \\\n  --from-literal=databaseUrl=<your database url> \\\n  --namespace=<your namespace>\n")),(0,o.kt)("p",null,"Obviously, substitute ",(0,o.kt)("inlineCode",{parentName:"p"},"<your secret name>"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"<your database url>"),", and\n",(0,o.kt)("inlineCode",{parentName:"p"},"<your namespace>")," in the example above. The Kubernetes secret MUST have the\nkey ",(0,o.kt)("inlineCode",{parentName:"p"},"databaseUrl"),". You CANNOT name this something else. Note that\nWildboar Software's Helm chart, by default, will seek to mount a secret named\n",(0,o.kt)("inlineCode",{parentName:"p"},"meerkat-database-secret"),", so this is what you SHOULD name this secret, unless\nyou have multiple DSA instances that you expect to run."),(0,o.kt)("p",null,"There may be other secrets that you wish to create, such as the signing secret\nand TLS secret. These can be done with a slightly different command. Both of\nthese secrets are of type ",(0,o.kt)("inlineCode",{parentName:"p"},"kubernetes.io/tls")," and can be created using the\ncommand ",(0,o.kt)("inlineCode",{parentName:"p"},"kubectl create secret tls ..."),"."),(0,o.kt)("p",null,"When you have created all of the ",(0,o.kt)("inlineCode",{parentName:"p"},"ConfigMap"),"s and ",(0,o.kt)("inlineCode",{parentName:"p"},"Secret"),"s you plan to create,\nrun these commands to deploy Meerkat DSA:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Run ",(0,o.kt)("inlineCode",{parentName:"li"},"helm repo add wildboar https://wildboarprod.blob.core.windows.net/helm-charts"),".\nThis will install Wildboar Software's Helm repository to your saved list of\nrepositories so you can use Helm charts defined by Wildboar Software."),(0,o.kt)("li",{parentName:"ol"},"Run ",(0,o.kt)("inlineCode",{parentName:"li"},"helm repo update"),". This will update your local cache of all Helm charts\nthat are available in your configured repositories."),(0,o.kt)("li",{parentName:"ol"},"Run ",(0,o.kt)("inlineCode",{parentName:"li"},"helm install <release-name> wildboar/meerkat-dsa ..."),", but replace\n",(0,o.kt)("inlineCode",{parentName:"li"},"<release-name>")," with any name you choose for your Meerkat DSA deployment,\nand replace the ",(0,o.kt)("inlineCode",{parentName:"li"},"...")," with any other command arguments you need to supply to\nHelm to customize your deployment. At a minimum, you may want to append\n",(0,o.kt)("inlineCode",{parentName:"li"},"--set databaseSecretName=<your database secret name>"),". If you want your\ninstance to be publicly accessible, add ",(0,o.kt)("inlineCode",{parentName:"li"},"--set service.type=LoadBalancer")," to\nthat command.")),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"You should configure Kubernetes\n",(0,o.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity"},"inter-pod affinity"),"\nso that your Meerkat DSA runs on the same node as your database to minimize\nlatency. It does not seem like there is an easy way to do this using the Helm\nCLI alone: you might have to define a values override file. See\n",(0,o.kt)("inlineCode",{parentName:"p"},".github/workflows/main.yml")," within this repository for an example\n(specifically, the ",(0,o.kt)("inlineCode",{parentName:"p"},"deploy_demo")," job).")),(0,o.kt)("p",null,"If you want access to the web admin console, add\n",(0,o.kt)("inlineCode",{parentName:"p"},"--set dangerouslyExposeWebAdmin=true")," to the command above, but be sure to\nconfigure authentication for it or put it behind a secure reverse HTTP proxy\nthat requires authentication and TLS. Client TLS authentication would be even\nbetter than basic authentication."),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"Access to the web administration console means full permission to do anything.\nIt is highly recommended that you not only configure\n",(0,o.kt)("a",{parentName:"p",href:"/directory/docs/webadmin#authentication"},"authentication")," for it, but also use Kubernetes\n",(0,o.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/concepts/services-networking/network-policies/"},"Network Policy"),"\nto ensure that other pods cannot even reach it."),(0,o.kt)("p",{parentName:"admonition"},"As an even more secure measure, you may simply not expose a service for that pod\nat all, requiring that you use\n",(0,o.kt)("a",{parentName:"p",href:"https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod"},(0,o.kt)("inlineCode",{parentName:"a"},"kubectl port-forward")),"\nto access it. This means that only your Kubernetes cluster administrators would\nbe able to reach the web admin console, but this might work for your use case.")),(0,o.kt)("p",null,"You can see example deployments to Kubernetes clusters in Bash scripts\n",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Wildboar-Software/directory/blob/master/scripts/publish.sh"},"here"),"\nand in GitHub Actions YAML configuration\n",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Wildboar-Software/directory/blob/master/.github/workflows/main.yml"},"here"),"."),(0,o.kt)("h2",{id:"dsa-initialization"},"DSA Initialization"),(0,o.kt)("p",null,"When your DSA comes online, if there is not root DSE, your DSA will create it.\nOtherwise, there are no entries in existence."),(0,o.kt)("h2",{id:"access-control"},"Access Control"),(0,o.kt)("p",null,"At this point, your DSA will be world-readable and world-writeable. If you do\nnot want this, you will need to implement access controls. To do this, you will\nneed to define an Access Control Specific Area (ACSA) that spans the entirety of\nyour autonomous administrative area. To do this, you will need to do these\nthings in this specific order (details to follow):"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"Create an administrative user.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"Set a password for the administrative user.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"Create an administrative point, then")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"Create access control subentries under this administrative point, then")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"Add the ",(0,o.kt)("inlineCode",{parentName:"p"},"id-ar-accessControlSpecificArea")," value to the ",(0,o.kt)("inlineCode",{parentName:"p"},"administrativeRole"),"\nattribute of the administrative point, and set the ",(0,o.kt)("inlineCode",{parentName:"p"},"accessControlScheme"),"\nattribute of the administrative point."),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"basicAccessControlScheme")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"simplifiedAccessControlScheme")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rule-based-access-control")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rule-and-basic-access-control")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"rule-and-simple-access-control"))))),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"If you create the administrative point with an ACSA role before creating the\nsubentries, you might be locked out, unable to read or write anything including\nand below that administrative point! This is because an absence of Access\nControl Information (ACI) items, as would be present in subentries, indicates\na denial of access. Creating the ACSA administrative point is the switch that\nturns access control on. Ensure you configure your ACI items in your ACSA and\nACIA subentries are configured to allow you to continue to set up your DSA!")),(0,o.kt)("h3",{id:"creating-the-administrative-user"},"Creating the administrative user"),(0,o.kt)("p",null,"You will need to create a DSE of type ",(0,o.kt)("inlineCode",{parentName:"p"},"entry")," that will represent the\nadministrator of the DSA. There are no requirements as to what object classes\nthis entry must have."),(0,o.kt)("h3",{id:"set-a-password-for-the-administrative-user"},"Set a password for the administrative user"),(0,o.kt)("p",null,"This administrator's DSE should have a password set through the\n",(0,o.kt)("inlineCode",{parentName:"p"},"administerPassword")," operation, which will set a password for this entry. The\npassword SHOULD NOT be set using the ",(0,o.kt)("inlineCode",{parentName:"p"},"modifyEntry")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"addEntry")," operation."),(0,o.kt)("h3",{id:"creating-the-administrative-point"},"Creating the administrative point"),(0,o.kt)("p",null,"You may use an existing administrative point if you'd like, but, again, anything\nin your DSA that is not enclosed by an ACSA admininstrative point will be\nworld-readable and world-writeable. This administrative point MUST NOT have the\n",(0,o.kt)("inlineCode",{parentName:"p"},"id-ar-accessControlSpecificArea")," role value present in its ",(0,o.kt)("inlineCode",{parentName:"p"},"administrativeRole"),"\nattribute (for right now)."),(0,o.kt)("h3",{id:"creating-access-control-subentries"},"Creating access control subentries"),(0,o.kt)("p",null,"You will need to create access control subentries beneath your soon-to-be\naccess control administrative point. These subentries contain Access Control\nInformation (ACI) items. These subentries shall:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Have an ",(0,o.kt)("inlineCode",{parentName:"li"},"objectClass")," attribute having a value ",(0,o.kt)("inlineCode",{parentName:"li"},"accessControlSubentry"),"."),(0,o.kt)("li",{parentName:"ul"},"Have a ",(0,o.kt)("inlineCode",{parentName:"li"},"prescriptiveACI")," attribute with values.")),(0,o.kt)("p",null,"Defining what ACI items are here is outside of scope for this documentation, but\nthe ACI items that you define SHOULD:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Allow administrators all permissions to all entries."),(0,o.kt)("li",{parentName:"ul"},"Allow users to read and write to their own entries,",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Including:",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Changing their passwords"),(0,o.kt)("li",{parentName:"ul"},"Deleting their entry"))),(0,o.kt)("li",{parentName:"ul"},"Excluding:",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"Modifying operational attributes"))))),(0,o.kt)("li",{parentName:"ul"},"Allow unauthenticated / anonymous users to only read non-sensitive entries and\nattributes, if any.")),(0,o.kt)("p",null,"When defining ACI items, keep in mind that the server will apply a configurable\nlocal qualifier to the calculated ",(0,o.kt)("inlineCode",{parentName:"p"},"AuthenticationLevel"),' for a user based on\nwhether the connection is secured through Transport Layer Security (TLS) or some\nother means. The "points" that Meerkat assigns to a connection secured as such\nis determined by the value of the environment variable\n',(0,o.kt)("inlineCode",{parentName:"p"},"AUTH_LEVEL_LOCAL_QUALIFIER_POINTS_FOR_TLS"),". This environment variable shall\ncontain a reasonably-sized (not extremely large) integer."),(0,o.kt)("p",null,"The ACI items you define SHOULD be few in number, and, for performance reasons,\nall ACI items within an ACSA SHOULD have distinct ",(0,o.kt)("inlineCode",{parentName:"p"},"precedence")," values."),(0,o.kt)("h3",{id:"making-the-administrative-point-an-access-control-administrative-point"},"Making the administrative point an access control administrative point"),(0,o.kt)("p",null,"You should then define an access control administrative point. This can overlap\nwith your autonomous administrative point. This is a DSE of type ",(0,o.kt)("inlineCode",{parentName:"p"},"admPoint")," that\nhas an ",(0,o.kt)("inlineCode",{parentName:"p"},"administrativeRole")," attribute having value\n",(0,o.kt)("inlineCode",{parentName:"p"},"id-ar-accessControlSpecificArea"),"."),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"If you do not have access control administrative points defined, your DSA will\nbe world-readable and world-writeable!")),(0,o.kt)("p",null,"One this point exists, your access control will activate."))}m.isMDXComponent=!0}}]);