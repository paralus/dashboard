import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import T from "i18n-react";

const style = {
  helpText: {
    marginBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "20px",
    paddingTop: "20px",
    paddingBottom: "20px",
    fontStyle: "italic",
    color: "rgb(117, 117, 117)",
  },
};

const TabPanel = ({ children, value, index }) => {
  return value === index && <>{children}</>;
};

const TabLayout = ({ tabs, selectedTab }) => {
  const [value, setValue] = React.useState(selectedTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div className="m-4">
        <h1 className="p-0" style={{ marginBottom: "20px", color: "#ff9800" }}>
          Audit Logs
        </h1>
        <p style={style.helpText} className="pt-0">
          Your audit logs are listed below
        </p>
        <Paper>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            square="true"
          >
            {tabs.map((tab, i) => {
              if (tab.disabled) {
                return <Tab disabled key={i} label={tab.label} />;
              }
              return <Tab key={i} label={tab.label} />;
            })}
          </Tabs>
        </Paper>
        {tabs.map((tab, i) => {
          return (
            <TabPanel key={i} index={i} value={value}>
              <div className="mt-3">{tab.panel}</div>
            </TabPanel>
          );
        })}
      </div>
    </div>
  );
};

export default TabLayout;
