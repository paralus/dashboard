import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Paper, Typography, Link } from "@material-ui/core";
import DataGrid from "../../../../components/DataGrid";

function NodesList({ data, match }) {
  return (
    <Paper elevation={0}>
      <div id="nodes-container">
        <div>
          <DataGrid
            data={data}
            elevation={0}
            title={<Typography variant="h6">Nodes</Typography>}
            defaultPageSize={10}
            defaultOrderBy="name"
            columns={[
              {
                label: "Name",
                dataKey: "name",
                render({ rowData }) {
                  return (
                    <Link
                      component={RouterLink}
                      to={{
                        pathname: `${match.url}/nodes/${rowData.name}`,
                        state: rowData
                      }}
                    >
                      {rowData.name}
                    </Link>
                  );
                }
              },
              {
                label: "Ingress IP",
                dataKey: "public_ip"
              },

              {
                label: "Internal IP",
                dataKey: "private_ip"
              },
              {
                label: "Status",
                dataKey: "status"
              },
              {
                label: "Roles",
                dataKey: "roles",
                render({ rowData }) {
                  return rowData.roles
                    ? rowData.roles.includes("Master")
                      ? "MASTER/WORKER"
                      : "WORKER"
                    : "N/A";
                }
              },
              {
                label: "CPU (Cores)",
                dataKey: "num_cores"
              },
              {
                label: "Memory (Gib)",
                dataKey: "total_memory",
                render({ rowData }) {
                  return (rowData.total_memory / 10 ** 6).toFixed(2);
                }
              },
              {
                label: "GPU (Cores)",
                dataKey: "num_gpus"
              }
            ]}
          />
        </div>
      </div>
    </Paper>
  );
}

export default NodesList;
