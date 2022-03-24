import React from "react";
import T from "i18n-react";

import GenericTextField from "./Fields/GenericTextField";
import LocationField from "./Fields/LocationField";

const General = (props) => {
  return (
    <div>
      <div className="row mb-2 p-3">
        <div className="col-md-11">
          <h3>General</h3>
        </div>
      </div>
      <hr className="my-0" />
      <div className="px-3 pb-4 pt-3">
        <div className="row">
          <div className="col-md-6">
            <GenericTextField
              required
              name="edge-name"
              label="Name"
              value={props.edge.metadata.name || ""}
              type="text"
              onChange={props.handleEdgeChange("name")}
              disabled
            />
          </div>
          <div className="col-md-6 text-muted pl-4 pt-4">
            <T.span
              text="A unique name for your cluster in the project"
              style={{ fontStyle: "italic", fontSize: "smaller" }}
            />
          </div>
        </div>
        {["manual", "imported"].includes(props.edge.spec.clusterType) && (
          <div className="row">
            <div className="col-md-6">
              <LocationField
                edge={props.edge}
                handleEdgeChange={props.handleEdgeChange}
                metroNotConfigured={props.metroNotConfigured}
              />
            </div>
            <div className="col-md-6 text-muted pl-4 pt-4">
              <T.span
                text="Indicate geo-location of cluster if you wish to use location based policies"
                style={{ fontStyle: "italic", fontSize: "smaller" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default General;
