import React from "react";
import { connect } from "react-redux";
import Header from "components/Header/index";

const NewPageWrapper = ({ partnerDetail, children }) => {
  return (
    <div className="w-100 d-flex flex-column" style={{ paddingTop: "70px" }}>
      <Header
        drawerType="fixed_drawer"
        onToggleCollapsedNav={() => {}}
        partnerDetail={partnerDetail}
        hideMenuIcon
      />
      {children}
    </div>
  );
};

const mapStateToProps = ({ settings }) => {
  const { partnerDetail } = settings;
  return {
    partnerDetail,
  };
};

export default connect(mapStateToProps, {})(NewPageWrapper);
