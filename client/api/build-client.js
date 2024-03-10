import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    //on the server
    const isDevelopment = process.env.APP_ENV.toLowerCase() === 'development';
    const baseURL = isDevelopment
      ? 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
      : 'http://www.tixmix.store';
    return axios.create({
      baseURL,
      headers: req.headers,
    });
  } else {
    return axios.create({ baseURL: "/" });
  }
};
