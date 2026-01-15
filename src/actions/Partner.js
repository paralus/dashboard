import http from "./Config";
import getInitOrganization from "./Organization";

export function initializeApp(callback) {
  return function (dispatch) {
    http("auth")
      .get("partner")
      .then((response) => {
        dispatch({
          type: "get_partner_detail_success",
          payload: response.data,
        });
        localStorage.setItem(
          "partner_id",
          JSON.stringify(response.data.metadata.id)
        );
        localStorage.setItem(
          "partner",
          JSON.stringify(response.data.metadata.name)
        );
        dispatch(getInitOrganization(response.data.metadata.name, callback));
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
