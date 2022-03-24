import React from "react";
import { Menu, MenuItem } from "@material-ui/core";

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
        // style={{ maxHeight: ITEM_HEIGHT * 4.5 }}
        MenuListProps={{
          style: {
            width: 150,
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
      >
        {this.props.menuItems.map((option) => (
          <MenuItem
            key={option}
            id={option}
            onClick={this.props.handleRequestClose}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    );
  }
}

export default CardMenu;
