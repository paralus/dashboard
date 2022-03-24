import deepOrange from "@material-ui/core/colors/deepOrange";
import lightBlue from "@material-ui/core/colors/lightBlue";

export default {
  palette: {
    primary: deepOrange,
    secondary: {
      ...lightBlue,
      500: lightBlue.A200,
    },
  },
  status: {
    danger: "orange",
  },
  typography: {
    button: {
      fontWeight: 400,
      textAlign: "capitalize",
    },
  },
};
