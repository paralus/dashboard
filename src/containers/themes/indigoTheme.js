import indigo from "@material-ui/core/colors/indigo";
import pink from "@material-ui/core/colors/pink";

export default {
  palette: {
    primary: indigo,
    secondary: {
      ...pink,
      500: pink.A200,
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
