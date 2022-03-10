import React from "react";
import { Button } from "@material-ui/core";

const NewResourceButton = ({ label, onClick, disabled }) => {
  return (
    <Button
      variant="contained"
      className="jr-btn jr-btn-label left text-nowrap text-white"
      onClick={onClick}
      disabled={disabled}
      color="primary"
    >
      <i className="zmdi zmdi-plus zmdi-hc-fw " />
      <span>{label}</span>
    </Button>
  );
};

export default NewResourceButton;
