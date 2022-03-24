import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import SearchBox from "components/SearchBox";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import Select from "react-select";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getMetros,
  editLocation,
  addLocation,
  deleteLocation,
  resetLocationError,
} from "actions/index";
import CircularProgress from "@material-ui/core/CircularProgress";

import { isoCountries } from "./components/data";
import CellMenu from "./components/CellMenu";

const columnData = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "city", numeric: false, disablePadding: true, label: "City" },
  { id: "state", numeric: false, disablePadding: true, label: "State" },
  { id: "country", numeric: false, disablePadding: true, label: "Country" },
  {
    id: "coordinates",
    numeric: false,
    disablePadding: false,
    label: "Coordinates",
  },
  { id: "options", numeric: true, disablePadding: false, label: "Actions" },
];

class DataTableHead extends React.Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;
    return (
      <TableHead>
        <TableRow>
          {columnData.map(
            (column) => (
              <TableCell
                key={column.id}
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
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

const DataTableToolbar = (props) => {
  const { handleCreateLocationClick, handleSearchChange, searchValue } = props;
  return (
    <Toolbar className="table-header">
      <div className="col-md-4 search-wrapper">
        <SearchBox
          placeholder="Search Locations"
          onChange={handleSearchChange}
          value={searchValue}
        />
      </div>
      <div className="spacer" />
      <div className="col-md-8">
        {!props.isReadOnlyOps && (
          <div className="actions">
            <Button
              variant="contained"
              className="jr-btn jr-btn-label left text-nowrap text-white"
              onClick={(event) => handleCreateLocationClick(event)}
              style={{ marginRight: 8, float: "right" }}
              color="primary"
              id="new_location_button"
            >
              <i className="zmdi zmdi-plus zmdi-hc-fw " />
              <span>New Location</span>
            </Button>
          </div>
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

const defaultLocationObject = {
  kind: "Metro",
  metadata: {
    name: "",
  },
  spec: {
    name: "",
    city: "",
    country: "",
    cc: "",
    state: "",
    st: "",
    latitude: "",
    longitude: "",
  },
};

class LocationList extends React.Component {
  constructor(props, context) {
    super(props, context);
    console.log("LocationList constructor");
    this.state = {
      location: { ...defaultLocationObject },
      order: "desc",
      orderBy: "created_at",
      page: 0,
      rowsPerPage: 25,
      offset: 0,
      count: 5,
      open: false,
      isResponseError: false,
      filter: "",
      account: null,
    };
  }

  componentDidMount() {
    this.props.getMetros();
    this.state.showSpinner = true;
    ValidatorForm.addValidationRule("lat", (value) => {
      if (isNaN(value)) {
        return false;
      }
      if (/[a-zA-Z]/.test(value)) {
        return false;
      }
      if (parseFloat(value) < -90 || parseFloat(value) > 90) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("long", (value) => {
      if (isNaN(value)) {
        return false;
      }
      if (/[a-zA-Z]/.test(value)) {
        return false;
      }
      if (parseFloat(value) < -180 || parseFloat(value) > 180) {
        return false;
      }
      return true;
    });
  }

  UNSAFE_componentWillReceiveProps(props) {
    console.log("UNSAFE_componentWillReceiveProps", props);
    if (props.userAndRoleDetail) {
      this.state.account = props.userAndRoleDetail;
    }
    if (props.metroList) {
      this.state.locations = props.metroList;
      this.state.count = props.metroList.length;
      this.state.showSpinner = false;
    }
    if (props.isLocationCreateSuccess || props.isLocationEditSuccess) {
      this.state.open = false;
    }
    if (props.isLocationError) {
      this.state.isResponseError = true;
    }
    this.setState({ ...this.state });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";
    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    const locations =
      order === "desc"
        ? this.state.locations.sort((a, b) =>
            b[orderBy] < a[orderBy] ? -1 : 1
          )
        : this.state.locations.sort((a, b) =>
            a[orderBy] < b[orderBy] ? -1 : 1
          );
    this.setState({ locations, order, orderBy });
  };

  handleResponseErrorClose = () => {
    this.setState(
      {
        ...this.state,
        isResponseError: false,
      },
      () => this.props.resetLocationError()
    );
  };

  parseErrorMessage = () => {
    if (this.props.isLocationError && this.props.locationError) {
      return (
        <span id="message-id">
          {typeof this.props.locationError === "string" &&
            this.props.locationError}
          {typeof this.props.locationError === "object" &&
            this.props.locationError?.details[0]?.detail}
        </span>
      );
    }
    return null;
  };

  handleSearchChange = (event) => {
    this.state.filter = event.target.value;
    this.state.locations = this.props.metroList.filter((l) => {
      const searchBase =
        `${l.city}-${l.country}-${l.name}-${l.state}`.toLowerCase();
      return searchBase.indexOf(this.state.filter.toLowerCase()) !== -1;
    });
    this.setState({ ...this.state });
  };

  handleCreateLocationClick = (e) => {
    this.state.location = { ...defaultLocationObject };
    this.state.open = true;
    this.setState({ ...this.state });
  };

  handleEditLocationClick = (data) => {
    console.log("handleEditLocationClick");
    this.state.location = {
      metadata: {
        name: data.name,
      },
      spec: {
        name: data.name,
        city: data.city,
        state: data.state,
        country: data.country,
        countryCode: data.cc,
        stateCode: data.sc,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    };
    this.state.open = true;
    this.setState({ ...this.state });
  };

  handleDeleteLocationClick = (name) => {
    console.log("handleDeleteLocationClick", name);
    this.props.deleteLocation(name);
  };

  handleLocationChange = (name) => (e) => {
    if (name === "name") {
      this.state.location.metadata.name = e.target.value;
      this.state.location.spec.name = e.target.value;
    }
    if (name === "country") {
      if (e) {
        this.state.location.spec.cc = e.value;
        this.state.location.spec.country = isoCountries[e.value];
      } else {
        this.state.location.spec.cc = "";
        this.state.location.spec.country = "";
      }
      this.setState({ ...this.state });
      return;
    }
    if (name === "city") {
      this.state.location.spec.city = e.target.value;
    }
    if (name === "state") {
      this.state.location.spec.state = e.target.value;
    }
    if (name === "latitude") {
      this.state.location.spec.latitude = e.target.value;
    }
    if (name === "longitude") {
      this.state.location.spec.longitude = e.target.value;
    }
    this.state.location[name] = e.target.value;
    this.setState({ ...this.state });
  };

  handleCreateLocationClose = (e) => {
    console.log("handleCreateLocationClose");
    this.state.open = false;
    this.state.location = { ...defaultLocationObject };
    this.setState({ ...this.state });
  };
  handleCreateLocation = (e) => {
    console.log("handleCreateLocation", this.state.location);
    var isLocationExists = false;
    for (var index = 0; index < this.state.locations.length; index++) {
      if (
        this.state.location.metadata.name === this.state.locations[index].name
      ) {
        isLocationExists = true;
      }
    }
    if (isLocationExists) {
      this.props.editLocation({ ...this.state.location });
    } else {
      this.props.addLocation({ ...this.state.location });
    }
    // this.state.open = false
    this.setState({ ...this.state });
  };

  countryList = Object.keys(isoCountries).map((option) => {
    return {
      label: `${isoCountries[option]}`,
      value: option,
    };
  });

  defaultCountryValue = () => {
    if (this.state.location && this.state.location.cc) {
      return this.countryList.find((e) => {
        if (e.value === this.state.location.cc.toUpperCase()) {
          return e;
        }
        return null;
      });
    }
    return null;
  };

  render() {
    const { order, orderBy } = this.state;

    let isReadOnlyOps = false;
    if (this.state.account && this.state.account.role) {
      if (this.state.account.role.name === "ADMIN") {
        isReadOnlyOps = true;
      }
    }

    return (
      <div>
        <h1 className="p-0" style={{ marginBottom: "20px", color: "#ff9800" }}>
          Cluster Locations
        </h1>
        <p style={style.helpText} className="pt-0">
          Configured locations are listed below. You can manage individual
          locations by accessing the correponding ACTIONS menu, or you can
          create a new location by clicking on the NEW LOCATION button.
        </p>
        <Paper>
          <Divider />
          <DataTableToolbar
            handleCreateLocationClick={this.handleCreateLocationClick}
            isReadOnlyOps={isReadOnlyOps}
            // handleClick={e => this.handleClick(e)}
            // handleCreateClick={e => this.handleCreateClick(e)}
            handleSearchChange={(e) => this.handleSearchChange(e)}
            searchValue={this.state.filter}
          />
          <div className="flex-auto">
            <div className="table-responsive-material">
              {this.state.showSpinner && (
                <span>
                  <CircularProgress
                    size={50}
                    style={{
                      position: "absolute",
                      left: "58%",
                      color: "#06b5a3",
                      top: "350px",
                      zIndex: 1500,
                    }}
                  />
                </span>
              )}
              <Table className="">
                <DataTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={this.handleRequestSort}
                />
                <TableBody>
                  {this.state.locations &&
                    this.state.locations.map((n) => (
                      <TableRow
                        hover
                        // onKeyDown={event => this.handleKeyDown(event, n.ID)}
                        key={n.ID}
                      >
                        <TableCell>{n.name}</TableCell>
                        <TableCell padding="none">{n.city}</TableCell>
                        <TableCell padding="none">{n.state}</TableCell>
                        <TableCell padding="none">{n.country}</TableCell>

                        <TableCell>
                          <div className="d-flex flex-row pt-2 pb-2">
                            <div className="d-flex flex-column mr-2">
                              <div className="font-weight-bold">Latitude</div>
                              <div className="font-weight-bold">Longitude</div>
                            </div>
                            <div className="d-flex flex-column">
                              <div>{n.latitude}</div>
                              <div>{n.longitude}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {!isReadOnlyOps && (
                            <CellMenu
                              data={n}
                              handleEditLocationClick={
                                this.handleEditLocationClick
                              }
                              handleDeleteLocationClick={
                                this.handleDeleteLocationClick
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Paper>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={this.state.isResponseError}
          onClose={this.handleResponseErrorClose}
          SnackbarContentProps={{
            "aria-describedby": "message-id",
          }}
          className="mb-3 bg-danger"
          message={this.parseErrorMessage()}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleResponseErrorClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
        <Dialog open={this.state.open} onClose={this.handleCreateWorkloadClose}>
          <DialogTitle>Add Location</DialogTitle>
          <ValidatorForm
            onSubmit={this.handleCreateLocation}
            noValidate
            autoComplete="off"
          >
            <DialogContent>
              <DialogContentText>
                To create a location, enter a name using alphanumeric
                characters. Name should not contain any special characters.
              </DialogContentText>
              <div className="row mt-4 mb-4">
                <div className="col-md-12 mb-3">
                  <TextValidator
                    autoFocus
                    margin="dense"
                    id="name"
                    name="name"
                    value={this.state.location.metadata.name}
                    label="Name"
                    onChange={this.handleLocationChange("name")}
                    fullWidth
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </div>
                <div
                  style={{ color: "rgb(117, 117, 117)" }}
                  className="col-md-3 pt-4 mb-3"
                >
                  <h3>Country</h3>
                </div>
                <div className="col-md-9 pt-3">
                  <Select
                    placeholder="Search countries ..."
                    options={this.countryList}
                    defaultValue={this.defaultCountryValue()}
                    menuPlacement="auto"
                    isClearable
                    maxMenuHeight={200}
                    onChange={this.handleLocationChange("country")}
                  />
                </div>
                {/* <div className="col-md-3" /> */}
                <div className="col-md-12">
                  <TextValidator
                    margin="dense"
                    id="city"
                    name="city"
                    value={this.state.location.spec.city}
                    label="City"
                    onChange={this.handleLocationChange("city")}
                    fullWidth
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </div>
                <div className="col-md-12">
                  <TextValidator
                    margin="dense"
                    id="state"
                    name="state"
                    value={this.state.location.spec.state}
                    label="State / Province"
                    onChange={this.handleLocationChange("state")}
                    fullWidth
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </div>

                <div className="col-md-6 mt-4 mb-4">
                  <TextValidator
                    id="Latitude"
                    name="Latitude"
                    label="Latitude"
                    value={this.state.location.spec.latitude}
                    onChange={this.handleLocationChange("latitude")}
                    margin="dense"
                    fullWidth
                    validators={["required", "lat"]}
                    errorMessages={[
                      "Latitude is required.",
                      "Latitude must be numeric and in range of -90 and 90",
                    ]}
                  />
                </div>
                <div className="col-md-6 mt-4 mb-4">
                  <TextValidator
                    id="Longitude"
                    name="Longitude"
                    label="Longitude"
                    value={this.state.location.spec.longitude}
                    onChange={this.handleLocationChange("longitude")}
                    margin="dense"
                    fullWidth
                    validators={["required", "long"]}
                    errorMessages={[
                      "Longitude is required.",
                      `Longitude must be numeric and in range of -180 and 180`,
                    ]}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCreateLocationClose} color="accent">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  console.log("mapStateToProps mapStateToProps", settings);
  const {
    metroList,
    userAndRoleDetail,
    isLocationCreateSuccess,
    isLocationEditSuccess,
    isLocationError,
    locationError,
  } = settings;
  return {
    metroList,
    userAndRoleDetail,
    isLocationCreateSuccess,
    isLocationEditSuccess,
    isLocationError,
    locationError,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    getMetros,
    editLocation,
    addLocation,
    deleteLocation,
    resetLocationError,
  })(LocationList)
);
