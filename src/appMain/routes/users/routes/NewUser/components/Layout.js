import React from "react";
import { Paper, Tabs, Tab, Button } from "@material-ui/core";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";

const TabPanel = ({ children, value, index }) => {
  return value === index && <>{children}</>;
};

const config = {
  links: [
    {
      label: `Users`,
      href: "#/main/users",
    },
    {
      label: `New User`,
      current: true,
    },
  ],
};

const Layout = ({ currentTab, tabs }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    setValue(currentTab);
  }, [currentTab]);

  return (
    <div>
      <div className="m-4">
        <div className="mb-3">
          <ResourceBreadCrumb config={config} />
        </div>
        <Paper>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            square
            centered
          >
            {tabs.map((tab, i) => {
              return <Tab key={i} label={tab.label} />;
            })}
          </Tabs>
        </Paper>
        {tabs.map((tab, i) => {
          return (
            <TabPanel value={value} index={i}>
              <div className="mt-3">{tab.panel}</div>
            </TabPanel>
          );
        })}
      </div>
    </div>
  );
};

export default Layout;
