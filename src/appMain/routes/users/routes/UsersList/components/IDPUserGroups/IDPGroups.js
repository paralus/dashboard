import React from "react";
import DataTable from "components/TableComponents/DataTable";
import HeaderCard from "./HeaderCard";

const IDPGroups = ({ groups }) => {
  return (
    <HeaderCard
      header={<h3 className="p-3 m-0">IDP Groups</h3>}
      className="m-3"
    >
      <DataTable
        columnLabels={[
          {
            label: "Group Name",
          },
        ]}
        list={groups || []}
        parseRowData={(data) => {
          const rows = [
            {
              type: "regular",
              value: data,
            },
          ];

          return rows;
        }}
        type="server"
      />
    </HeaderCard>
  );
};

export default IDPGroups;
