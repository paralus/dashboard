import React from "react";
import Switch from "@material-ui/core/Switch";

function SwitchField({ label, name, checked, onChange, colSpan = [] }) {
  const [first, second, third] = colSpan;
  return (
    <div className="row">
      <div className={`col-md-${first} py-2`}>{label}</div>
      <div className={`col-md-${second}`}>
        <Switch
          color="primary"
          name={name}
          checked={checked}
          onChange={onChange}
        />
      </div>
      <div className={`col-md-${third} py-2`}>
        {checked ? "Enabled" : "Disabled"}
      </div>
    </div>
  );
}

export default SwitchField;
