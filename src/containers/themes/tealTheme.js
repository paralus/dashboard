import indigo from "@material-ui/core/colors/indigo";
import teal from "@material-ui/core/colors/teal";
import red from "@material-ui/core/colors/red";

export default {
  palette: {
    default: teal,
    primary: teal,
    secondary: {
      ...red,
      500: red.A200,
    },
  },
  status: {
    danger: red,
  },
  typography: {
    button: {
      fontWeight: 400,
      textAlign: "capitalize",
    },
  },
};
