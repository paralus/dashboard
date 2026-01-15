import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getEdgesOP } from "actions/index";
import { Grid } from "@material-ui/core";
import NavCard from "./NavCard";

class Overview extends Component {
  componentDidMount() {
    const { getEdgesOP, currentProject } = this.props;
    getEdgesOP(currentProject.id);
  }
  render() {
    const { edges } = this.props;
    let edgesCount = 0;
    if (edges && edges.list) {
      edgesCount = edges.list.count;
    }

    return (
      <div className="mt-3">
        <Grid container justify="left" spacing="2">
          <Grid key="cl" item>
            <NavCard title="Clusters" count={edgesCount} href="/#/app/edges" />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({ settingsOps, settings, Projects }) => {
  const { workload } = settings;
  const { edges } = settingsOps;
  const { currentProject } = Projects;
  return {
    currentProject,
    edges,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getEdgesOP,
  })(Overview),
);
