import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getUserDetail, resetUser } from "actions/index";

import T from "i18n-react";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import TabsLayout from "components/TabsLayout";
import Projects from "./Projects";
import Groups from "./Groups";
import UserProfile from "./UserProfile";

class UserDetail extends Component {
  componentDidMount() {
    const { getUserDetail, match } = this.props;
    getUserDetail(match.params.userId);
  }

  componentWillUnmount() {
    const { resetUser } = this.props;
    resetUser();
  }

  render() {
    const { user } = this.props;
    const config = {
      links: [
        {
          label: `Users`,
          href: "#/main/users",
        },
        {
          label: `${user ? user.metadata.name : ""}`,
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
            label: <T.span text="users.user_detail.tab_labels.profile" />,
            panel: <UserProfile user={user} />,
          },
          {
            label: <T.span text="users.user_detail.tab_labels.groups" />,
            panel: <Groups />,
          },
          {
            label: <T.span text="users.user_detail.tab_labels.projects" />,
            panel: <Projects />,
          },
        ]}
      />
    );
  }
}

const mapStateToProps = ({ Users }) => {
  const { user } = Users;
  return {
    user,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getUserDetail,
    resetUser,
  })(UserDetail),
);
