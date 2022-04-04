import React from "react";
import { Box, Paper } from "@material-ui/core";
import { useSelector } from "react-redux";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafayPageHeader from "components/RafayPageHeader";
import { useQuery } from "../../../utils";
import TabLayout from "./components/TabLayout";
import SystemLogs from "./SystemLogs";
import KubectlLogs from "./KubectlLogs";

function AuditLogs() {
  const UserSession = useSelector((state) => state.UserSession);
  const { visibleApps, visibleSystem, visibleAdmin } = UserSession;
  const isProjectRole = !visibleAdmin && visibleApps && visibleSystem;

  const { query } = useQuery();
  const tab = query.get("tab");

  const config = {
    links: [
      {
        label: `Audit`,
        current: true,
      },
    ],
  };

  if (isProjectRole)
    return (
      <Box p={2}>
        <RafayPageHeader
          title="System Logs"
          help="Your system audit logs are listed below"
        />
        <Paper>
          <SystemLogs />
        </Paper>
      </Box>
    );

  return (
    <TabLayout
      breadcrumb={<ResourceBreadCrumb config={config} />}
      help="groups.group_detail.layout.helptext"
      selectedTab={tab === "opa" ? 2 : 0}
      tabs={[
        {
          label: "System",
          panel: <SystemLogs />,
        },
        {
          label: "Kubectl",
          panel: <KubectlLogs />,
        }
      ]}
    />
  );
}

export default AuditLogs;
