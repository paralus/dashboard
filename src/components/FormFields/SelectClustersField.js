import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { getClusterList } from "actions/index";

import {
  Paper,
  InputBase,
  styled,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemSecondaryAction,
  FormControlLabel,
  Tooltip,
} from "@material-ui/core";

const SearchBox = styled(InputBase)(({ theme }) => ({
  background: "rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(1 / 2, 1),
  margin: theme.spacing(2),
  borderRadius: 4,
  display: "flex",
  "& input::placeholder": {
    fontSize: 16,
  },
}));

const SelectClustersField = ({ deployedClusters, onChange }) => {
  const [searchText, setSearchText] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [clusters, setClusters] = useState([]);
  const [checkList, setCheckList] = useState({});

  const { currentProject } = useSelector((state) => {
    return {
      currentProject: state.Projects?.currentProject,
    };
  });

  useEffect(
    (_) => {
      getClusterList(currentProject.id, "READY", 200, 0, searchText).then(
        (res) => {
          setClusters(res.data.results);
        },
      );
    },
    [searchText],
  );

  useEffect(
    (_) => {
      const list = Object.keys(checkList)?.filter((c) => checkList[c]);
      onChange(list);
    },
    [checkList],
  );

  const getHealth = (cluster) => {
    if (cluster) {
      return (
        <Tooltip
          placement="left"
          title={cluster.health === 1 ? "Healthy" : "Unhealthy"}
        >
          <i
            className={
              cluster.health === 1
                ? "zmdi zmdi-caret-up zmdi-hc-3x mr-2"
                : "zmdi zmdi-caret-down zmdi-hc-3x mr-2"
            }
            style={{
              color: cluster.health === 1 ? "#009588" : "#ef1505",
              position: "absolute",
              marginTop: "-12px",
            }}
          />
        </Tooltip>
      );
    }
    return null;
  };

  // const selectedClustersList =
  //   deployedClusters?.map(c => {
  //     return c.name;
  //   }) || [];

  const filteredClusters = clusters
    ?.filter((c) => !deployedClusters?.includes(c.name))
    ?.sort((a, b) => {
      const x = a.name.toLowerCase();
      const y = b.name.toLowerCase();
      if (x < y) return -1;
      if (x > y) return 1;
      return 0;
    });

  return (
    <div>
      <Paper
        style={{
          padding: "0px",
          paddingTop: "5px",
          zIndex: "200",
        }}
      >
        <SearchBox
          id="label-search"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div style={{ height: "350px", overflowY: "scroll" }}>
          <div>
            {/* style={{ minHeight: "80%" }} */}
            <List dense={false}>
              <ListItem key="select-all">
                <ListItemText
                  primary={
                    <p
                      style={{
                        color: "rgba(0, 0, 0, 0.54)",
                        float: "right",
                        marginRight: "20px",
                        marginBottom: "initial",
                      }}
                    >
                      Select All
                    </p>
                  }
                />
                <ListItemSecondaryAction>
                  <FormControlLabel
                    style={{
                      cursor: "pointer",
                    }}
                    control={
                      <Checkbox
                        id="selectAll-cb"
                        checked={selectAll}
                        onClick={(e) => {
                          setSelectAll(e.target.checked);
                          const ch = filteredClusters?.reduce((acc, c) => {
                            acc[c.name] = e.target.checked;
                            return acc;
                          }, {});
                          setCheckList(ch);
                        }}
                        color="primary"
                      />
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {filteredClusters.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={
                      <span>
                        <span>{getHealth(item)}</span>
                        <span
                          style={{
                            marginLeft: "30px",
                          }}
                        >
                          {item.name}
                        </span>
                      </span>
                    }
                    // secondary={
                    // <span>{`${item.city}, ${item.country}`}</span>
                    // }
                  />
                  <ListItemSecondaryAction>
                    <FormControlLabel
                      style={{
                        cursor: "pointer",
                      }}
                      control={
                        <Checkbox
                          id={item.id}
                          checked={checkList[item.name] || false}
                          onClick={(e) => {
                            setCheckList({
                              ...checkList,
                              [item.name]: e.target.checked,
                            });
                            if (!e.target.checked) {
                              setSelectAll(false);
                            }
                          }}
                          value={item.name}
                          color="primary"
                        />
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default SelectClustersField;
