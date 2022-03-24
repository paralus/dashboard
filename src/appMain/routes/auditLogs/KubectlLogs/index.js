import React, { useState } from "react";
import RadioField from "components/FormFields/RadioField";
import { Paper } from "@material-ui/core";
import RelayCommands from "./RelayCommands";
import RelayAPI from "./RelayAPI";

function Kubectl(props) {
  const [auditType, setAuditType] = useState("RelayCommands");
  return (
    <div>
      <Paper className="px-3 pt-3">
        <RadioField
          name="Choose KubeCTL Audit Type"
          value={auditType}
          className="mb-2"
          onChange={(e) => setAuditType(e.target.value)}
          items={[
            { value: "RelayCommands", label: "Commands" },
            { value: "RelayAPI", label: "API Logs" },
          ]}
        />
      </Paper>
      {auditType === "RelayAPI" && <RelayAPI />}
      {auditType === "RelayCommands" && <RelayCommands />}
    </div>
  );
}

export default Kubectl;
