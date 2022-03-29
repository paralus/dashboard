import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Tab, IconButton, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import KubectlIcon from "components/KubectlIcon";

import FontSize from "./components/FontSize";
import KubectlShell from "./components/KubectlShell";
import SelectCluster from "./components/SelectCluster";
import WizardActions from "./components/WizardActions";

const styles = (_) => ({
  root: { position: "relative", height: "100%", width: "100%" },
  heading: { color: "#ff9800", marginBottom: "0px", padding: "15px" },
  clustersHeading: { paddingTop: "17px", fontWeight: "500", fontSize: "16px" },
  tabs: {
    height: "30px",
    paddingTop: "4px",
    paddingBottom: "7px",
  },
  tab: {
    padding: "0px",
    minWidth: "0px",
    textTransform: "none",
    marginLeft: "15px",
  },
  addTab: { minWidth: "0px", fontSize: "larger" },
  actions: { position: "absolute", right: "2px" },
  shell: {
    backgroundColor: "black",
    width: "100%",
    position: "absolute",
    top: "56px",
  },
});

class Kubectl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clusterName: props.clusterName,
      projectId: props.projectId,
      anchorEl: null,
      reloadShell: 0,
      openPopper: false,
      currentNamespace: props.namespace,
      tabs: [
        {
          name: props.clusterName,
        },
      ],
      nstabs: [
        {
          name: props.namespace,
        },
      ],
      currentTab: 0,
    };
  }

  handleClose = (_) => {
    const { history } = this.props;
    history.push("/");
  };

  handleReload = (_) => {
    this.setState((state) => {
      return { ...state, reloadShell: ++state.reloadShell, anchorEl: null };
    });
  };

  handleOpenInNew = (_) => {
    const { clusterName, projectId } = this.state;
    const { namespace, command, kubectl_type, edge_id, isLogsOnly } =
      this.props;
    let url = `#/console/${projectId}/${clusterName}?`;
    if (namespace) {
      url += `&namespace=${namespace}`;
    }
    if (command) {
      url += `&command=${command}`;
    }
    if (kubectl_type) {
      url += `&kubectl_type=${kubectl_type}`;
    }

    if (edge_id) {
      url += `&edge_id=${edge_id}`;
    }

    if (isLogsOnly) {
      url += `&isLogsOnly=${isLogsOnly}`;
    }

    const win = window.open(url, "_blank");
    if (win != null) {
      win.focus();
    }
  };

  handleOpenTab = (clusterName) =>
    this.setState((state) => {
      return {
        ...state,
        tabs: [...state.tabs, { name: clusterName }],
        currentTab: state.tabs.length,
        openPopper: !this.state.openPopper,
        clusterName,
      };
    });

  handleOpenNsTab = (namespace) =>
    this.setState((state) => {
      return {
        ...state,
        tabs: [...state.tabs, { name: this.state.clusterName }],
        nstabs: [...state.nstabs, { name: namespace }],
        currentTab: state.nstabs.length,
        openPopper: !this.state.openPopper,
        currentNamespace: namespace,
      };
    });

  handleTabClose = (index) => {
    const { tabs, currentTab } = this.state;
    const remainingTabs = [...tabs];
    remainingTabs.splice(index, 1);
    const ct = index <= currentTab ? currentTab - 1 : currentTab;
    const clusterName = remainingTabs && remainingTabs[ct]?.name;
    this.setState({ tabs: remainingTabs, currentTab: ct, clusterName });
  };

  handleTabNsClose = (index) => {
    const { nstabs, currentTab } = this.state;
    const remainingTabs = [...nstabs];
    remainingTabs.splice(index, 1);
    const ct = index <= currentTab ? currentTab - 1 : currentTab;
    const currentNamespace = remainingTabs && remainingTabs[ct]?.name;
    this.setState({ nstabs: remainingTabs, currentTab: ct, currentNamespace });
  };

  render() {
    const {
      projectId,
      anchorEl,
      reloadShell,
      tabs,
      nstabs,
      currentTab,
      clusterName,
      currentNamespace,
    } = this.state;
    const {
      showOpenInNew,
      handleDrawerClose,
      classes,
      namespace,
      command,
      kubectl_type,
      edge_id,
      isLogsOnly,
    } = this.props;
    const openSettings = Boolean(anchorEl);
    return (
      <div className={classes.root}>
        <div className="d-flex flex-row">
          <h2 className={classes.heading}>
            <KubectlIcon />
            <div className="d-inline">
              {isLogsOnly ? "Pod Logs" : "kubectl"}
            </div>
          </h2>
          {this.props.kubectl_type === "namespace" ? (
            <div className="d-flex flex-row ml-4">
              <div className={classes.clustersHeading}>
                <span>
                  <span>Cluster : </span>{" "}
                  <span
                    style={{
                      color: "teal",
                      fontWeight: "initial",
                      marginLeft: "10px",
                      fontSize: "14px",
                    }}
                  >
                    {clusterName}
                  </span>
                </span>
                <span className="ml-3">
                  <span>Namespace :</span>
                  {isLogsOnly && (
                    <span className="ml-2" style={{ fontWeight: 300 }}>
                      {namespace}
                    </span>
                  )}
                </span>
              </div>

              {!isLogsOnly && (
                <Tabs
                  value={currentTab}
                  indicatorColor="primary"
                  textColor="primary"
                  aria-label="clusters"
                  className={classes.tabs}
                >
                  {nstabs.map((tab, index) => {
                    return (
                      <Tab
                        key={index}
                        size="small"
                        className={classes.tab}
                        style={{
                          color: `${currentTab === index ? "teal" : "#92c5c5"}`,
                        }}
                        label={
                          <div>
                            <span
                              onClick={() => {
                                this.setState({
                                  currentTab: index,
                                  currentNamespace: tab.name,
                                });
                              }}
                            >
                              {tab.name}
                            </span>
                            {nstabs.length > 1 && (
                              <Tooltip title="Close">
                                <IconButton
                                  size="small"
                                  key="close"
                                  aria-label="Close"
                                  color="inherit"
                                  className="ml-2 p-0"
                                  onClick={() => this.handleTabNsClose(index)}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </div>
                        }
                      />
                    );
                  })}
                  <Tab
                    size="small"
                    className={classes.addTab}
                    label={
                      <>
                        <Tooltip title="Open cluster in new tab">
                          <div
                            onClick={() =>
                              this.setState({
                                openPopper: !this.state.openPopper,
                              })
                            }
                          >
                            +<i className="ml-2 zmdi zmdi-caret-down" />
                          </div>
                        </Tooltip>
                      </>
                    }
                    ref={(el) => {
                      this.popper = el;
                    }}
                  />
                </Tabs>
              )}
            </div>
          ) : (
            <div className="d-flex flex-row ml-4">
              <div className={classes.clustersHeading}>
                <span>Clusters:</span>
              </div>
              <Tabs
                value={currentTab}
                indicatorColor="primary"
                textColor="primary"
                aria-label="clusters"
                className={classes.tabs}
              >
                {tabs.map((tab, index) => {
                  return (
                    <Tab
                      key={index}
                      size="small"
                      className={classes.tab}
                      style={{
                        color: `${currentTab === index ? "teal" : "#92c5c5"}`,
                      }}
                      label={
                        <div>
                          <span
                            onClick={() => {
                              this.setState({
                                currentTab: index,
                                clusterName: tab.name,
                              });
                            }}
                          >
                            {tab.name}
                          </span>
                          {tabs.length > 1 && (
                            <Tooltip title="Close">
                              <IconButton
                                size="small"
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                className="ml-2 p-0"
                                onClick={() => this.handleTabClose(index)}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </div>
                      }
                    />
                  );
                })}
                <Tab
                  size="small"
                  className={classes.addTab}
                  label={
                    <>
                      <Tooltip title="Open cluster in new tab">
                        <div
                          onClick={() =>
                            this.setState({
                              openPopper: !this.state.openPopper,
                            })
                          }
                        >
                          +<i className="ml-2 zmdi zmdi-caret-down" />
                        </div>
                      </Tooltip>
                      <SelectCluster
                        open={this.state.openPopper}
                        anchor={this.popper}
                        height={this.props.height}
                        tabs={tabs}
                        handleClose={() =>
                          this.setState({ openPopper: !this.state.openPopper })
                        }
                        handleOpenTab={this.handleOpenTab}
                      />
                    </>
                  }
                  ref={(el) => {
                    this.popper = el;
                  }}
                />
              </Tabs>
            </div>
          )}
          <div className={`pt-2 ${classes.actions}`}>
            <WizardActions
              showOpenInNew={showOpenInNew}
              handleOpenInNew={this.handleOpenInNew}
              handleReload={this.handleReload}
              handleSettings={(event) =>
                this.setState({
                  anchorEl: event.currentTarget,
                })
              }
              handleDrawerClose={handleDrawerClose}
              handleClose={this.handleClose}
            />
          </div>
        </div>

        {this.props.kubectl_type === "namespace" ? (
          <>
            {nstabs.map((tab, index) => {
              return (
                <div
                  key={index}
                  className={`h-100 pt-3 pl-3 ${classes.shell}`}
                  style={{
                    visibility: `${
                      index === currentTab && tab.name === currentNamespace
                        ? "visible"
                        : "hidden"
                    }`,
                  }}
                >
                  <KubectlShell
                    project={projectId}
                    clusterName={clusterName}
                    reload={reloadShell}
                    namespace={currentNamespace}
                    command={command}
                    kubectl_type={kubectl_type}
                    isLogsOnly={isLogsOnly}
                  />
                </div>
              );
            })}
          </>
        ) : (
          <>
            {tabs.map((tab, index) => {
              return (
                <div
                  key={index}
                  className={`h-100 pt-3 pl-3 ${classes.shell}`}
                  style={{
                    visibility: `${
                      index === currentTab && tab.name === clusterName
                        ? "visible"
                        : "hidden"
                    }`,
                  }}
                >
                  <KubectlShell
                    project={projectId}
                    clusterName={tab.name}
                    reload={reloadShell}
                    namespace={currentNamespace}
                    command={command}
                    kubectl_type={kubectl_type}
                  />
                </div>
              );
            })}
          </>
        )}

        <FontSize
          open={openSettings}
          anchorEl={anchorEl}
          onClose={(_) =>
            this.setState({
              anchorEl: null,
            })
          }
          handleReload={this.handleReload}
        />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Kubectl));
