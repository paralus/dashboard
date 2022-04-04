import React, { useState, useEffect } from "react";

import DataTable from "components/RafayTable/DataTable";
import DataTableToolbar from "components/RafayTable/DataTableToolbar";
import { useSnack } from "utils/useSnack";
import { useDispatch, useSelector } from "react-redux";

import { updateSSOUser } from "actions/index";
import { parseError } from "utils";

import HeaderCard from "./HeaderCard";
import AddGroup from "./AddGroup";

const OverrideGroups = ({ groups, user, refershGroups }) => {
  const groupsList = useSelector((s) => s?.Groups.groupsList || []);
  const { showSnack } = useSnack();
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const columnLabels = [
    {
      label: "Group Name",
    },
    { label: "" },
  ];
  const handleDeleteClick = (groupName) => {
    const overrides = groups?.filter((g) => g !== groupName) || [];
    const params = {
      override_enabled: overrides.length > 0,
      group_overrides: overrides,
    };
    user.spec.groups = overrides;
    updateSSOUser(user)
      .then((_) => {
        refershGroups();
      })
      .catch((err) => {
        showSnack(parseError(err));
      });
  };
  const handleAddGroup = (groupName) => {
    const overrides = [...groups, groupName];
    const params = {
      override_enabled: overrides.length > 0,
      group_overrides: overrides,
    };
    user.spec.groups = overrides;
    updateSSOUser(user)
      .then((_) => {
        refershGroups();
        setOpenAddGroup(false);
      })
      .catch((err) => {
        showSnack(parseError(err));
      });
  };
  const parseRowData = (data) => {
    const confirmText = (
      <span>
        <span>Are you sure you want to delete Group</span>
        <span className="font-weight-bold mx-1">{data}</span>
        <span>?</span>
      </span>
    );
    const rows = [
      {
        type: "regular",
        value: data,
      },
      {
        type: "buttons",
        buttons: [
          {
            type: "danger-icon",
            label: "Delete",
            // disabled: true,
            confirmText,
            handleClick: () => {
              handleDeleteClick(data);
            },
          },
        ],
      },
    ];

    return rows;
  };
  return (
    <HeaderCard
      header={
        <DataTableToolbar
          title="Managed Groups"
          buttonLabel="Assign Group"
          handleCreateClick={(_) => setOpenAddGroup(true)}
        />
      }
      className="m-3"
    >
      <DataTable
        columnLabels={columnLabels}
        list={groups || []}
        parseRowData={parseRowData}
        type="server"
      />
      <AddGroup
        groups={groups}
        groupsList={groupsList}
        open={openAddGroup}
        onClose={(_) => setOpenAddGroup(false)}
        onSave={handleAddGroup}
      />
    </HeaderCard>
  );
};

export default OverrideGroups;
