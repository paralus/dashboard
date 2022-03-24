import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getGroupDetail, resetGroup } from "actions/index";
import T from "i18n-react";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafayTabLayout from "components/RafayTabLayout";
import Projects from "./Projects";
import Users from "./Users";

class GroupDetail extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      groupId: props.match.params.groupId,
      groupName: "",
      isDefaultUsersGroup: false,
      isDefaultAdminsGroup: false,
    };
  }

  componentDidMount() {
    const { getGroupDetail, match } = this.props;
    getGroupDetail(match.params.groupId);
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { groupDetail } = props;
    if (groupDetail) {
      newState.groupName = groupDetail.metadata.name;
      if (groupDetail.spec.type === "DEFAULT_USERS") {
        newState.isDefaultUsersGroup = true;
      }
      if (groupDetail.spec.type === "DEFAULT_ADMINS") {
        newState.isDefaultAdminsGroup = true;
      }
    }
    return {
      ...newState,
    };
  }

  componentWillUnmount() {
    const { resetGroup } = this.props;
    resetGroup();
  }

  render() {
    const { groupName, isDefaultUsersGroup, isDefaultAdminsGroup } = this.state;
    const config = {
      links: [
        {
          label: `Groups`,
          href: "#/main/groups",
        },
        {
          label: `${groupName}`,
          current: true,
        },
      ],
    };
    return (
      <RafayTabLayout
        breadcrumb={<ResourceBreadCrumb config={config} />}
        help="groups.group_detail.layout.helptext"
        tabs={[
          {
            label: <T.span text="groups.group_detail.tab_labels.users" />,
            panel: <Users />,
          },
          {
            label: <T.span text="groups.group_detail.tab_labels.projects" />,
            panel: <Projects isDefaultAdminsGroup={isDefaultAdminsGroup} />,
            disabled: isDefaultUsersGroup,
          },
        ]}
      />
    );
  }
}

const mapStateToProps = ({ Groups }) => {
  const { groupDetail } = Groups;
  return {
    groupDetail,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getGroupDetail,
    resetGroup,
  })(GroupDetail)
);
