import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getUser, resetUser } from "actions/index";

import T from "i18n-react";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafayTabLayout from "components/RafayTabLayout";
import Projects from "./Projects";
import Groups from "./Groups";
import UserProfile from "./UserProfile";

class UserDetail extends Component {
  componentDidMount() {
    const { getUser, match } = this.props;
    getUser(match.params.userId);
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
      <RafayTabLayout
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
    getUser,
    resetUser,
  })(UserDetail)
);
