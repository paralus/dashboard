import http from "./Config";
import Cookies from "js-cookie";

export function getServiceProviderConfig(idpId) {
  return http("auth").get(`/sso/idp/${idpId}/spconfig/`);
}
export function getAllIdentityProviders(onSuccess) {
  return function () {
    http("auth")
      .get("/sso/idp/?limit=1000")
      .then((response) => {
        onSuccess(response);
      })
      .catch((error) => {
        console.log("group", error);
      });
  };
}

export function handleIdentityProviderSubmission(
  payload = {},
  idpId = "",
  mode
) {
  return mode === "CREATE"
    ? http("auth").post("/sso/idp/", payload)
    : http("auth").put(`/sso/idp/${idpId}/`, payload);
}

export function deleteIdentityProvider(idpId = "", onSuccess, onFailure) {
  return function () {
    http("auth")
      .delete(`/sso/idp/${idpId}/`)
      .then((response) => {
        onSuccess(response);
      })
      .catch((error) => {
        console.log("group", error);
        if (onFailure) onFailure();
      });
  };
}

export function uploadMetaDataFile(idpId, params) {
  const formData = new FormData();
  formData.append("idp_metadata", params.idp_metadata);
  const config = {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  };
  return http("auth").post(
    `sso/idp/${idpId}/upload_metadata/`,
    formData,
    config
  );
}
