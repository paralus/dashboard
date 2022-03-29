import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const TabPanel = ({ children, value, index }) => {
  return value === index && <>{children}</>;
};

const Home = ({ UserSession }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Paper className="pt-4">
        <h1 className="ml-4" style={{ color: "#ff9800" }}>
          Dashboard
        </h1>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          square
        >
          {/* <Tab label="Overview" /> */}
          {/* {UserSession.visibleInfra && <Tab label="Clusters" />} */}
          {UserSession.visibleApps && <Tab label="Workloads" />}
        </Tabs>
      </Paper>
    </div>
  );
};

// export default Home;
const mapStateToProps = ({ UserSession }) => {
  return {
    UserSession,
  };
};

export default withRouter(connect(mapStateToProps, null)(Home));
