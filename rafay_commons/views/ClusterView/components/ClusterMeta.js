/* eslint-disable no-unused-expressions */
import {
  Box,
  Grid,
  Link,
  makeStyles,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import * as R from "ramda";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import React, { useState, useEffect, useContext } from "react";
import MetaItem from "./MetaItem";
import LabelItem from "./LabelTaintItem";
import ClusterLabelEditor from "./ClusterLabelEditor";
import IfThen from "./IfThen";
import { ClusterViewContext } from "../ClusterViewContexts";
import Spinner from "../../../components/Spinner";
import HideTheChildren from "../../../components/HideTheChildren";
import Banner from "../../../components/Banner";
import EditLocation from "./EditLocation";
import DataProtection from "./DataProtection";
import {
  safelyParseJSON,
  transformLabelsObject,
  useSnack
} from "../../../utils";
import EksDetails from "./EksDetails";
import CredentialsDetails from "./CredentialsDetails";
import TruncatedTextWithCopy from "./TruncatedTextWithCopy";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    flex: 1
  },
  imageType: {
    width: "20px",
    marginRight: "5px",
    marginLeft: "1px"
  },
  code: {
    color: "black"
  },
  labelFlex: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "stretch",
    alignContent: "space-between",
    "& > span": {
      margin: "0 12px 12px 0"
    }
  },
  spinnerInner: {
    marginTop: "50px"
  }
}));

const getType = R.cond([
  [R.includes(R.__, ["imported", "v2"]), R.always("Import")],
  [R.equals("manual"), R.always("On-Prem")],
  [R.equals("aws-ec2"), R.always("Amazon-EC2")],
  [R.equals("aws-eks"), R.always("Amazon-EKS")],
  [R.equals("azure-aks"), R.always("azure-aks")],
  [R.equals("google-gcp"), R.always("Google Cloud Platform")]
]);

