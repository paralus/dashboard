/* eslint-disable react/require-default-props */
import React, { useCallback, useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  TextField
} from "@material-ui/core";
import classnames from "classnames";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";

import Spinner from "../Spinner";
import CustomPopover from "./CustomPopover";
import SearchBox from "./SearchBox";
import { applyQueryAsync, getColumnValuesList } from "./data-grid-utils";
import RafaySelect from "../RafaySelect";

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    width: "100%"
  },
  toolbar: {
    padding: theme.spacing(0, 2),
    "& > *": {
      marginRight: theme.spacing(2),
      "&:last-child": {
        marginRight: "unset"
      }
    }
  },
  grow: {
    flex: 1
  },
  headCell: {
    "& span": {
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center"
    }
  },
  disableSort: {
    "& span": {
      cursor: "default",
      pointerEvents: "none"
    }
  },
  empty: {
    textAlign: "center"
  },
  cellHead: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  },
  justifyFlexEnd: {
    justifyContent: "flex-end"
  },
  actions: {},
  listItemIcon: {
    minWidth: 30
  },
  table: {},
  tableHead: {},
  tableBody: {},
  tableHeadRow: {},
  tableRow: {
    transition: "all 0.2s ease-in",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.03)"
    }
  },
  tableCell: {
    whiteSpace: "nowrap"
  },
  tableWrapper: {
    overflow: "auto"
  },
  scrollbox: {
    borderRadius: 8,
    backgroundImage: `
      linear-gradient(to right, white, white),
      linear-gradient(to right, white, white),
      linear-gradient(to right, rgba(0,0,0,0.075), rgba(255,255,255,0)),
      linear-gradient(to left, rgba(0,0,0,0.075), rgba(255,255,255,0))`,
    backgroundPosition: "left center, right center, left center, right center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "white",
    backgroundSize: "20px 100%, 20px 100%, 20px 100%, 20px 100%",
    backgroundAttachment: "local, local, scroll, scroll"
  },
  list: {
    maxHeight: 500
  },
  columListHead: {
    padding: "12px 16px 0px"
  },
  title: {
    width: "100%"
  },
  search: {
    width: 500,
    minWidth: "20%"
  }
}));

function Empty({ colSpan, component }) {
  const classes = useStyles();
  return (
    <TableRow>
      <TableCell className={classes.empty} colSpan={colSpan}>
        {component || <Typography>No data to show.</Typography>}
      </TableCell>
    </TableRow>
  );
}

function SortArrow({ order, orderBy, dataKey, sortable = true }) {
  if (dataKey === orderBy && sortable) {
    return order === "desc" ? <ExpandMoreIcon /> : <ExpandLessIcon />;
  }

  return null;
}

