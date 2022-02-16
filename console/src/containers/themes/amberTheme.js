import deepOrange from "@material-ui/core/colors/deepOrange";
import amber from "@material-ui/core/colors/amber";

export default {
  palette: {
    primary: amber,
    secondary: {
      ...deepOrange,
      500: deepOrange.A400
    }
  },
  status: {
    danger: "orange"
  },

  typography: {
    button: {
      fontWeight: 400,
      textAlign: "capitalize"
    }
  }
};
