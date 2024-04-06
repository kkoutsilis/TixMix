TixMix

[![Auth tests](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-auth.yml/badge.svg)](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-auth.yml)
[![Orders tests](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-orders.yml/badge.svg)](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-orders.yml)
[![Tickets tests](https://github.com/koutsilis1999/TixMix/actions/workflows/test-tickets.yml/badge.svg)](https://github.com/koutsilis1999/TixMix/actions/workflows/test-tickets.yml)
[![Payments tests](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-payments.yml/badge.svg)](https://github.com/koutsilis1999/TixMix/actions/workflows/tests-payments.yml)

## Locan Development

For sending emails locally, we are using [mailhog](https://github.com/mailhog/MailHog)

Install the following tools in you system

- [Docker](https://docs.docker.com/engine/install/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [Skaffold](https://skaffold.dev/docs/install/)

Create the following secrets

```sh
kubectl create secret generic app-env --from-literal=APP_ENV=development
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<secret>
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<secret>
kubectl create secret generic mail-host --from-literal=MAIL_HOST=mailhog-srv
kubectl create secret generic mail-port --from-literal=MAIL_PORT=1025
```

You can get a stripe test api key from [here](https://dashboard.stripe.com/test/apikeys).

Add the following to your host file

```
127.0.0.1 tixmix.dev
127.0.0.1 mailhog.local
```

Enable ingress

```sh
minikube addson enable ingress
```

Startup minikube cluster, this requires docker running in your system

```sh
minikube start
```

Make sure that the baseURL in `clinet/api/build-client.ts` is pointing to `"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"`

Spinup the applicaton

```sh
skaffold dev
```

In case you are using windows with WSL you will need to also run the follwoing to be able to access the app through your browser

```sh
minikube tunnel
```

You can access the application by typing `tixmix.dev` into your browser.
You can access mailhog by typing `mailhog.local` into your brower.
