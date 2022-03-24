import React from "react";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import { getDownloadBootstrapYAML } from "actions/index";
import { useDownloadTextAsFile } from "utils/helpers";

const ComponentStyle = {
  typeHelptext: { fontSize: "14px" },
  instructions: { padding: "25px", height: "100%" },
  ml50: { marginLeft: "50px" },
  textBlack: { color: "black", fontWeight: "500" },
  textChoco: { color: "chocolate", fontWeight: "400" },
};

const ClusterConfigDownload = ({ edge, clusterStatus }) => {
  if (!edge) return null;
  const getDownloadLink = useDownloadTextAsFile();
  return (
    <div>
      {clusterStatus.ClusterRegister !== "Success" && (
        <Paper style={ComponentStyle.instructions}>
          <h2>Cluster Registration Instructions</h2>
          <p className="mt-3" style={ComponentStyle.typeHelptext}>
            1. Click the button below to download the bootstrap YAML file to
            register the cluster.
          </p>
          <Button
            variant="contained"
            className="jr-btn jr-btn-label left text-nowrap text-white mt-2"
            onClick={(_) => {
              getDownloadBootstrapYAML(edge.metadata.name).then((res) => {
                getDownloadLink(
                  res.data,
                  `${edge.metadata.name}-bootstrap.yaml`,
                  "application/yaml"
                ).click();
              });
            }}
            style={ComponentStyle.ml50}
            color="primary"
          >
            <i className="zmdi zmdi-download zmdi-hc-fw " />
            <span>Download Bootstrap YAML</span>
          </Button>
          <p className="mt-3" style={ComponentStyle.typeHelptext}>
            2. Run &nbsp;
            <span style={ComponentStyle.textBlack}>
              kubectl apply -f &nbsp;
              <i style={ComponentStyle.textChoco}>[path to file]</i>
              {`/${edge.metadata.name}-bootstrap.yaml`} &nbsp;
            </span>
            on your kubernetes cluster.
          </p>
          <p className="mt-3" style={ComponentStyle.typeHelptext}>
            3. Once the bootstrap YAML file is installed, the status of the
            cluster will be reflected in the status panel. Generally it might
            take 3-5 mins for the registration to complete.
          </p>
        </Paper>
      )}
    </div>
  );
};

export default ClusterConfigDownload;
