import http from "./Config";

export function getPartnerDetails(name) {
  return function(dispatch) {
    http("auth")
      .get(`partner/${name}/`)
      .then(response => {
        dispatch({
          type: "get_partner_detail_success",
          payload: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
}
