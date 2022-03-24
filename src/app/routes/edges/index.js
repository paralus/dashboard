import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { ClusterView } from "../../../views";
import {
  setDefaultClusterStatus,
  updateCluster,
  getEdgeDetail,
  removeCluster,
} from "actions/index";
import ClusterType from "components/ClusterType";

import Awsec2 from "assets/images/aws-ec2.png";
import AwsEks from "assets/images/amazon-eks.png";
import Gcp from "assets/images/gcp.png";
import K8s from "assets/images/k8s.png";
import OnPrem from "assets/images/on-prem.png";
import ClusterConfig from "./routes/ClusterConfig";

import PrivateEdgeList from "./routes/PrivateEdgeList";
import LocationField from "./routes/ClusterConfig/components/Fields/LocationField";

class Edges extends React.Component {
  componentWillUnmount() {
    this.props.setDefaultClusterStatus();
  }
  render() {
    const { match } = this.props;
    return (
      <div className="app-wrapper">
        <Switch>
          <Route exact path={`${match.url}`} component={PrivateEdgeList} />
          <Route
            exact
            path={`${match.url}/:cluster/configform`}
            component={ClusterConfig}
          />
          <Route
            path={`${match.url}/:cluster`}
            render={(props) => (
              <ClusterView
                {...props}
                actions={{
                  getEdgeDetail,
                  updateCluster,
                  setDefaultClusterStatus,
                  removeCluster,
                }}
                components={{
                  LocationField,
                  ClusterType,
                }}
                images={{
                  Awsec2,
                  AwsEks,
                  Gcp,
                  K8s,
                  OnPrem,
                }}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(connect(null, { setDefaultClusterStatus })(Edges));
