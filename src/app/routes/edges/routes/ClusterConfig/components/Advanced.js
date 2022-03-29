import React from "react";
import T from "i18n-react";
import ProxyConfig from "./ProxyConfig";

const Advanced = (props) => {
  return (
    <div>
      <div className="row mb-2 p-3">
        <div className="col-md-12">
          <h3>Advanced</h3>
        </div>
        <div className="col-md-12 text-muted">
          {!props.isEdit && (
            <T.span text="Optionally configure these to tune and customize your Kubernetes cluster’s configuration" />
          )}
        </div>
      </div>
      <hr className="my-0" />
      <div className="p-3">
        <div>
          <ProxyConfig
            edge={props.edge}
            handleEdgeChange={props.handleEdgeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Advanced;