const getImage = i => type => {
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

const getGPUDetails = (nodes = []) => {
  if (!nodes.length) {
    return "Disabled";
  }
  const enabled = R.find(
    R.allPass([R.prop("num_gpus"), R.propSatisfies(x => x > 0, "num_gpus")]),
    nodes
  );
  const gpuNode = R.find(R.prop("gpu_type"), nodes);
  if (enabled && gpuNode?.gpu_type) {
    return `Enabled ${gpuNode.gpu_type}`;
  }

  return "Disabled";
};
const bpSyncColourOptions = {
  Success: "teal",
  NotSet: "gray",
  InProgress: "blue",
  Pending: "gray",
  Failed: "red"
};
const GetLocation = ({ edge, setOpenEditLocation }) => {
  if (!edge) return null;
  const metro = edge.Metro;
  const OpenBtn = ({ label }) => (
    <Button
      variant="contained"
      dense="true"
      size="small"
      color="primary"
      onClick={_ => setOpenEditLocation(true)}
    >
      <span>{label}</span>
    </Button>
  );
  if (!metro) return <OpenBtn label="Add" />;

  const [show, setShow] = useState(false);
  const toggleLocation = e => {
    e.preventDefault();
    setShow(s => !s);
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
          {edge.cluster_type === "manual" && <OpenBtn label="Edit" />}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

function getPublicIps(edge) {
  const publicIps = [];
  edge.nodes.forEach(node => {
    if (node && node.roles && node.roles.includes("Proxy")) {
      const publicIP = node.public_ip;
      if (publicIP && !publicIps.includes(publicIP)) {
        publicIps.push(publicIP);
      }
    }
  });

  return publicIps;
}

const getBluePrintSyncStatus = edge => {
  return R.pipe(
    R.pathOr([], ["cluster", "status", "conditions"]),
    R.find(R.propEq("type", "ClusterBlueprintSync")),
    R.defaultTo({})
  )(edge);
};

const dateFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short"
};

function NotSupported({ message = "Not yet supported by Ops Console." }) {
  const classes = useStyles();
  return (
    <Typography variant="subtitle2" color="textSecondary">
      {message}
    </Typography>
  );
}

function ClusterMeta({
  edge,
  edges,
  currentProject,
  partnerDetail,
  cloudInfo,
  refreshEdge,
  dispatch
}) {
  if (!edge) return null;

  const { a, c, i, fromOps } = useContext(ClusterViewContext);
  const classes = useStyles();
  const { showSnack } = useSnack();
  const [edgeObj, setEdgeObj] = useState({ ...edge, metro: { ...edge.Metro } });
  const [openEditLocation, setOpenEditLocation] = useState(false);
  const [metroNotConfigured, setMetroNotConfigured] = useState(false);
  const [openAdvConfig, setOpenAdvConfig] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [openLabelEditor, setOpenLabelEditor] = useState(false);
  const { status } = getBluePrintSyncStatus(edge);
  const type = getType(edge.cluster_type);
  const labelObject = edge?.cluster?.metadata?.labels || {};
  const edgeLabels = transformLabelsObject(labelObject);
  const jsonParams = safelyParseJSON(edge.edge_provider_params?.params);
  const edgeTags = transformLabelsObject(jsonParams?.tags);
  const edgeAKSTags = transformLabelsObject(
    jsonParams?.aks_cluster_params?.tags
  );
  const [autoApproveNodes, setAutoApproveNodes] = useState(
    edge.auto_approve_nodes
  );
  const [upgrade_protection, setUpgradeProtection] = useState(
    edge.upgrade_protection
  );
  const [resource_group_name, setResourceGroupName] = useState("");
  const [clusterEndpointAccess, setClusterEndpointAccess] = useState("");
  const [acr_resource_group, setACRResourceGroupName] = useState("");
  const [acr_name, setACRName] = useState("");
  const [network_plugin, setNetworkPlugin] = useState("");
  const [sku_tier, setSkuTier] = useState("");
  const isGlusterFs = edge?.storage_class_map
    ? Object.keys(edge.storage_class_map).includes("GlusterFs")
    : true;

  const handleAutoApproveNode = event => {
    if (edge && edge.id) {
      a.updateCluster(
        { ...edge, auto_approve_nodes: event.target.checked },
        currentProject.id
      )
        .then(res => {
          setAutoApproveNodes(res.data?.auto_approve_nodes);
          showSnack(
            `Approve Nodes Automatically ${
              res.data?.auto_approve_nodes ? "Enabled" : "Disabled"
            }`,
            "success"
          );
        })
        .catch(err => {
          showSnack(err.response?.data);
        })
        .finally(_ => {
          refreshEdge();
        });
    }
  };

  const handleUpgradeProtection = event => {
    if (edge && edge.id) {
      a.updateCluster(
        { ...edge, upgrade_protection: event.target.checked },
        currentProject.id
      )
        .then(res => {
          setUpgradeProtection(res.data?.upgrade_protection);
          showSnack(
            `Upgrade Protection ${
              res.data?.upgrade_protection ? "Enabled" : "Disabled"
            }`,
            "success"
          );
        })
        .catch(err => {
          showSnack(err.response?.data);
        })
        .finally(_ => {
          refreshEdge();
        });
    }
  };

  function getCloudInformation() {
    if (edge.cluster_type === "aws-eks") {
      dispatch(a.getCloudInfo(edge.id, currentProject.id));
    }
  }

  const handleEdgeChange = name => event => {
    let metro = null;
    if (event) {
      metro = {
        name: event.value
      };
    }
    setEdgeObj({
      ...edgeObj,
      metro
    });
  };

  const handleEdgeSave = () => {
    if (!edgeObj.metro) {
      setMetroNotConfigured(true);
      return;
    }
    if (edgeObj.id) {
      dispatch(a.updateEdge(edgeObj, currentProject.id)).then(() => {
        setOpenEditLocation(false);
        refreshEdge();
      });
    }
  };

  useEffect(() => {
    getCloudInformation();
    const cloudInfoInterval = setInterval(getCloudInformation, 120000);
    return () => clearInterval(cloudInfoInterval);
  }, []);

  useEffect(() => {
    if (type === "azure-aks" && edge.edge_provider_params?.params?.length) {
      const params = JSON.parse(edge.edge_provider_params.params);
      setResourceGroupName(params.resource_group_name);
      setClusterEndpointAccess(
        params.aks_cluster_params.enable_private_cluster
      );
      setACRResourceGroupName(params.aks_cluster_params?.acr_resource_group);
      setACRName(params.aks_cluster_params?.acr_name);
      setNetworkPlugin(params.aks_cluster_params?.network_plugin);
      setSkuTier(params.aks_cluster_params?.sku_tier);
    }
  }, [edge]);

  const renderItems = (items, isEdit) => (
    <>
      {items.length === 0 && `N/A`}
      <Box className={classes.labelFlex}>
        {items.map(item => (
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

  const vmOperatorEnabled =
    edge?.cluster?.metadata?.labels["rafay.dev/kubevirt"] === "enabled";

  return (
    <Box p={1 / 2}>
      <Grid container spacing={1}>
        <MetaItem
          label="Type"
          value={
            <div style={{ marginLeft: "-5px" }}>
              {React.createElement(c.ClusterType, {
                type: edge.cluster_type,
                params: edge.provision_params
              })}
            </div>
          }
        />

        <IfThen condition={edge?.cluster_template_info?.name?.length > 0}>
          <MetaItem
            label="Cluster Template Name"
            value={edge?.cluster_template_info?.name}
          />
        </IfThen>

        <IfThen condition={edge?.cluster_template_info?.version?.length > 0}>
          <MetaItem
            label="Cluster Template Version"
            value={edge?.cluster_template_info?.version}
          />
        </IfThen>

        <MetaItem
          label="Location"
          value={
            <GetLocation
              edge={edge}
              setOpenEditLocation={setOpenEditLocation}
            />
          }
        />
        {edge.ha_enabled && (
          <MetaItem
            label="High Availability"
            value={edge.ha_enabled ? "Enabled" : "Disabled"}
          />
        )}
        <MetaItem
          label="Auto Provision"
          value={edge.auto_create ? "Yes" : "No"}
        />
        <IfThen condition={!["Amazon-EKS", "azure-aks"].includes(type)}>
          <MetaItem label="GPU" value={getGPUDetails(edge?.nodes)} />
        </IfThen>
        <IfThen condition={vmOperatorEnabled}>
          <MetaItem label="VM Operator" value="Enabled" />
        </IfThen>

        <IfThen
          condition={["manual", "aws-ec2", "google-gcp"].includes(
            edge.cluster_type
          )}
        >
          <MetaItem
            label="K8s Version"
            value={edge?.edge_version_info?.kube_version}
          />
        </IfThen>
        <IfThen condition={!["Amazon-EKS", "azure-aks"].includes(type)}>
          <MetaItem label="Provider" value={edge.manufacturer} />
        </IfThen>
        <IfThen
          condition={["aws-eks", "aws-ec2", "google-gcp", "azure-aks"].includes(
            edge.cluster_type
          )}
        >
          <MetaItem
            label="Cloud Credential"
            value={<CredentialsDetails edge={edge} refreshEdge={refreshEdge} />}
          />
        </IfThen>
        <MetaItem
          label="Ingress IP(s)"
          value={
            <>
              {/* 
                Show Ingress IPs from cluster level only when the type of the cluster is On-prem(manual)
                For all other types retain the existing display
              */}
              <IfThen condition={edge.cluster_type === "manual"}>
                <HideTheChildren
                  hide={!c.IngressIPs}
                  component={<NotSupported />}
                >
                  {React.createElement(c.IngressIPs, { edge, refreshEdge })}
                </HideTheChildren>
              </IfThen>
              <IfThen condition={edge.cluster_type !== "manual"}>
                {getPublicIps(edge).map(ip => (
                  <div className="mt-1 mb-1">{ip}</div>
                ))}
              </IfThen>
            </>
          }
        />
        {/* 
          For On-prem(manual) clusters, ingress ip's can still be configured at node level using API
          These IPs are display only and are not editable from UI. Customers are expected to use API to edit these.
        */}
        <IfThen
          condition={
            edge.cluster_type === "manual" && getPublicIps(edge).length > 0
          }
        >
          <MetaItem
            label="Node Ingress IP(s)"
            value={getPublicIps(edge).map(ip => (
              <div className="mt-1 mb-1">{ip}</div>
            ))}
          />
        </IfThen>
        <MetaItem label="Blueprint" value={edge.cluster_blueprint} />
        <IfThen condition={c.BlueprintSyncFailDialog}>
          <MetaItem
            label="BlueprintSync Status"
            value={
              !status
                ? undefined
                : React.createElement(
                    c.BlueprintSyncFailDialog,
                    {
                      cluster: edge,
                      blueprintSyncStatus: status
                    },
                    <span
                      className="text-uppercase"
                      style={{ color: bpSyncColourOptions[status] }}
                    >
                      {status}
                    </span>
                  )
            }
          />
        </IfThen>
        <IfThen condition={edge && edge.created_at}>
          <MetaItem
            label="Provisioned At"
            value={new Intl.DateTimeFormat("en-US", dateFormatOptions).format(
              new Date(edge.created_at)
            )}
          />
        </IfThen>
        <IfThen condition={!partnerDetail?.settings?.data_protection_disabled}>
          <MetaItem
            label="Backup Agent"
            value={
              <DataProtection
                edge={edge}
                refreshEdge={refreshEdge}
                actions={a}
                projectId={currentProject.id}
              />
            }
          />
        </IfThen>
        <IfThen condition={!["Amazon-EKS", "azure-aks"].includes(type)}>
          <MetaItem
            label="Dedicated Master"
            value={edge.is_master_dedicated ? "Yes" : "No"}
          />
        </IfThen>
        <IfThen condition={!["Amazon-EKS", "azure-aks"].includes(type)}>
          <MetaItem label="GlusterFs" value={isGlusterFs ? "Yes" : "No"} />
        </IfThen>
        <IfThen condition={!["Amazon-EKS", "azure-aks"].includes(type)}>
          <MetaItem
            label="Approve nodes automatically"
            value={
              type === "On-Prem" ? (
                <Switch
                  id="auto_approve_nodes"
                  color="primary"
                  checked={autoApproveNodes}
                  onChange={handleAutoApproveNode}
                />
              ) : (
                "N/A"
              )
            }
          />
        </IfThen>
        <IfThen condition={["azure-aks"].includes(type)}>
          <MetaItem label="Resource Group Name" value={resource_group_name} />
        </IfThen>
        <IfThen condition={["azure-aks"].includes(type) && acr_name !== ""}>
          <MetaItem label="ACR Name" value={acr_name} />
        </IfThen>
        <IfThen
          condition={["azure-aks"].includes(type) && acr_resource_group !== ""}
        >
          <MetaItem
            label="ACR Resource Group Name"
            value={acr_resource_group}
          />
        </IfThen>
        <IfThen condition={["azure-aks"].includes(type)}>
          <MetaItem
            label="Cluster Endpoint Access"
            value={clusterEndpointAccess ? "Private" : "Public"}
          />
        </IfThen>
        <IfThen condition={["azure-aks"].includes(type)}>
          <MetaItem label="SKU Tier" value={sku_tier} />
        </IfThen>
        <IfThen condition={["azure-aks"].includes(type)}>
          <MetaItem label="Network Plugin" value={network_plugin} />
        </IfThen>

        <IfThen condition={!["Amazon-EKS", "azure-aks"].includes(type)}>
          <MetaItem
            label="Upgrade Protection"
            value={
              <Switch
                id="upgrade_protection"
                color="primary"
                checked={upgrade_protection}
                onChange={handleUpgradeProtection}
              />
            }
          />
        </IfThen>

        <MetaItem
          alignItems="flex-start"
          label="Cluster Labels"
          value={renderItems(edgeLabels, true)}
        />

        <IfThen condition={["azure-aks"].includes(type)}>
          <MetaItem
            alignItems="flex-start"
            label="Tags"
            value={renderItems(edgeAKSTags, false)}
          />
        </IfThen>

        {edge.cluster_type === "aws-eks" && (
          <MetaItem
            alignItems="flex-start"
            label="AWS Tags"
            value={renderItems(edgeTags, false)}
          />
        )}

        <IfThen condition={["Amazon-EKS"].includes(type)}>
          <MetaItem
            label="CNI Provider"
            value={edge.cni_provider}
            fallback="N/A"
          />
        </IfThen>

        {type === "Amazon-EKS" && <EksDetails edge={edge} />}

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

        <HideTheChildren hide={!cloudInfo || !c.CloudInfo}>
          {edge.cluster_type === "aws-eks" ? (
            <Button
              variant="contained"
              color="primary"
              className="mt-3"
              onClick={() => setOpenAdvConfig(true)}
            >
              View More
            </Button>
          ) : null}
          <Dialog
            maxWidth="md"
            fullWidth
            onClose={() => setOpenAdvConfig(false)}
            aria-labelledby="simple-dialog-title"
            open={openAdvConfig}
          >
            <DialogTitle
              className="pt-2 pr-2"
              style={{ borderBottom: "1px solid lightgrey" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>Advanced Details</div>
                <IconButton onClick={() => setOpenAdvConfig(false)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </DialogTitle>
            <DialogContent style={{ minHeight: "125px" }}>
              {cloudInfo?.error && !cloudInfo.getCloudInfoSuccess && (
                <div className="text-danger p-4">{cloudInfo.error}</div>
              )}
              {React.createElement(
                Spinner,
                {
                  hideChildren: true,
                  loading: !cloudInfo?.detail && !cloudInfo?.error,
                  classes: { spinnerInner: classes.spinnerInner }
                },
                React.createElement(c.CloudInfo, {
                  closeDialog: () => setOpenAdvConfig(false),
                  cloudInfo,
                  copiedToClipboard,
                  copyToClipboard: (e, text) => {
                    navigator.clipboard.writeText(text);
                    setCopiedToClipboard(true);
                  },
                  resetClipboardCopyTooltip: () => {
                    setCopiedToClipboard(false);
                  }
                })
              )}
            </DialogContent>
            <DialogActions style={{ borderTop: "1px solid lightgrey" }}>
              <Button onClick={() => setOpenAdvConfig(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </HideTheChildren>
        <HideTheChildren hide={fromOps}>
          <ClusterLabelEditor
            isOpen={openLabelEditor}
            onOpen={setOpenLabelEditor}
            labels={edgeLabels}
            edgeId={edge.id}
            refreshEdge={refreshEdge}
          />
        </HideTheChildren>
        <EditLocation
          open={openEditLocation}
          locationField={React.createElement(c.LocationField, {
            edge: edgeObj,
            handleEdgeChange,
            metroNotConfigured
          })}
          handleClose={_ => setOpenEditLocation(false)}
          handleSave={handleEdgeSave}
        />
      </Grid>
    </Box>
  );
}

const mapStateToProps = state => {
  return {
    edges: state?.settingsOps?.edges,
    cloudInfo: state?.settingsOps?.cloudInfo,
    currentProject: state?.Projects?.currentProject,
    partnerDetail: state?.settings?.partnerDetail
  };
};

export default withRouter(connect(mapStateToProps)(ClusterMeta));
