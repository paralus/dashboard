import http from "./Config";

export function getMetros() {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  return function (dispatch) {
    http("infra")
      .get(`partner/${partner}/location`)
      .then((response) => {
        dispatch({ type: "get_metro_list_success", payload: response });
      })
      .catch((error) => {
        dispatch({
          type: "get_metro_list_error",
          payload: error.response.data,
        });
      });
  };
}

export function addLocation(params) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  return function (dispatch) {
    http("infra")
      .post(`partner/${partner}/location`, params)
      .then((response) => {
        dispatch({ type: "add_location_success", payload: response });
        http("infra")
          .get(`partner/${partner}/location`)
          .then((response) => {
            dispatch({ type: "get_metro_list_success", payload: response });
          })
          .catch((error) => {
            dispatch({
              type: "get_metro_list_error",
              payload: error.response.data,
            });
          });
      })
      .catch((error) => {
        dispatch({ type: "add_location_error", payload: error.response.data });
      });
  };
}

export function editLocation(params) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  return function (dispatch) {
    http("infra")
      .put(`partner/${partner}/location/${params.metadata.name}`, params)
      .then((response) => {
        dispatch({ type: "edit_location_success", payload: response });
        http("infra")
          .get(`partner/${partner}/location`)
          .then((response) => {
            dispatch({ type: "get_metro_list_success", payload: response });
          })
          .catch((error) => {
            dispatch({
              type: "get_metro_list_error",
              payload: error.response.data,
            });
          });
      })
      .catch((error) => {
        dispatch({ type: "edit_location_error", payload: error.response.data });
      });
  };
}

export function deleteLocation(name) {
  const partner = JSON.parse(window?.localStorage.getItem("partner"));
  return function (dispatch) {
    http("infra")
      .delete(`partner/${partner}/location/${name}`, {})
      .then((response) => {
        dispatch({ type: "delete_location_success", payload: response });
        http("infra")
          .get(`partner/${partner}/location`)
          .then((response) => {
            dispatch({ type: "get_metro_list_success", payload: response });
          })
          .catch((error) => {
            dispatch({
              type: "get_metro_list_error",
              payload: error.response.data,
            });
          });
      })
      .catch((error) => {
        dispatch({
          type: "delete_location_error",
          payload: error.response.data,
        });
      });
  };
}

export function resetLocationError() {
  return { type: "reset_location_error" };
}
