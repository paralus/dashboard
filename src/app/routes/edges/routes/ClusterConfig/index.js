import React, { useState, useEffect, useRef } from "react";
import T from "i18n-react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import useLocalStorage from "utils/useLocalStorage";
import { useSnack } from "../../../../../utils/useSnack";
import { testProtocol } from "../../../../../utils/helpers";

import { getEdgeDetail, updateEdge } from "actions/index";

import { useQuery } from "../../../../../utils";
import Breadcrumb from "./components/Breadcrumb";
import MenuContainer from "./components/MenuContainer";
import General from "./components/General";
import Advanced from "./components/Advanced";
import ProxyConfig from "./components/ProxyConfig";

const ClusterConfig = ({
  drawerType,
  history,
  match,
  getEdgeDetail,
  updateEdge,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [edge, setEdge] = useState(null);
  const [edgeError, setEdgeError] = useState({});
  const [cachedProject, _] = useLocalStorage("currentProject");
  const [alert, setAlert] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const { showSnack } = useSnack();

  const handleWizardExit = (_) => {
    history.push(`/app/edges`);
  };

  const generalSection = useRef(null);
  const advancedSection = useRef(null);
  const { search } = useQuery();
  const isEdit = ["?edit=true"].includes(search);
  const handleOnScroll = () => {
    let tabValue = 0;
    if (generalSection) {
      const { top } = generalSection?.current?.getBoundingClientRect();
      if (top > 100) {
        tabValue = 0;
      }
    }
    if (advancedSection) {
      const { top } = advancedSection?.current?.getBoundingClientRect();
      if (top < 300) {
        tabValue = 1;
      }
      if (top === 123) {
        setSelectedTab(tabValue);
        return;
      }
    }
    setSelectedTab(tabValue);
  };

  const handleSelectedTab = (tab) => {
    if (tab === 0) {
      generalSection.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      generalSection.current.scrollTop += 100;
    }
    if (tab === 1) {
      advancedSection.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setSelectedTab(tab);
  };

  useEffect((_) => {
    const cluster = match.params.cluster;
    getEdgeDetail(cluster).then((res) => {
      const edgeObj = res.data;
      if (edgeObj?.spec?.edge_provider_params?.params?.length > 0) {
        edgeObj.spec.edge_provider_params.params = JSON.parse(
          edgeObj.spec.edge_provider_params.params
        );
      }
      if (!edgeObj.spec.Metro) {
        edgeObj.spec.Metro = { name: "" };
      }
      if (!edgeObj.spec.proxy_config) {
        edgeObj.spec.proxy_config = {};
      }
      setEdge(edgeObj);
      setLoading(false);
    });
    window.addEventListener("scroll", handleOnScroll, true);
    return () => {
      window.removeEventListener("scroll", handleOnScroll, true);
    };
  }, []);

  const handleEdgeChange = (name) => (event) => {
    if (name === "httpProxy") {
      edge.spec.proxyConfig.httpProxy = event.target.value;
      setEdge({ ...edge });
      return;
    }
    if (name === "httpsProxy") {
      edge.spec.proxyConfig.httpsProxy = event.target.value;
      setEdge({ ...edge });
      return;
    }
    if (name === "noProxy") {
      edge.spec.proxyConfig.noProxy = event.target.value;
      setEdge({ ...edge });
      return;
    }
    if (name === "proxyAuth") {
      edge.spec.proxyConfig.proxyAuth = event.target.value;
      setEdge({ ...edge });
      return;
    }
    if (name === "bootstrapCA") {
      edge.spec.proxyConfig.bootstrapCA = event.target.value;
      setEdge({ ...edge });
      return;
    }
    if (name === "allowInsecureBootstrap") {
      edge.spec.proxyConfig.allowInsecureBootstrap = event.target.checked;
      setEdge({ ...edge });
      return;
    }
    if (name === "enabled") {
      edge.spec.proxyConfig.enabled = event.target.checked;
      setEdge({ ...edge });
      return;
    }
    if (name === "metro" && event) {
      if (edge.spec.metro) {
        edge.spec.metro.name = event.value;
      } else {
        edge.spec.metro = {
          name: event.value,
        };
      }
      setEdge({ ...edge });
      return;
    }
  };

  const handleSuccessResponse = (_) => {
    history.push(`/app/edges/${edge.metadata.name}`);
  };

  const handleErrorResponse = (res) => {
    showSnack(res);
  };

  const handleSaveConfig = (_) => {
    if (
      edge.spec.proxyConfig &&
      edge.spec.proxyConfig.enabled &&
      (testProtocol(edge?.spec.proxyConfig?.httpProxy) ||
        testProtocol(edge?.spec.proxyConfig?.httpsProxy))
    ) {
      return;
    }
    if (!edge.spec.metro) {
      edge.spec.metro = { name: "" };
    }
    if (edge.spec.params) {
      edge.spec.params.state = "PROVISION";
    }

    updateEdge(edge, handleSuccessResponse, handleErrorResponse);
  };

  if (loading)
    return (
      <CircularProgress
        size={50}
        style={{
          marginLeft: "40%",
          marginTop: "200px",
          color: "#009688",
          position: "absolute",
        }}
      />
    );

  return (
    <div style={{ position: "sticky" }}>
      <Breadcrumb edge={edge} />
      <div className="row">
        <div className="col-md-3 pr-0">
          <div style={{ position: "sticky", top: "53px" }}>
            <MenuContainer
              tabs={[{ primary: "General" }, { primary: "Advanced" }]}
              selectedTab={selectedTab}
              handleSelectedTab={handleSelectedTab}
            />
          </div>
        </div>
        <div
          className="col-md-9"
          style={{ marginBottom: "50px" }}
          onScroll={handleOnScroll}
        >
          <div className="mb-3" ref={generalSection}>
            <Paper className="p-0">
              <General
                edge={edge}
                edgeError={edgeError}
                project={cachedProject}
                expandAll={false}
                handleEdgeChange={handleEdgeChange}
                toggleExpandAll={(_) => {}}
                isEdit={false}
              />
            </Paper>
          </div>
          {edge.spec.clusterType !== "imported" ? (
            <div
              className="mb-3"
              ref={advancedSection}
              onScroll={handleOnScroll}
              style={{ scrollMarginBlockStart: "53px" }}
            >
              <Paper className="p-0">
                <Advanced
                  edge={edge}
                  handleEdgeChange={handleEdgeChange}
                  isEdit={false}
                />
              </Paper>
            </div>
          ) : (
            <div
              className="mb-3"
              ref={advancedSection}
              onScroll={handleOnScroll}
              style={{ scrollMarginBlockStart: "53px" }}
            >
              <Paper className="p-0">
                <div className="row mb-2 p-3">
                  <div className="col-md-12">
                    <h3>Advanced</h3>
                  </div>
                  <div className="col-md-12 text-muted">
                    <T.span text="Optionally configure these to tune and customize your Kubernetes cluster’s configuration" />
                  </div>
                  <div className="col-md-12">
                    <ProxyConfig
                      edge={edge}
                      handleEdgeChange={handleEdgeChange}
                    />
                  </div>
                </div>
              </Paper>
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Paper className={`workload-detail-bottom-navigation ${drawerType}`}>
            <div className="row d-flex justify-content-between pt-3">
              <div className="d-flex flex-row">
                <div className="d-flex align-items-center">
                  <Button
                    className="ml-4 bg-white text-red"
                    variant="contained"
                    color="default"
                    onClick={handleWizardExit}
                    type="submit"
                  >
                    Discard Changes &amp; Exit
                  </Button>
                </div>
                <div className="next d-flex align-items-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveConfig}
                    type="submit"
                  >
                    <span>Continue</span>
                  </Button>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ settings, Projects }) => {
  const { edges } = settings;
  const { currentProject } = Projects;
  return { edges, currentProject };
};
export default withRouter(
  connect(mapStateToProps, {
    getEdgeDetail,
    updateEdge,
  })(ClusterConfig)
);
