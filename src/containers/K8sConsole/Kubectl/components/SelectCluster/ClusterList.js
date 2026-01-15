import React, { Component } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  CircularProgress,
} from "@material-ui/core";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getEdges } from "actions/index";

class ClusterList extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
    };
  }

  componentDidMount() {
    if (this.props.currentProject)
      this.props.getEdges(
        this.props.currentProject.metadata.name,
        10000,
        0,
        "",
        ""
      );
    this.timeInterval = setInterval(
      () =>
        this.props.getEdges(
          this.props.currentProject.metadata.name,
          10000,
          0,
          "",
          ""
        ),
      60000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  getHealth = (cluster) => {
    if (
      this.props.edges &&
      this.props.edges.list &&
      this.props.edges.list.results
    ) {
      const selectedCluster = cluster;
      if (selectedCluster) {
        return (
          <Tooltip
            placement="left"
            title={selectedCluster.health === 1 ? "Healthy" : "Unhealthy"}
          >
            <i
              className={
                selectedCluster.health === 1
                  ? "zmdi zmdi-caret-up zmdi-hc-3x mr-2"
                  : "zmdi zmdi-caret-down zmdi-hc-3x mr-2"
              }
              style={{
                color: selectedCluster.health === 1 ? "#009588" : "#ef1505",
                position: "absolute",
                marginTop: "-12px",
              }}
            />
          </Tooltip>
        );
      }
    }
    return null;
  };

  filterList = (event) => {
    this.setState({ value: event.target.value.trim() });
  };

  render() {
    if (this.props.edges && !this.props.edges.list) {
      return (
        <Paper
          style={{
            width: "300px",
          }}
          className="d-flex justify-content-center "
        >
          <CircularProgress />
        </Paper>
      );
    }
    let clusterList = this.props.edges?.list?.results || [];
    clusterList = clusterList
      .sort((a, b) => {
        const x = a.name.toLowerCase();
        const y = b.name.toLowerCase();
        if (x < y) return -1;
        if (x > y) return 1;
        return 0;
      })
      .filter((c) => ![...this.props.tabs.map((t) => t.name)].includes(c.name));

    if (this.state.value.length > 0) {
      clusterList = clusterList.filter((item) => {
        const searchBaseStr = `${item.name}`;
        return (
          searchBaseStr.toLowerCase().search(this.state.value.toLowerCase()) !==
          -1
        );
      });
    }

    return (
      <Paper
        style={{
          width: "300px",
        }}
      >
        <div
          className="filter-list"
          style={{
            padding: "10px",
            backgroundColor: "white",
            color: "#8b8b8b",
            // borderBottom: "2px solid teal"
          }}
        >
          <form>
            <fieldset className="form-group mb-0">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search Cluster"
                onChange={this.filterList}
                value={this.state.value}
                style={{ padding: "0rem 0.5rem 0.125rem 0.5rem" }}
              />
            </fieldset>
          </form>
        </div>
        <div
          style={{
            maxHeight: `${this.props.height}`,

            overflowY: "scroll",
          }}
        >
          <div style={{ minHeight: "110%" }}>
            <List dense>
              {clusterList &&
                clusterList
                  ?.filter((x) => !["NOT_READY"].includes(x.status))
                  ?.filter((x) => !["v1"].includes(x.cluster_type))
                  ?.map((item) => (
                    <ListItem
                      key={item.id}
                      button
                      onClick={() => this.props.handleOpenTab(item.name)}
                    >
                      <ListItemText
                        primary={
                          <span>
                            {this.getHealth(item)}{" "}
                            <span
                              style={{
                                marginLeft: "30px",
                              }}
                            >
                              {item.name}
                            </span>
                          </span>
                        }
                      />
                    </ListItem>
                  ))}
            </List>
          </div>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = ({ EdgesData, Projects }) => {
  const { edges } = EdgesData;
  const { currentProject } = Projects;
  return {
    edges,
    currentProject,
  };
};

export default withRouter(connect(mapStateToProps, { getEdges })(ClusterList));
