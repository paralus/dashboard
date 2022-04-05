import http from "./Config";
import Cookies from "js-cookie";

export function getServiceProviderConfig(idpId) {
  return http("auth").get(`/sso/oidc/provider/${idpId}`);
}
export function getAllIdentityProviders(onSuccess) {
  return function () {
    http("auth")
      .get("/sso/oidc/provider")
      .then((response) => {
        onSuccess(response);
      })
      .catch((error) => {
        console.log("group", error);
      });
  };
}

export function handleIdentityProviderSubmission(payload = {}, idp = "", mode) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  payload.metadata.partner = partner;
  payload.metadata.organization = organization;
  return mode === "CREATE"
    ? http("auth").post("/sso/oidc/provider", payload)
    : http("auth").put(`/sso/oidc/provider/${idp}`, payload);
}

export function deleteIdentityProvider(idp = "", onSuccess, onFailure) {
  return function () {
    http("auth")
      .delete(`/sso/oidc/provider/${idp}`)
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
