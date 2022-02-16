import http from "./Config";

export function getOrganization(partner, name) {
  return function(dispatch) {
    http("auth")
      .get(`partner/${partner}/organization/${name}`)
      .then(response => {
        dispatch({
          type: "get_organizations_success",
          payload: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
}