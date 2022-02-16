import pink from "@material-ui/core/colors/pink";
import teal from "@material-ui/core/colors/teal";

export default {
  palette: {
    primary: pink,
    secondary: {
      ...teal,
      500: teal.A700
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
