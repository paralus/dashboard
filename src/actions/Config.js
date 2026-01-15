import axios from "axios";
import Cookies from "js-cookie";

export default function http(type, version = "v3", noTrailingSlash = false) {
  let baseURL = version === "" ? `/${type}/` : `/${type}/${version}/`;
  if (noTrailingSlash) {
    baseURL = `/${type}`;
  }
  const instance = axios.create({
    withCredentials: true,
    timeout: 60000 * 2,
    baseURL,
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if ([502, 503].includes(error.response?.status)) {
        const tError = {
          ...error,
          response: {
            ...error.response,
            data: {
              status_code: error.response.status,
              details: [
                {
                  error_code: "",
                  detail: "Server Error. Please try again after sometime.",
                  info: "",
                },
              ],
            },
          },
        };
        return Promise.reject(tError);
      }
      return Promise.reject(error);
    },
  );
  return instance;
}
