import deepPurple from "@material-ui/core/colors/deepPurple";
import amber from "@material-ui/core/colors/amber";

export default {
  palette: {
    primary: deepPurple,
    secondary: {
      ...amber,
      500: amber.A700
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