export default function DataGrid(props) {
  const {
    title,
    actions,
    elevation,
    showSearch = true,
    showSearchOnLeft = false,
    showColumnSelector = false,
    loading = false,
    data = [],
    columns = [],
    components = {},
    dense = false,
    defaultPageSize = 10,
    defaultOrder = "asc",
    defaultSearchText = "",
    defaultOrderBy,
    enableColumnFilters = false,
    filters = {},
    resetPageOnChange
  } = props;
  const classes = useStyles(props);
  const isDataFunc = typeof data === "function";
  const [state, setState] = useState({
    count: 0,
    fetching: loading,
    rows: [],
    selected: columns
      .filter(({ defaultChecked = true }) => defaultChecked)
      .map(c => c.label),
    query: {
      pageSize: defaultPageSize,
      page: 0,
      searchText: defaultSearchText,
      order: defaultOrder,
      orderBy: defaultOrderBy,
      filters
    }
  });
  const [columnValues, setColumnValues] = useState({});
  const reverseOrder = order => (order === "desc" ? "asc" : "desc");

  useEffect(() => {
    // RC-9276 when health status is changed reseting page to 0
    if (resetPageOnChange && state.query.page > 0) {
      setState(s => ({ ...s, query: { ...s.query, page: 0 } }));
    }
  }, [resetPageOnChange]);

  const handleChangePageSize = e => {
    setState(s => ({
      ...s,
      query: { ...s.query, pageSize: e.target.value, page: 0 }
    }));
  };
  const handleChangePage = (e, page) => {
    setState(s => ({ ...s, query: { ...s.query, page } }));
  };
  const handleSearchChanged = searchText => {
    setState(s => ({ ...s, query: { ...s.query, page: 0, searchText } }));
  };
  const handleChangeSort = orderBy => () => {
    const order =
      orderBy === state.query.orderBy ? reverseOrder(state.query.order) : "asc";
    setState(s => ({ ...s, query: { ...s.query, order, orderBy, page: 0 } }));
  };
  const handleColumnSelect = label => () => {
    setState(s => ({
      ...s,
      selected: state.selected.includes(label)
        ? state.selected.filter(x => x !== label)
        : state.selected.concat([label])
    }));
  };
  const checkColumnSelected = label => {
    if (!state.selected) return true;
    return state.selected.indexOf(label) !== -1;
  };

  const handleColumnFilters = dataKey => value => {
    let filters = { ...state.query.filters, [dataKey]: value };
    if (!value) {
      const { [dataKey]: removed, ...rest } = filters;
      filters = { ...rest };
    }

    setState(s => ({
      ...s,
      query: {
        ...s.query,
        filters
      }
    }));
  };

  const renderCell = ({
    dataKey,
    cellDataGetter,
    cellRenderer,
    rowData,
    rowIndex
  }) => {
    const cellData =
      isDataFunc && cellDataGetter
        ? cellDataGetter({ dataKey, rowData, rowIndex })
        : rowData[dataKey];
    return cellRenderer
      ? cellRenderer({ cellData, dataKey, rowData, rowIndex })
      : cellData;
  };
  const renderRows = () => {
    if (!state.rows.length)
      return <Empty component={components.empty} colSpan={columns.length} />;

    return state.rows.map((rowData, rowIndex) => (
      <TableRow key={`row_${rowIndex}`} className={classes.tableRow}>
        {columns
          .filter(c => state.selected.includes(c.label))
          .map((c, cIdx) => (
            <TableCell
              key={`${c.dataKey || c.key}_${rowIndex}_${cIdx}`}
              align={c.align}
              style={c.cellStyle}
              classes={{ root: classes.tableCell }}
            >
              {renderCell({
                rowData,
                rowIndex,
                dataKey: c.dataKey,
                cellDataGetter: c.dataGetter,
                cellRenderer: c.render
              })}
            </TableCell>
          ))}
      </TableRow>
    ));
  };
  const setRenderableRows = useCallback(() => {
    if (isDataFunc) {
      setState(s => ({ ...s, fetching: true }));
      data(state.query).then(([rows, count]) => {
        setState(s => ({ ...s, fetching: false, rows, count }));
      });
    } else {
      setState(s => ({ ...s, fetching: true }));
      applyQueryAsync(state.query, data, columns).then(([rows, count]) => {
        setState(s => ({ ...s, fetching: false, rows, count }));
      });
    }
  }, [state.query, data, isDataFunc]);

  useEffect(() => {
    setRenderableRows();
  }, [state.query, setRenderableRows]);

  useEffect(() => {
    if (enableColumnFilters) {
      setColumnValues(getColumnValuesList(columns, isDataFunc ? state.rows : data));
    }
  }, [data]);

  return (
    <Paper className={classes.root} elevation={elevation}>
      <Spinner
        loading={state.fetching || loading}
        component={components.loader}
      >
        <Toolbar className={classes.toolbar}>
          {showSearch && showSearchOnLeft && (
            <div className={classes.search}>
              <SearchBox
                searchText={state.query.searchText}
                onSearchChanged={handleSearchChanged}
              />
            </div>
          )}
          {title && <div className={classes.title}>{title}</div>}
          {showSearch && !showSearchOnLeft && (
            <div className={classes.search}>
              <SearchBox
                searchText={state.query.searchText}
                onSearchChanged={handleSearchChanged}
              />
            </div>
          )}
          <div className={classes.grow} />
          {actions && <div className={classes.actions}>{actions}</div>}
          {showColumnSelector && (
            <CustomPopover
              style={{ marginLeft: 8 }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
            >
              <Typography variant="subtitle2" className={classes.columListHead}>
                Choose columns
              </Typography>
              <List classes={{ root: classes.list }}>
                {columns.map(({ label }) => {
                  const labelId = `checkbox-list-label-${label}`;
                  return (
                    <ListItem
                      dense
                      button
                      key={label}
                      role={undefined}
                      onClick={handleColumnSelect(label)}
                    >
                      <ListItemIcon classes={{ root: classes.listItemIcon }}>
                        <Checkbox
                          disableRipple
                          color="default"
                          edge="start"
                          checked={checkColumnSelected(label)}
                          tabIndex={-1}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={label} />
                    </ListItem>
                  );
                })}
              </List>
            </CustomPopover>
          )}
        </Toolbar>
        {/* <div className="ml-3 d-flex justify-content-between align-items-center"> */}
        <div className="ml-3 d-flex flex-wrap">
          {enableColumnFilters &&
            columns.map(c =>
              c.allowFilter ? (
                <div style={{ marginRight: "15px" }}>
                  <RafaySelect
                    key={c.dataKey}
                    label={c.label}
                    value={state.query.filters[c.dataKey]}
                    source={columnValues[c.dataKey]}
                    onSelect={handleColumnFilters(c.dataKey)}
                    variant="outlined"
                    size="small"
                    margin="dense"
                    className="mr-4"
                  />
                </div>
              ) : null
            )}
        </div>
        <div className={classnames(classes.tableWrapper, classes.scrollbox)}>
          <Table size={dense ? "small" : "medium"} className={classes.table}>
            <TableHead className={classes.tableHead}>
              <TableRow className={classes.tableHeadRow}>
                {columns
                  .filter(c => state.selected.includes(c.label))
                  .map((c, idx) => (
                    <TableCell
                      key={`${c.dataKey || c.key}_${idx}`}
                      align={c.align}
                      style={c.cellStyle}
                      classes={{ root: classes.tableCell }}
                    >
                      <span
                        onClick={handleChangeSort(c.dataKey)}
                        role="button"
                        tabIndex="-1"
                        className={classnames(classes.cellHead, {
                          [classes.justifyFlexEnd]: c.align === "right"
                        })}
                      >
                        {c.label}
                        <SortArrow
                          order={state.query.order}
                          orderBy={state.query.orderBy}
                          dataKey={c.dataKey}
                          sortable={c.sortable}
                        />
                      </span>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>{renderRows()}</TableBody>
            <TableFooter className={classes.TableFooter}>
              <TableRow>
                <TablePagination
                  rowsPerPage={state.query.pageSize}
                  page={state.query.page}
                  count={state.count}
                  onChangeRowsPerPage={handleChangePageSize}
                  onChangePage={handleChangePage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Spinner>
    </Paper>
  );
}

DataGrid.propTypes = {
  title: PropTypes.node,
  actions: PropTypes.node,
  loading: PropTypes.bool,
  elevation: PropTypes.number,
  showSearch: PropTypes.bool,
  showColumnSelector: PropTypes.bool,
  defaultPageSize: PropTypes.number,
  defaultOrder: PropTypes.oneOf(["asc", "desc"]),
  defaultOrderBy: PropTypes.string,
  defaultSearchText: PropTypes.string,
  dense: PropTypes.bool,
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.func
  ]),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      dataKey: PropTypes.string.isRequired,
      key: PropTypes.string,
      sortable: PropTypes.bool,
      align: PropTypes.string,
      render: PropTypes.func,
      dataGetter: PropTypes.func,
      cellStyle: PropTypes.object
    })
  ),
  components: PropTypes.shape({
    loader: PropTypes.node,
    empty: PropTypes.node
  })
};
