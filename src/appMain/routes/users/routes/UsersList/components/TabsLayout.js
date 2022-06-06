import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const TabPanel = ({ children, value, index }) => {
  return value === index && <>{children}</>;
};

const TabsLayout = ({ tabs }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          square
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
    </>
  );
};

export default TabsLayout;
