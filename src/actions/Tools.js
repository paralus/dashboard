import http from "./Config";

export function getCLiConfig() {
  return function (dispatch) {
    http("auth")
      .get(`cli/config`)
      .then((response) => {
        console.log(response);
        dispatch({ type: "get_cli_config_data", payload: response });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function getKubeConfig(accountid, onSuccess, onError) {
  const organization = JSON.parse(window?.localStorage.getItem("organization"));
  return function () {
    http(
      "v2/sentry/kubeconfig/user?opts.account=" +
        accountid +
        "&opts.organization=" +
        organization,
      "",
      true
    )
      .get()
      .then((response) => {
        onSuccess(response.data);
      })
      .catch((error) => {
        console.log(error);
        onError();
      });
  };
}
