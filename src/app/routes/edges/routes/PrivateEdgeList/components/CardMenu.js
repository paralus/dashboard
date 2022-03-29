import React from "react";
import { Menu, MenuItem, ListItemText } from "@material-ui/core";

class CardMenu extends React.Component {
  render() {
    const ITEM_HEIGHT = 40;

    const { menuState, anchorEl, handleRequestClose } = this.props;
    return (
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={menuState}
        onClose={handleRequestClose}
        //  style={{ maxHeight: ITEM_HEIGHT * 4.5 }}
        MenuListProps={{
          style: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
      >
        <MenuItem
          className="p-0"
          key="menu-default"
          style={{ height: "0px" }}
        />
        {this.props.menuItems.map((option) => (
          <MenuItem key={option} onClick={this.props.handleRequestClose}>
            <ListItemText
              className="my-0"
              primary={option}
              secondary={
                option === "Download Kube Config" &&
                "For direct Kube API server access"
              }
            />
          </MenuItem>
        ))}
      </Menu>
    );
  }
}

export default CardMenu;
