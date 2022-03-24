import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import T from "i18n-react";

const TabPanel = ({ children, value, index }) => {
  return value === index && <>{children}</>;
};

const RafayTabLayout = ({ title, help, breadcrumb, tabs, noPadding }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div className={noPadding ? "" : "m-4"}>
        <div className="mb-1">{breadcrumb}</div>
        {title && (
          <h2 className="" style={{ color: "#ff9800" }}>
            {title}
          </h2>
        )}
        {help && (
          <div className="text-muted mb-3">
            <T.span text={help} />
          </div>
        )}
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

export default RafayTabLayout;
