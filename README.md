TixMix

[![Auth tests](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-auth.yml/badge.svg)](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-auth.yml)
[![Orders tests](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-orders.yml/badge.svg)](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-orders.yml)
[![Tickets tests](https://github.com/koutsilis1999/TixMix/actions/workflows/test-tickets.yml/badge.svg)](https://github.com/koutsilis1999/TixMix/actions/workflows/test-tickets.yml)
[![Payments tests](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-payments.yml/badge.svg)](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-payments.yml)

## Locan Development

1) Install the following tools in you system
   - [Docker](https://docs.docker.com/engine/install/)
   - [kubectl](https://kubernetes.io/docs/tasks/tools/)
   - [minikube](https://minikube.sigs.k8s.io/docs/start/)
   - [Skaffold](https://skaffold.dev/docs/install/)

2) Create the following secrets
   ```sh
   kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<secret>
   kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<secret>
   ```

You can get a stripe test api key from [here](https://dashboard.stripe.com/test/apikeys).

3) Add the following to your host file
   ```
   127.0.0.1 tixmix.dev
   ```

4) Enable ingress
   ```sh
   minikube addson enable ingress
   ```

4) Startup minikube cluster, this requires docker running in your system
   ```sh
   minikube start
   ```

5) Make sure that the baseURL in `clinet/api/build-client.ts` is pointing to `"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"`

6) Spinup the applicaton
   ```sh
   skaffold dev
   ```

In case you are using windows with WSL you will need to also run the follwoing to be able to access the app through your browser
   ```sh
   minikube tunnel
   ```

You should be able to access your application by typing `tixmix.dev` into your browser.
