import React, { Component, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { getSSOUser, resetUser } from "actions/index";

import T from "i18n-react";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafayTabLayout from "components/RafayTabLayout";
import Groups from "./Groups";

const UserDetailSSO = () => {
  const { userId } = useParams();
  const [ssoUser, setSSOUser] = useState();
  useEffect((_) => {
    getSSOUser(userId).then((res) => {
      console.log("getSSOUser", res.data);
      setSSOUser(res.data);
    });
  }, []);

  const config = {
    links: [
      {
        label: `Users`,
        href: "#/main/users",
      },
      {
        label: `${ssoUser?.username || ""}`,
        current: true,
      },
    ],
  };

  return (
    <RafayTabLayout
      // title={groupName}
      breadcrumb={<ResourceBreadCrumb config={config} />}
      help="users.user_detail.layout.helptext"
      tabs={[
        {
          label: <T.span text="users.user_detail.tab_labels.groups" />,
          panel: <Groups />,
        },
      ]}
    />
  );
};

export default UserDetailSSO;
