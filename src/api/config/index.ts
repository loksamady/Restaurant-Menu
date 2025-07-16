/* eslint-disable @typescript-eslint/ban-types */
import { useAuthStore } from "@src/state/auth";
import { handleAxiosError } from "@src/util/errorUtil";
import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.APP_API_URL,
  timeout: 60000,
});

export const get = async <Query = {}>(
  url: string,
  query?: Query,
  secure?: boolean
) => {
  try {
    const token = useAuthStore.getState().auth.token;
    const response = await instance({
      method: "get",
      url: url,
      params: query,
      headers: {
        Authorization: secure && token ? `Bearer ${token}` : undefined,
      },
    }).then((response) => response?.data);
    return response;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const post = <Body = {}, Query = {}>(
  url: string,
  body?: Body,
  query?: Query,
  secure?: boolean
) => {
  try {
    const token = useAuthStore.getState().auth.token;
    const response = instance
      .post(url, body, {
        params: query,
        headers: {
          Authorization: secure && token ? `Bearer ${token}` : undefined,
        },
      })
      .then((response) => response?.data);
    return response;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const put = <Body, Query = {}>(
  url: string,
  body: Body,
  query?: Query,
  secure?: boolean
) => {
  try {
    const token = useAuthStore.getState().auth.token;
    const response = instance
      .put(url, body, {
        params: query,
        headers: {
          Authorization: secure && token ? `Bearer ${token}` : undefined,
        },
      })
      .then((response) => response?.data);

    return response;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const remove = <Query = {}>(
  url: string,
  query?: Query,
  secure?: boolean
) => {
  try {
    const token = useAuthStore.getState().auth.token;
    const response = instance
      .delete(url, {
        params: query,
        headers: {
          Authorization: secure && token ? `Bearer ${token}` : undefined,
        },
      })
      .then((response) => response?.data);
    return response;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const patch = <Query = {}>(
  url: string,
  query?: Query,
  secure?: boolean
) => {
  try {
    const token = useAuthStore.getState().auth.token;
    const response = instance
      .patch(
        url,
        {}, // Empty object if there's no data to send in the PATCH request
        {
          params: query,
          headers: {
            Authorization: secure && token ? `Bearer ${token}` : undefined,
          },
        }
      )
      .then((response) => response?.data);

    return response;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const postFormData = <Body = {}, Query = {}>(
  url: string,
  body?: Body,
  query?: Query,
  secure?: boolean
) => {
  try {
    const token = useAuthStore.getState().auth.token;
    const response = instance
      .post(url, body, {
        params: query,
        headers: {
          Authorization: secure && token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response?.data);
    return response;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const putFormData = <Body, Query = {}>(
  url: string,
  body: Body,
  query?: Query,
  secure?: boolean
) => {
  try {
    const token = useAuthStore.getState().auth.token;
    const response = instance
      .put(url, body, {
        params: query,
        headers: {
          Authorization: secure && token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response?.data);

    return response;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const secureGet = async <Query = {}>(url: string, query?: Query) => {
  return get(url, query, true);
};

export const securePost = async <Body = {}, Query = {}>(
  url: string,
  body?: Body,
  query?: Query
) => {
  return post(url, body, query, true);
};

export const securePut = async <Body = {}, Query = {}>(
  url: string,
  body: Body,
  query?: Query
) => {
  return put(url, body, query, true);
};

export const secureRemove = async <Query = {}>(url: string, query?: Query) => {
  return remove(url, query, true);
};

export const securePatch = async <Query = {}>(url: string, query?: Query) => {
  return patch(url, query, true);
};

export const securePostFormData = async <Body = {}, Query = {}>(
  url: string,
  body?: Body,
  query?: Query
) => {
  return postFormData(url, body, query, true);
};

export const securePutFormData = async <Body = {}, Query = {}>(
  url: string,
  body: Body,
  query?: Query
) => {
  return putFormData(url, body, query, true);
};
