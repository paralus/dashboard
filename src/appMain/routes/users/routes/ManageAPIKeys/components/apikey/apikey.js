import React from "react";
import classNames from "classnames";
// import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import SearchBox from "components/SearchBox";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import T from "i18n-react";

const columnData = [
  { id: "key", numeric: false, disablePadding: false, label: "API Key" },
  {
    id: "created",
    numeric: false,
    disablePadding: false,
    label: "Created On",
  },
  { id: "delete", numeric: false, disablePadding: false, label: "" },
];

class DataTableHead extends React.Component {
  // static propTypes = {
  //     numSelected: PropTypes.number.isRequired,
  //     onRequestSort: PropTypes.func.isRequired,
  //     onSelectAllClick: PropTypes.func.isRequired,
  //     order: PropTypes.string.isRequired,
  //     orderBy: PropTypes.string.isRequired,
  //     rowCount: PropTypes.number.isRequired,

  // };

  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } =
      this.props;

    return (
      <TableHead>
        <TableRow>
          {/* <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell> */}
          {columnData.map(
            (column) => (
              <TableCell
                key={column.id}
                id={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? "none" : "default"}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

const DataTableToolbar = (props) => {
  const { numSelected, handleCreateClick } = props;

  return (
    <Toolbar
      className={classNames("table-header", {
        "highlight-light": numSelected > 0,
      })}
      style={{ paddingTop: "0px", paddingLeft: "0px" }}
    >
      {/* <div className="title">
                {numSelected > 0 ? (
                    <Typography type="subheading">{numSelected} selected</Typography>
                ) : (
                    <Typography type="title">List</Typography>
                )}
            </div> */}
      {/* <div className="col-md-4 search-wrapper">
                <SearchBox placeholder="Search" />
            </div> */}
      <div className="spacer" />
      <div className="actions">
        {numSelected > 0 && (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

// DataTableToolbar.propTypes = {
//     numSelected: PropTypes.number.isRequired,
// };

const dateFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};

class APIKeys extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openWarning: false,
      page: 0,
      rowsPerPage: 25,
      offset: 0,
      count: 5,
      order: "asc",
      orderBy: "key",
      selected: [],
      apikeys: [],
      apikey: {},
      errorMsg: "",
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.isAPIKeyCreateSuccess) {
      this.state.apikey = props.apikey;
      this.state.apikeys.push(props.apikey);
      this.state.open = true;
    }
    if (props.isAPIKeyCreateFailure) {
      this.state.openWarning = true;
      this.state.apiKeyErrorMsg = props.apiKeyErrorMsg;
    }
    if (props.isAPIKeyDeleteSuccess) {
      this.props.getApiKeys(
        this.props.match.params.userId,
        this.props.isSSOUser,
      );
    }
    if (props.isAPIKeysSuccess) {
      this.state.apikeys = props.apikeys;
    }

    this.props.resetUserApiKeyResponse();
    this.setState({ ...this.state });
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  // Actions
  handleCreateClick = (event) => {
    this.props.createApiKey(
      this.props.match.params.userId,
      this.props.isSSOUser,
    );
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    const data =
      order === "desc"
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.items.map((n) => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleAPIKeyClose = (event) => {
    this.state.open = false;
    this.setState({ ...this.state });
  };

  handleDeleteKey = (accountid, id) => {
    this.setState({ openDeleteWarning: false }, () =>
      this.props.deleteApiKey(accountid, id),
    );
  };

  handleWarningClose = (event) => {
    this.setState({ openWarning: false });
  };

  render() {
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    let data = [];
    if (this.state.apikeys.items) {
      data = this.state.apikeys.items;
    }

    return (
      <div className="row">
        <div className="col-12">
          <DataTableToolbar
            numSelected={selected.length}
            handleCreateClick={(e) => this.handleCreateClick(e)}
            key="my_apikeys"
          />
          <div className="flex-auto" key="apikeys_list">
            <div className="table-responsive-material">
              <Table className="" size="small">
                <DataTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {data.map((n) => (
                    <TableRow hover key={n.key}>
                      <TableCell>{n.key}</TableCell>
                      <TableCell id={n.key} className="text-right">
                        <Tooltip title="Delete">
                          <IconButton
                            aria-label="Delete"
                            onClick={() =>
                              this.setState({
                                openDeleteWarning: true,
                                deletekey: n.key,
                              })
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <Dialog open={this.state.open} onClose={this.handleAPIKeyClose}>
            <DialogTitle>
              <T.span text="apikey.create.dialog.title" />
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <T.span text="apikey.create.dialog.description" />
              </DialogContentText>
              <div className="row mt-4">
                <div className="col-md-12">
                  <h1 className="font-weight-light">
                    <T.span text="apikey.create.dialog.keylabel" />
                  </h1>
                </div>
              </div>
              <div className="row">
                <div className="col-md-11">
                  <span>{this.state.apikey.key}</span>
                </div>
                <div className="col-md-1">
                  <Tooltip title="Copy to clipboard" id="clip">
                    <i
                      className="zmdi zmdi-copy zmdi-hc-fw zmdi-hc-lg"
                      onClick={() => {
                        navigator.clipboard.writeText(this.state.apikey.key);
                      }}
                      style={{
                        cursor: "pointer",
                        marginTop: "6px",
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-12">
                  <h1 className="font-weight-light">
                    <T.span text="apikey.create.dialog.secretlabel" />
                  </h1>
                </div>
              </div>
              <div className="row">
                <div className="col-md-11">
                  <span>{this.state.apikey.secret}</span>
                </div>
                <div className="col-md-1 order-md-2">
                  <Tooltip title="Copy to clipboard" id="clip">
                    <i
                      className="zmdi zmdi-copy zmdi-hc-fw zmdi-hc-lg"
                      onClick={() => {
                        navigator.clipboard.writeText(this.state.apikey.secret);
                      }}
                      style={{
                        cursor: "pointer",
                        marginTop: "6px",
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleAPIKeyClose}
                color="primary"
                id="apikey_close"
              >
                <T.span text="apikey.create.dialog.close" />
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.openWarning}
            onClose={this.handleWarningClose}
          >
            <DialogTitle>
              <T.span text={this.state.apiKeyErrorMsg} />
            </DialogTitle>
            <DialogActions>
              <Button onClick={this.handleWarningClose} id="apikey_ok">
                <T.span text="apikey.create.dialog.ok" />
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.openDeleteWarning}
            onClose={() => this.setState({ openDeleteWarning: false })}
          >
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete API Key ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.setState({ openDeleteWarning: false })}
                color="primary"
                id="apikey_close"
              >
                Close
              </Button>
              <Button
                onClick={() =>
                  this.handleDeleteKey(
                    this.props.match.params.userId,
                    this.state.deletekey,
                  )
                }
                color="secondary"
                id="apikey_close"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default APIKeys;
