import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import T from "i18n-react";

const TabPanel = ({ children, value, index }) => {
  return value === index && <>{children}</>;
};

const WizardComponent = ({ title, help, breadcrumb, tabs, step, handleChange }) => {
  const handleStepChange = (_, newValue) => {
    if (handleChange) handleChange(newValue);
  };

  return (
    <div>
      <div className="m-4">
        <div className="mb-1">{breadcrumb}</div>
        {title && (
          <h2 className="" style={{ color: "#ff9800" }}>
            {title}
          </h2>
        )}
        {help && (
          <div className="text-muted">
            <T.span text={help} />
          </div>
        )}
        <Paper className="mt-3">
          <Tabs
            value={step}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleStepChange}
            variant="fullWidth"
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
            <TabPanel key={i} index={i} value={step}>
              <Paper className="mt-3">{tab.panel}</Paper>
            </TabPanel>
          );
        })}
      </div>
    </div>
  );
};

export default WizardComponent;
