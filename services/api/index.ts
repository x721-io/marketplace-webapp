import axios from "axios";
import { BASE_API_URL } from "@/config/api";

const BASE_REQUEST_OPTIONS = {
  timeout: 10000,
  headers: {
    redirect: "follow",
  },
};

const marketplaceApi = axios.create({
  baseURL: BASE_API_URL,
  ...BASE_REQUEST_OPTIONS,
});

const launchpadAPi = axios.create({
  baseURL: BASE_API_URL,
  ...BASE_REQUEST_OPTIONS,
});

marketplaceApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response.data);
  }
);

launchpadAPi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response.data);
  }
);

const getMarketplaceApi = () => {
  const backendAPI = axios.create({
    baseURL: BASE_API_URL,
    ...BASE_REQUEST_OPTIONS,
  });
  backendAPI.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  // API response interceptor
  backendAPI.interceptors.response.use(
    (response) => response.data,
    (error) => {
      return Promise.reject(error.response.data);
    }
  );

  return backendAPI;
};

const getBackendAPI = () => {
  const backendAPI = axios.create({
    baseURL: BASE_API_URL,
    ...BASE_REQUEST_OPTIONS,
  });
  backendAPI.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  // API response interceptor
  backendAPI.interceptors.response.use(
    (response) => response.data,
    (error) => {
      return Promise.reject(error.response.data);
    }
  );

  return backendAPI;
};

export { marketplaceApi, launchpadAPi, getMarketplaceApi, getBackendAPI };
