import React, { useEffect, useState } from "react";
import RafayDrawer from "components/RafayDrawer";
import { getSSOUserDetail } from "actions/index";
import IDPGroups from "./IDPGroups";
import OverrideGroups from "./OverrideGroups";

const SsoGroups = ({ open, user, onClose }) => {
  if (!open) return null;
  const [groupDetails, setGroupDetails] = useState();
  const fetchGroups = (_) => {
    getSSOUserDetail(user.metadata.name).then((res) => {
      setGroupDetails(res.data.spec.groups);
    });
  };
  useEffect(
    (_) => {
      fetchGroups();
    },
    [user]
  );
  return (
    <div>
      <RafayDrawer
        open={open}
        onClose={onClose}
        title={`Manage Groups - ${user?.metadata.name}`}
        width={window.innerWidth * 0.75}
      >
        <IDPGroups groups={groupDetails} />
        <OverrideGroups
          groups={groupDetails}
          user={user}
          refershGroups={(_) => fetchGroups()}
        />
      </RafayDrawer>
    </div>
  );
};

export default SsoGroups;
