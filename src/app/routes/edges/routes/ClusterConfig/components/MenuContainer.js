import React from "react";
import { Card, CardBody } from "reactstrap";
import { List, ListItemText } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

const style = {
  cardStyle: { marginTop: "0px" },
  CardHeader: {
    backgroundColor: "white",
    borderLeft: "3px solid #0ab09b",
    borderRight: "3px solid #0ab09b",
    textAlign: "center",
    padding: "5px",
  },
  CardBody: { backgroundColor: "white" },
};

const MenuContainer = ({ tabs, selectedTab, handleSelectedTab }) => {
  return (
    <div>
      <Card
        className="col-md-12 order-md-1 shadow border-0 p-0"
        style={style.cardStyle}
      >
        <CardBody className="p-3">
          <List dense={false}>
            {tabs.map((tab, index) => {
              return (
                <MenuItem
                  key={index}
                  className="p-2"
                  button
                  selected={selectedTab === index}
                  onClick={() => handleSelectedTab(index)}
                >
                  <ListItemText
                    style={selectedTab === tab ? { fontWeight: "500" } : {}}
                    primary={tab.primary}
                    secondary={null}
                  />
                </MenuItem>
              );
            })}
          </List>
        </CardBody>
      </Card>
    </div>
  );
};

export default MenuContainer;
