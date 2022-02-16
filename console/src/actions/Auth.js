export function getUserSessionInfo() {
    return function(dispatch) {
      http("auth")
        .get("users/-/current/")
        .then(response => {
          dispatch({ type: "update_user_session", user: response.data });
          dispatch({ type: "user_login_success", payload: response });
        })
        .catch(error => {
          console.log(error);
          // dispatch({type: "get_user_failed", payload: error.response});
          dispatch({ type: "user_session_expired" });
          // if (error.response.status === 403) {
          //   dispatch({ type: "user_session_expired" });
          // }
        });
    };
  }