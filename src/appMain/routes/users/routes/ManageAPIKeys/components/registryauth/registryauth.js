import React from "react";
import classNames from "classnames";
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
  IconButton,
  Button,
  Tooltip,
  Toolbar,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import T from "i18n-react";

const columnData = [
  { id: "key", numeric: false, disablePadding: false, label: "Key" },
  { id: "labels", numeric: false, disablePadding: false, label: "Labels" },
  {
    id: "created",
    numeric: false,
    disablePadding: false,
    label: "Created On",
  },
  { id: "delete", numeric: false, disablePadding: false, label: "" },
];

class DataTableHead extends React.Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } =
      this.props;

    return (
      <TableHead>
        <TableRow>
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
      <div className="spacer" />
      <div className="actions">
        <Button
          variant="contained"
          className="jr-btn jr-btn-label left text-nowrap text-white"
          onClick={(event) => handleCreateClick(event)}
          style={{ marginRight: 8 }}
          color="primary"
          id="newRegistryAuthKey"
        >
          <i className="zmdi zmdi-plus zmdi-hc-fw " />
          <T.span text="labels.newRegistryAuthKey" />
        </Button>
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

const dateFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};

class RgistryAuthKeys extends React.Component {
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
      registrykeys: [],
      regauthkey: {},
      registryAuthKeyErrorMsg: "",
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  UNSAFE_componentWillReceiveProps(props) {
    console.log("registryAuth UNSAFE_componentWillReceiveProps", props);
    if (props.isRegistryAuthKeyCreateSuccess) {
      this.state.regauthkey = props.regAuthKey;
      this.state.registrykeys.push(props.regAuthKey);
      this.state.open = true;
    }
    if (props.isRegistryAuthKeysSuccess) {
      this.state.registrykeys = props.regAuthKeys;
    }
    if (props.isRegistryAuthKeyCreateFailure) {
      this.state.openWarning = true;
      this.state.registryAuthKeyErrorMsg = props.registryAuthKeyErrorMsg;
    }
    if (props.isRegKeyDeleteSuccess) {
      this.props.getRegistryAuthKeys(this.props.match.params.userId);
    }

    this.props.resetRegistryAuthKeyResponse();
    this.setState({ ...this.state });
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  getLabels = (authzlabels, copy) => {
    const authlabelz = [];
    if (authzlabels) {
      authzlabels.labels.org.forEach((org) => {
        authzlabels.labels.trees.forEach((tree) => {
          authlabelz.push(
            <>
              <div className="col-md-11">{`${org}/${tree}`}</div>
              {copy && (
                <div className="col-md-1">
                  <Tooltip title="Copy to clipboard" id="clip">
                    <i
                      className="zmdi zmdi-copy zmdi-hc-fw zmdi-hc-lg"
                      onClick={() => {
                        navigator.clipboard.writeText(`${org}/${tree}`);
                      }}
                      style={{
                        cursor: "pointer",
                        marginTop: "6px",
                      }}
                    />
                  </Tooltip>
                </div>
              )}
            </>,
          );
        });
      });
    }
    return authlabelz;
  };

  // Actions
  handleCreateClick = (event) => {
    this.props.createRegistryAuthKey(
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
      this.setState({ selected: this.state.data.map((n) => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClose = (event) => {
    this.state.open = false;
    this.setState({ ...this.state });
  };

  handleWarningClose = (event) => {
    this.setState({ openWarning: false });
  };

  handleDeleteKey = (id) => {
    this.setState({ openDeleteWarning: false }, () =>
      this.props.deleteRegistryAuthKey(id),
    );
  };

  render() {
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    let data = [];
    if (this.state.registrykeys) {
      data = this.state.registrykeys;
    }
    return (
      <div className="row">
        <div className="col-12">
          <DataTableToolbar
            numSelected={selected.length}
            handleCreateClick={(e) => this.handleCreateClick(e)}
            key="my_registrykeys"
          />
          <div className="flex-auto" key="registrykeys_list">
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
                    <TableRow hover key={`regkey_${n.id}`}>
                      <TableCell>{n.key}</TableCell>
                      <TableCell>{this.getLabels(n.authzlabels)}</TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat(
                          "en-US",
                          dateFormatOptions,
                        ).format(new Date(n.created_at))}
                      </TableCell>
                      <TableCell className="text-right">
                        <Tooltip title="Delete" id={n.key}>
                          <IconButton
                            aria-label="Delete"
                            onClick={() =>
                              this.setState({
                                openDeleteWarning: true,
                                deletekey: n.id,
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
          <Dialog open={this.state.open} onClose={this.handleClose}>
            <DialogTitle>
              <T.span text="regauthkey.create.dialog.title" />
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <T.span text="regauthkey.create.dialog.description" />
              </DialogContentText>
              <div className="row mt-4">
                <div className="col-md-12">
                  <h1 className="font-weight-light">
                    <T.span text="regauthkey.create.dialog.keyLabel" />
                  </h1>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <span>{this.state.regauthkey.key}</span>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-12">
                  <h1 className="font-weight-light">
                    <T.span text="regauthkey.create.dialog.secretLabel" />
                  </h1>
                </div>
              </div>
              <div className="row">
                <div className="col-md-11 order-md-1">
                  <input
                    value={this.state.regauthkey.secret}
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="col-md-1 order-md-2">
                  <Tooltip title="Copy to clipboard" id="clip">
                    <i
                      className="zmdi zmdi-copy zmdi-hc-fw zmdi-hc-lg"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          this.state.regauthkey.secret,
                        );
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
                    <T.span text="regauthkey.create.dialog.labelsLabel" />
                  </h1>
                </div>
              </div>
              <div className="row">
                {this.getLabels(this.state.regauthkey.authzlabels, "copy")}
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleClose}
                color="primary"
                id="regauthkey_close"
              >
                <T.span text="regauthkey.create.dialog.close" />
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.openWarning}
            onClose={this.handleWarningClose}
          >
            <DialogTitle>
              <T.span text={this.state.registryAuthKeyErrorMsg} />
            </DialogTitle>
            <DialogActions>
              <Button onClick={this.handleWarningClose} id="regauthkey_ok">
                <T.span text="apikey.create.dialog.ok" />
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.openDeleteWarning}
            onClose={() => this.setState({ openDeleteWarning: false })}
          >
            <DialogTitle>Delete Registry Authorization Key</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete Registry Authorization Key ?
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
                onClick={() => this.handleDeleteKey(this.state.deletekey)}
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

export default RgistryAuthKeys;
