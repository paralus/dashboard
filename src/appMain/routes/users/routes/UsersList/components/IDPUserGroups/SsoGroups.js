import React, { useEffect, useState } from "react";
import RafayDrawer from "components/RafayDrawer";
import { getSSOUser } from "actions/index";
import IDPGroups from "./IDPGroups";
import OverrideGroups from "./OverrideGroups";

const SsoGroups = ({ open, user, onClose }) => {
  if (!open) return null;
  const [groupDetails, setGroupDetails] = useState();
  const fetchGroups = (_) => {
    getSSOUser(user.accountID).then((res) => {
      setGroupDetails(res.data);
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
        title={`Manage Groups - ${user?.userName}`}
        width={window.innerWidth * 0.75}
      >
        <IDPGroups groups={groupDetails?.idp_groups} />
        <OverrideGroups
          groups={groupDetails?.groups}
          user={user}
          refershGroups={(_) => fetchGroups()}
        />
      </RafayDrawer>
    </div>
  );
};

export default SsoGroups;
