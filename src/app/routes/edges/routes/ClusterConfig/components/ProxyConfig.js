import React, { useEffect, useState } from "react";
import {
  FormControlLabel,
  Checkbox,
  Paper,
  TextField,
} from "@material-ui/core";
import T from "i18n-react";
import { testProtocol } from "../../../../../../utils/helpers";

import GenericTextField from "./Fields/GenericTextField";

const ProxyConfig = (props) => {
  if (!props.edge) {
    return null;
  }
  const [open, setOpen] = useState(false);

  return (
    <Paper className="p-3">
      <h3
        style={{ color: "teal", cursor: "pointer" }}
        onClick={(_) => setOpen(!open)}
      >
        <span className="mr-2">Proxy Configuration</span>
        {open ? (
          <i className="zmdi zmdi-chevron-down zmdi-hc-lg" />
        ) : (
          <i className="zmdi zmdi-chevron-right zmdi-hc-lg" />
        )}
      </h3>
      <div
        className="text-muted"
        style={{ fontStyle: "italic", fontSize: "smaller" }}
      >
        Configure Proxy if your infrastructure uses an Outbound Proxy
      </div>
      {open && (
        <>
          <div className="row mt-3">
            <div className="col-md-6">
              <FormControlLabel
                control={
                  <Checkbox
                    name="enabled"
                    checked={props.edge.spec.proxyConfig?.enabled || false}
                    onChange={props.handleEdgeChange("enabled")}
                    color="primary"
                  />
                }
                label="Enable Proxy"
              />
            </div>
            <div className="col-md-6 text-muted pl-4 pt-0">
              <T.span
                text="Select this option if your infrastructure is running behind a proxy"
                style={{ fontStyle: "italic", fontSize: "smaller" }}
              />
            </div>
          </div>
          {props.edge.spec.proxyConfig?.enabled && (
            <>
              <div className="row">
                <div className="col-md-6">
                  <GenericTextField
                    name="httpProxy"
                    label="HTTP Proxy"
                    helperText="Ex : http://proxy.example.com:8080/"
                    value={props.edge.spec.proxyConfig?.httpProxy || ""}
                    type="text"
                    onChange={props.handleEdgeChange("httpProxy")}
                    error={testProtocol(props.edge.spec.proxyConfig?.httpProxy)}
                  />
                </div>
                <div className="col-md-6 text-muted pl-4 pt-4">
                  <T.span
                    text="Configure proxy information with protocol, host and port information"
                    style={{ fontStyle: "italic", fontSize: "smaller" }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <GenericTextField
                    name="httpsProxy"
                    label="HTTPS Proxy"
                    helperText="Ex : https://proxy.example.com:8080/"
                    value={props.edge.spec.proxyConfig?.httpsProxy || ""}
                    type="text"
                    onChange={props.handleEdgeChange("httpsProxy")}
                    error={testProtocol(
                      props.edge.spec.proxyConfig?.httpsProxy,
                    )}
                  />
                </div>
                <div className="col-md-6 text-muted pl-4 pt-4">
                  <T.span
                    text="Configure proxy information with protocol, host and port information"
                    style={{ fontStyle: "italic", fontSize: "smaller" }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <GenericTextField
                    name="noProxy"
                    label="No Proxy"
                    helperText="Ex : example.com, 10.96.0.0/12, 10.244.0.0/16"
                    value={props.edge.spec.proxyConfig?.noProxy || ""}
                    type="text"
                    onChange={props.handleEdgeChange("noProxy")}
                  />
                </div>
                <div className="col-md-6 text-muted pl-4 pt-4">
                  <T.span
                    text="Comma seperated list of hosts that need connectivity without proxy"
                    style={{ fontStyle: "italic", fontSize: "smaller" }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <TextField
                    fullWidth
                    name="bootstrapCA"
                    label="Proxy Root CA"
                    rows={4}
                    multiline
                    value={props.edge.spec.proxyConfig?.bootstrapCA || ""}
                    type="text"
                    onChange={props.handleEdgeChange("bootstrapCA")}
                  />
                </div>
                <div className="col-md-6 text-muted pl-4 pt-4">
                  <T.span
                    text="Root CA certificate of the proxy"
                    style={{ fontStyle: "italic", fontSize: "smaller" }}
                  />
                </div>
              </div>

              <div className="row mt-4 mb-4">
                <div className="col-md-6">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="allowInsecureBootstrap"
                        checked={
                          props.edge.spec.proxyConfig?.allowInsecureBootstrap ||
                          false
                        }
                        onChange={props.handleEdgeChange(
                          "allowInsecureBootstrap",
                        )}
                        color="primary"
                      />
                    }
                    label="TLS Termination Proxy"
                  />
                </div>
                <div className="col-md-6 text-muted pl-4 pt-2">
                  <T.span
                    text="Select this option if proxy is terminating/inspecting TLS traffic"
                    style={{ fontStyle: "italic", fontSize: "smaller" }}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </Paper>
  );
};

export default ProxyConfig;
