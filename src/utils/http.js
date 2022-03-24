import Axios from "axios";
import Cookies from "js-cookie";

export default function http(type, version = "v1", headers = {}) {
  const baseURL = version === "" ? `/${type}/` : `/${type}/${version}/`;
  const instance = Axios.create({
    baseURL,
    timeout: 60000 * 2,
    headers: {
      ...headers,
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 502 || error.response.status === 503) {
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
    }
  );

  return instance;
}
