import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    //on the server
    // TODO: Probably need to improve that,
    // but this is a future Konstantinos problem :) 
    if (process.env.APP_ENV.toLowerCase() === "development") {
      return axios.create({
        baseURL:
          "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        headers: req.headers,
      });
    } else {
      return axios.create({
        baseURL: "http://www.tixmix.store/",
      });
    }
  } else {
    return axios.create({ baseURL: "/" });
  }
};
