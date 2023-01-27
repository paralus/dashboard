import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { connect } from "react-redux";
import Toolbar from "@material-ui/core/Toolbar";
import UserInfo from "components/UserInfo";
import ParalusLogo from "assets/images/paralus-logo.png";
import TopNavBar from "./TopNavBar";

const Header = ({ partnerDetail, user, userAndRoleDetail }) => {
  let image_src = "";
  let hasAccess =
    user === null ||
    (!!user && !user.spec.forceReset) ||
    (user.spec.forceReset &&
      user.metadata.name !== userAndRoleDetail.metadata.name);
  if (partnerDetail) {
    image_src = ParalusLogo;
  }
  if (partnerDetail && partnerDetail.logo_link) {
    image_src = partnerDetail.logo_link;
  }

  return (
    <AppBar className="app-main-header">
      <Toolbar className="app-toolbar" disableGutters={false}>
        {/* only show the header profile details if user has already set his password */}
        {hasAccess && (
          <>
            <div className="text-center" style={{ minWidth: "143px" }}>
              <a className="app-logo" href="#/">
                <img src={image_src} alt="" title="" />
              </a>
            </div>

            <div className="ml-4">
              <TopNavBar />
            </div>
          </>
        )}
        <div className="ml-auto">
          <UserInfo />
        </div>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = ({ Users, settings }) => {
  const { user } = Users;
  const { userAndRoleDetail } = settings;
  return {
    user,
    userAndRoleDetail,
  };
};

export default connect(mapStateToProps, null)(Header);
