import React from "react";
import { Box, Paper } from "@material-ui/core";
import { useSelector } from "react-redux";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import PageHeader from "components/PageHeader";
import { useQuery } from "../../../utils";
import TabLayout from "./components/TabLayout";
import SystemLogs from "./SystemLogs";
import KubectlLogs from "./KubectlLogs";

function AuditLogs() {
  const UserSession = useSelector((state) => state.UserSession);
  const { visibleApps, visibleSystem, visibleAdmin } = UserSession;
  const isProjectRole = !visibleAdmin && visibleApps && visibleSystem;
  // alert(JSON.stringify(isProjectRole))

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
        <PageHeader
          title="Kubectl Logs"
          help="Your kubectl audit logs are listed below"
        />
        <Paper>
          <KubectlLogs />
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
          label: "Kubectl",
          panel: <KubectlLogs />,
        },
        {
          label: "System",
          panel: <SystemLogs />,
        },
      ]}
    />
  );
}

export default AuditLogs;
