/* eslint-disable no-unused-expressions */
import {
  Box,
  Grid,
  Link,
  makeStyles,
  Button,
  Typography,
} from "@material-ui/core";
import * as R from "ramda";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import React, { useState, useEffect, useContext } from "react";
import MetaItem from "./MetaItem";
import LabelItem from "./LabelTaintItem";
import ClusterLabelEditor from "./ClusterLabelEditor";
import { ClusterViewContext } from "../ClusterViewContexts";
import HideTheChildren from "../../../components/HideTheChildren";
import EditLocation from "./EditLocation";
import { safelyParseJSON, transformLabelsObject, useSnack } from "utils";
import TruncatedTextWithCopy from "./TruncatedTextWithCopy";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    flex: 1,
  },
  imageType: {
    width: "20px",
    marginRight: "5px",
    marginLeft: "1px",
  },
  code: {
    color: "black",
  },
  labelFlex: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "stretch",
    alignContent: "space-between",
    "& > span": {
      margin: "0 12px 12px 0",
    },
  },
  spinnerInner: {
    marginTop: "50px",
  },
}));

const getType = R.cond([
  [R.includes(R.__, ["imported", "v2"]), R.always("Import")],
  [R.equals("manual"), R.always("On-Prem")],
  [R.equals("aws-ec2"), R.always("Amazon-EC2")],
  [R.equals("aws-eks"), R.always("Amazon-EKS")],
  [R.equals("azure-aks"), R.always("azure-aks")],
  [R.equals("google-gcp"), R.always("Google Cloud Platform")],
]);

const getImage = (i) => (type) => {
  switch (type) {
    case "On-Prem":
      return i.OnPrem;
    case "Import":
      return i.K8s;
    case "Amazon-EC2":
      return i.Awsec2;
    case "Amazon-EKS":
      return i.AwsEks;
    case "Google Cloud Platform":
      return i.Gcp;
    default:
      return null;
  }
};

