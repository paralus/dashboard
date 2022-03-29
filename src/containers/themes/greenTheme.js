import green from "@material-ui/core/colors/green";
import orange from "@material-ui/core/colors/orange";

export default {
  palette: {
    primary: green,
    secondary: {
      ...orange,
      500: orange.A700,
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
