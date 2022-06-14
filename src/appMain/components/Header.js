import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import UserInfo from "components/UserInfo";
import Paralus from "assets/images/paralus.png";
import TopNavBar from "./TopNavBar";

const Header = ({ partnerDetail }) => {
  let image_src = "";
  if (partnerDetail) {
    image_src = Paralus;
  }
  if (partnerDetail && partnerDetail.logo_link) {
    image_src = partnerDetail.logo_link;
  }

  return (
    <AppBar className="app-main-header">
      <Toolbar className="app-toolbar" disableGutters={false}>
        <div className="text-center" style={{ minWidth: "143px" }}>
          <a className="app-logo" href="#/">
            <img src={image_src} alt="" title="" />
          </a>
        </div>
        <div className="ml-4">
          <TopNavBar />
        </div>

        <div className="ml-auto">
          <UserInfo />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