const GetLocation = ({ edge, setOpenEditLocation }) => {
  if (!edge) return null;
  const metro = edge.spec.Metro;
  const OpenBtn = ({ label }) => (
    <Button
      variant="contained"
      dense="true"
      size="small"
      color="primary"
      onClick={(_) => setOpenEditLocation(true)}
    >
      <span>{label}</span>
    </Button>
  );
  if (!metro) return <OpenBtn label="Add" />;

  const [show, setShow] = useState(false);
  const toggleLocation = (e) => {
    e.preventDefault();
    setShow((s) => !s);
  };

  return (
    <React.Fragment>
      <Link component="button" onClick={toggleLocation}>
        {metro.name}
      </Link>
      {show && (
        <React.Fragment>
          <div>
            {metro.city}, {metro.country}
          </div>
          <div>
            {metro.latitude}, {metro.longitude} (Lat, Lon)
          </div>
          {edge.spec.clusterType === "manual" && <OpenBtn label="Edit" />}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

function getPublicIps(edge) {
  const publicIps = [];
  edge.nodes.forEach((node) => {
    if (node && node.roles && node.roles.includes("Proxy")) {
      const publicIP = node.public_ip;
      if (publicIP && !publicIps.includes(publicIP)) {
        publicIps.push(publicIP);
      }
    }
  });

  return publicIps;
}

const dateFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};

function NotSupported({ message = "Not yet supported by Ops Console." }) {
  const classes = useStyles();
  return (
    <Typography variant="subtitle2" color="textSecondary">
      {message}
    </Typography>
  );
}

function ClusterMeta({ edge, refreshEdge, dispatch }) {
  if (!edge) return null;

  const { a, c, i, fromOps } = useContext(ClusterViewContext);
  const classes = useStyles();
  const [edgeObj, setEdgeObj] = useState({ ...edge });
  const [openEditLocation, setOpenEditLocation] = useState(false);
  const [metroNotConfigured, setMetroNotConfigured] = useState(false);
  const [openLabelEditor, setOpenLabelEditor] = useState(false);
  const type = getType(edge.spec.clusterType);
  const labelObject = edge?.metadata?.labels || {};
  const edgeLabels = transformLabelsObject(labelObject);

  const handleEdgeChange = (name) => (event) => {
    let metro = null;
    if (event) {
      metro = {
        name: event.value,
      };
      edgeObj.spec.metro = metro;
    }
    setEdgeObj({
      ...edgeObj,
    });
  };

  const handleEdgeSave = () => {
    if (edgeObj.spec.metro === undefined) {
      setMetroNotConfigured(true);
      return;
    }
    if (edgeObj.metadata.name) {
      a.updateCluster(edgeObj).then(() => {
        setOpenEditLocation(false);
        refreshEdge();
      });
    }
  };

  const renderItems = (items, isEdit) => (
    <>
      {items.length === 0 && `N/A`}
      <Box className={classes.labelFlex}>
        {items.map((item) => (
          <LabelItem key={item.key} item={item} />
        ))}
      </Box>
      {isEdit && !fromOps && (
        <Box>
          <Button
            variant="contained"
            dense="true"
            size="small"
            color="primary"
            onClick={() => setOpenLabelEditor(true)}
          >
            {items.length === 0 ? "Add" : "Edit"}
          </Button>
        </Box>
      )}
    </>
  );

  return (
    <Box p={1 / 2}>
      <Grid container spacing={1}>
        <MetaItem
          label="Type"
          value={
            <div style={{ marginLeft: "-5px" }}>
              {React.createElement(c.ClusterType, {
                type: edge.spec.clusterType,
                params: edge.spec.params,
              })}
            </div>
          }
        />
        <MetaItem
          label="Location"
          value={
            <GetLocation
              edge={edge}
              setOpenEditLocation={setOpenEditLocation}
            />
          }
        />

        <MetaItem
          alignItems="flex-start"
          label="Cluster Labels"
          value={renderItems(edgeLabels, true)}
        />

        <MetaItem
          label="Proxy Configuration"
          value={edge.proxy_config?.enabled ? "Enabled" : "Disabled"}
        />
        <HideTheChildren hide={!edge.proxy_config?.enabled}>
          <MetaItem label="HTTP Proxy" value={edge.proxy_config?.httpProxy} />
          <MetaItem label="HTTPS Proxy" value={edge.proxy_config?.httpsProxy} />
          <MetaItem label="No Proxy" value={edge.proxy_config?.noProxy} />
          <MetaItem
            label="TLS Termination Proxy"
            value={edge.proxy_config?.allowInsecureBootstrap ? "True" : "False"}
          />
          <MetaItem
            label="Proxy Root CA"
            value={
              <TruncatedTextWithCopy text={edge.proxy_config?.bootstrapCA} />
            }
          />
        </HideTheChildren>

        <HideTheChildren hide={type !== "On-Prem"}>
          <MetaItem label="CNI Provider" value={edge.cni_provider} />
          <MetaItem
            label="Pod Network Cidr"
            value={edge.cluster_cidr_map?.PodNetworkCidr}
          />
          <MetaItem
            label="Pod Network IPv6 Cidr"
            value={edge.cluster_cidr_map?.PodNetworkIPv6Cidr}
          />
          <MetaItem
            label="Service Cidr"
            value={edge.cluster_cidr_map?.ServiceCidr}
          />
          <MetaItem
            label="Service IPv6 Cidr"
            value={edge.cluster_cidr_map?.ServiceIPv6Cidr}
          />
        </HideTheChildren>

        <HideTheChildren hide={fromOps}>
          <ClusterLabelEditor
            isOpen={openLabelEditor}
            onOpen={setOpenLabelEditor}
            labels={edgeLabels}
            edge={edge}
            refreshEdge={refreshEdge}
          />
        </HideTheChildren>
        <EditLocation
          open={openEditLocation}
          locationField={React.createElement(c.LocationField, {
            edge: edgeObj,
            handleEdgeChange,
            metroNotConfigured,
          })}
          handleClose={(_) => setOpenEditLocation(false)}
          handleSave={handleEdgeSave}
        />
      </Grid>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {
    edges: state?.settings?.edges,
    currentProject: state?.Projects?.currentProject,
    partnerDetail: state?.settings?.partnerDetail,
  };
};

export default withRouter(connect(mapStateToProps)(ClusterMeta));
