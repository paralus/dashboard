import React, { Component, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { getUserDetail, resetUser } from "actions/index";

import T from "i18n-react";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import TabsLayout from "components/TabsLayout";
import Groups from "./Groups";

const UserDetailSSO = () => {
  const { userId } = useParams();
  const [ssoUser, setSSOUser] = useState();
  useEffect((_) => {
    getUserDetail(userId).then((res) => {
      console.log("getUserDetail", res.data);
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
    <TabsLayout
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
