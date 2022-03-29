import React from "react";
import RafayTabLayout from "./components/RafayTabLayout";
import UserList from "./UserList";
import IDPUserList from "./IDPUserList";

const style = {
  helpText: {
    marginBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "20px",
    paddingTop: "20px",
    paddingBottom: "20px",
    fontStyle: "italic",
    color: "rgb(117, 117, 117)",
  },
};

const UsersList = () => {
  return (
    <div className="app-wrapper">
      <h1 className="p-0" style={{ marginBottom: "20px", color: "#ff9800" }}>
        Users
      </h1>
      <p style={style.helpText} className="pt-0">
        Configured user accounts are listed below. You can manage individual
        users by accessing the correponding ACTIONS menu, or you can create a
        new user by clicking on the NEW USER button.
      </p>
      <RafayTabLayout
        tabs={[
          {
            label: "Local Users",
            panel: <UserList />,
          },
          {
            label: "IDP Users",
            panel: <IDPUserList />,
          },
        ]}
      />
    </div>
  );
};

export default UsersList;
