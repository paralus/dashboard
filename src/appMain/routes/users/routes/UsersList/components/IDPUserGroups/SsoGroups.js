import React, { useEffect, useState } from "react";
import AppDrawer from "components/AppDrawer";
import { getSSOUserDetail } from "actions/index";
import IDPGroups from "./IDPGroups";
import OverrideGroups from "./OverrideGroups";

const SsoGroups = ({ open, user, onClose }) => {
  if (!open) return null;
  const [groupDetails, setGroupDetails] = useState();
  const [idpGroups, setIdpGroups] = useState();

  const fetchGroups = (_) => {
    getSSOUserDetail(user.metadata.name).then((res) => {
      setGroupDetails(res.data.spec.groups);

      let idpGroups = res.data.spec.idpGroups;
      idpGroups = idpGroups.filter((g)=> g!== "");
      setIdpGroups(idpGroups);
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
      <AppDrawer
        open={open}
        onClose={onClose}
        title={`Manage Groups - ${user?.metadata.name}`}
        width={window.innerWidth * 0.75}
      >
        <IDPGroups groups={idpGroups} />
        <OverrideGroups
          groups={groupDetails}
          user={user}
          refershGroups={(_) => fetchGroups()}
        />
      </AppDrawer>
    </div>
  );
};

export default SsoGroups;
