/* eslint-disable max-classes-per-file, react/sort-comp */
import React from "react";
import T from "i18n-react";
import keycode from "keycode";
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
  DialogTitle,
  Snackbar,
  Tooltip,
  IconButton,
  Paper,
  Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ContainerHeader from "components/ContainerHeader/index";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getEdgeDetail,
  getDownloadBootstrapYAML,
  getEdges,
  edgeDetailReset,
  getMetros,
  createCluster,
  updateCluster,
  removeCluster,
  resetAddEdge,
  openKubectlDrawer,
  closeKubectlDrawer,
  setDefaultClusterStatus,
} from "actions/index";
import { ValidatorForm } from "react-material-ui-form-validator";
import { capitalizeFirstLetter } from "../../../../../utils";
import AppNoData from "components/AppNoData";
import Spinner from "components/Spinner";
import AppSnackbar from "components/AppSnackbar";
import CreateClusterV2 from "./components/CreateClusterV2";
import SlatList from "./components/SlatList";
import DataTableToolbar from "./components/DataTableToolbar";
import DateFormat from "components/DateFormat";
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteIconComponent from "components/DeleteIconComponent";
import KubectlSettings from "components/ClusterActions/KubectlSettings";
import ClusterActionDialog from "components/ClusterActions/ClusterActionDialog";
import KubeCtlShellAccess from "components/KubeCtlShellAccess";

const styles = (theme) => ({
  clusterHeading: {
    marginBottom: "20px",
    color: "#ff9800",
  },
  helpText: {
    marginBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "20px",
    paddingTop: "20px",
    paddingBottom: "20px",
    fontStyle: "italic",
    color: "rgb(117, 117, 117)",
  },
  tealText: {
    color: "teal",
  },
  dropdownBlock1: {
    marginLeft: "9px",
    paddingLeft: "15px",
    paddingRight: "15px",
  },
  dropdownBlock2: {
    marginLeft: "-9px",
    paddingLeft: "15px",
    paddingRight: "15px",
  },
  label: {
    marginLeft: "2%",
    color: "gray",
    marginTop: "5px",
  },
  noDataText: {
    textAlign: "center",
    position: "absolute",
    marginLeft: "30%",
  },
  clusterName: { color: "teal", cursor: "pointer" },
  superAdminDisplayName: {
    color: "#808080c7",
    fontSize: "smaller",
  },
  locationIcon: {
    marginLeft: "5px",
    cursor: "pointer",
    color: "teal",
  },
  dialogText: {
    fontSize: "14px",
  },
  k8sVersionTextField: {
    width: "300px",
  },
  upgradeInfoLabel: {
    color: "gray",
    fontSize: "smaller",
    margin: "0px",
  },
  pointer: {
    cursor: "pointer",
  },
  dialogFormWrapper: {
    padding: "20px",
  },
  controlPlaneAndNodeGroupWrapper: {
    padding: "0px",
    paddingTop: "5px",
    marginTop: "10px",
  },
  allLabel: {
    color: "rgba(0, 0, 0, 0.54)",
    marginRight: "20px",
    marginBottom: "initial",
  },
  badge: {
    marginLeft: "10px",
    cursor: "pointer",
    fontSize: "small",
    backgroundColor: "#2196F3",
  },
  managed: {
    marginLeft: "20px",
    color: "gray",
    fontSize: "0.875em",
  },
  health: {
    marginLeft: "12px",
  },
  healthy: {
    color: "#009588",
  },
  unhealthy: {
    color: "#ef1505",
  },
});

let columnData = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "Created At",
  },
  { id: "actions", numeric: true, disablePadding: false, label: "Actions" },
];
const defaultColumnData = columnData;

export const colourOptions = [
  {
    label: "READY",
    value: "READY",
    color: "teal",
  },
  {
    label: "MAINTENANCE",
    value: "MAINTENANCE",
    color: "orange",
  },
  {
    label: "NOT_READY",
    value: "NOT_READY",
    color: "purple",
  },
  {
    label: "PROVISIONING",
    value: "PROVISIONING",
    color: "blue",
  },
  {
    label: "UPGRADING",
    value: "UPGRADING",
    color: "gray",
  },
  {
    label: "PROVISION_FAILED",
    value: "PROVISION_FAILED",
    color: "red",
  },
  {
    label: "PRETEST_FAILED",
    value: "PRETEST_FAILED",
    color: "red",
  },
];

export const healthOptions = [
  {
    label: "HEALTHY",
    value: 1,
    color: "teal",
  },
  {
    label: "UNHEALTHY",
    value: 2,
    color: "red",
  },
  {
    label: "UNKNOWN",
    value: 3,
    color: "orange",
  },
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

class PrivateEdgeList extends React.Component {
  handleLabelsFilter = (selectedOptions) => {
    let labelQueryParams = "";

    if (selectedOptions)
      labelQueryParams = selectedOptions.map((x) => x.value).join(",");

    const defaultStatus = {
      defaultOptions: selectedOptions,
      searchStatus: this.state.searchStatus,
      labelQueryParams,
    };

    this.props.setDefaultClusterStatus(defaultStatus);
    this.setState({ ...this.state }, () =>
      this.props.getEdges(
        this.props.currentProject.metadata.name,
        this.state.rowsPerPage,
        this.state.offset,
        this.state.searchText,
        this.state.searchStatus,
        this.state.orderBy,
        this.state.order
      )
    );
  };
  handleFilter = (selectedOptions) => {
    const { rowsPerPage, offset } = this.state;
    this.state.searchStatus = "";
    selectedOptions &&
      selectedOptions.map((s) => {
        if (s.value === 1 || s.value === 2 || s.value === 3) {
          this.state.searchStatus += `&health=${s.value}`;
        } else {
          this.state.searchStatus += `&status=${s.value}`;
        }
      });

    const defaultStatus = {
      defaultOptions: selectedOptions,
      searchStatus: this.state.searchStatus,
    };
    this.props.setDefaultClusterStatus(defaultStatus);
    this.setState({ ...this.state }, () =>
      this.props.getEdges(
        this.props.currentProject.metadata.name,
        rowsPerPage,
        offset,
        this.state.searchText,
        this.state.searchStatus,
        this.state.orderBy,
        this.state.order
      )
    );
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy }, this.callGetEdges);
  };
  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map((n) => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleKeyDown = (event, id) => {
    if (keycode(event) === "space") {
      this.handleClick(event, id);
    }
  };

  handleCreateClick = (event) => {
    this.state.openAddEdge = true;
    this.state.clusterCreateStep = 0;
    this.state.clusterType = "import";
    this.state.targetEnvType = "VMware";
    this.state.edge = {
      metadata: {},
      spec: {
        clusterType: "import",
      },
    };
    this.state.edge.spec.params = {
      state: "CONFIG",
    };
    this.setState({ ...this.state });
  };

  handleDownloadKubectlConfigToFile(kubectlConfig) {
    const textFileAsBlob = new Blob([kubectlConfig.config], {
      type: "text/plain",
    });
    const fileNameToSaveAs = `config-${this.state.edgeNameKubectlConfig}`;

    const downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }
    downloadLink.click();
  }

  handleSaveClusterConfig = (edge_name, data) => {
    const textFileAsBlob = new Blob([data], { type: "text/plain" });
    const fileNameToSaveAs = `${edge_name}-config.yaml`;

    const downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }
    downloadLink.click();
  };

  handleEdgeNotFoundErrorClose = () => {
    this.state.isEdgeNotFound = false;
    this.state.edgeNotFoundErrorMessage = "";
    this.setState({ ...this.state });
  };

  handleClick = (event, id) => {
    this.state.open = true;
    this.state.edge =
      this.props.edges.list &&
      this.props.edges.list.find((edge) => edge.metadata.name === id);
    this.setState({ ...this.state });
  };

  handleChangePage = (event, page) => {
    const offset = Math.abs(page * this.state.rowsPerPage);
    this.setState({ page, offset });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, offset: 0, page: 0 });
  };

  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  handleAddEdgeClose = (event) => {
    if (this.state.clusterType === "import") {
      this.clearGetCluster();
    }
    this.state.openAddEdge = false;
    this.state.metroNotConfigured = false;
    this.state.clusterNameNotConfigured = false;
    this.setState({ ...this.state }, () => this.props.resetAddEdge());
  };

  handleAddClusterClose = (edge) => {
    this.setState({ openAddEdge: false }, () => {
      this.props.history.push(`/app/edges/${edge.metadata.name}`);
    });
  };

  handleKubectlSettingsClose = () => {
    this.setState({ kubectlSettingsOpen: false });
  };

  handleEdgeChange = (name) => (event) => {
    if (name === "metro") {
      if (event) {
        this.state.edge.spec.metro = {
          name: event.value,
        };
        this.state.metroNotConfigured = false;
      } else {
        this.state.edge.spec.metro = null;
      }
      this.setState({ ...this.state });
      return;
    }

    this.state.edge[name] = event.target.value;
    if (name) {
      this.state.clusterNameNotConfigured = false;
    }

    this.setState({ ...this.state });
  };

  handleAddEdge = (event) => {
    this.state.addEdgeClicked = true;

    if (this.state.clusterType === "import") {
      this.state.openAddEdge = true;
      this.state.addEdgeClicked = false;
      // this.state.clusterCreateStep = 2
    }

    if (this.state.edge && !this.state.edge.metadata.name) {
      this.state.clusterNameNotConfigured = true;
    }
    if (
      this.state.edge &&
      !this.state.edge.spec.metro &&
      !this.state.edge.spec.Metro
    ) {
      this.state.metroNotConfigured = true;
    }
    if (this.state.clusterNameNotConfigured || this.state.metroNotConfigured) {
      this.setState({ ...this.state });
      return;
    }
    this.state.openAddEdge = false;
    this.state.edge.metadata.labels = [];

    this.setState({ ...this.state });
    if (this.state.edge.metadata.id) {
      this.state.edge.spec.params = JSON.stringify(this.state.edge.spec.params);
      this.props.updateCluster(this.state.edge);
    } else {
      this.state.edge.spec.params = JSON.stringify(this.state.edge.spec.params);
      this.props.createCluster(this.state.edge);
    }
  };

  handleReady = (event, edge) => {
    const tmpEdge = { ...edge };
    tmpEdge.status = "READY";
    this.state.edge = tmpEdge;
    this.setState({ ...this.state });
    this.handleAddEdge();
  };

  deleteEdge = (edge, forceDelete) => {
    this.props.removeCluster(
      edge.metadata.name,
      this.props.currentProject.metadata.name,
      forceDelete
    );
    this.props.history.push("/app/edges");
  };

  handleKubectlSettings = (event, edge) => {
    this.state.kubectlSettingsOpen = true;
    this.state.cancelAction = {
      isHidden: true,
    };
    this.state.action = {
      isHidden: true,
    };
    this.state.header = (
      <div className="w-100 d-flex justify-content-between">
        <div>Kubectl Settings</div>
        <div style={{ fontSize: "14px" }} className="d-flex align-items-center">
          <div>Cluster: {edge.metadata.name}</div>
        </div>
      </div>
    );

    this.state.content = (
      <KubectlSettings
        open={this.state.kubectlSettingsOpen}
        onClose={this.handleKubectlSettingsClose}
        edge={edge}
      />
    );

    this.setState({ ...this.state });
  };

  handleValidator = () => {
    // handleValidator
  };

  handleToggle = (event, type) => {
    this.state.user.account[type] = !this.state.user.account[type];
    this.setState({ ...this.state });
  };

  handleResponseErrorClose = () => {
    this.setState({
      ...this.state,
      isResponseError: false,
      isResponseSuccess: false,
      errorMessage: "",
      // removeEdgeObj: {}
    });
  };

  getErrorMessage = () => {
    const { errorMessage } = this.state;
    const { edges } = this.props;
    const { error } = edges;
    if (!error && errorMessage === "") {
      return null;
    }
    if (error) {
      if (
        error.status_code === 401 &&
        error.details &&
        error.details.length > 0
      ) {
        return <T.span id="message-id" text="unauthorized" />;
      }
      return (
        <span id="message-id">{capitalizeFirstLetter(error.message)}</span>
      );
    }
    if (errorMessage !== "") {
      return <span id="message-id">{capitalizeFirstLetter(errorMessage)}</span>;
    }
    return null;
  };

  getSuccessMessage = () => {
    if (this.state.removeEdgeObj) {
      return (
        <span id="message-id">
          Delete cluster request submitted successfully.
        </span>
      );
    }
    return null;
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      order: "asc",
      orderBy: "name",
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 25,
      offset: 0,
      count: 5,
      open: false,
      isResponseError: false,
      edge: {},
      edges: [],
      edgesLoaded: false,
      edgeImages: {},
      organizations: [],
      partners: [],
      isEdgeNotFound: false,
      edgeNotFoundErrorMessage: "",
      searchText: "",
      searchStatus: "",
      defaultOptions: [
        /*
        { label: "READY", value: "READY", color: "teal" },
        { label: "UPGRADING", value: "UPGRADING", color: "gray" }
       */
      ],
      labelQueryParams: "",
      kubectlConfig: "",
      downloadKubectlConfigReady: false,
      edgeNameKubectlConfig: "",
      openAddEdge: false,
      userRole: "",
      OrgOptions: [],
      metroNotConfigured: false,
      clusterNameNotConfigured: false,
      errorMessage: "",
      clusterType: "on-prem",
      clusterCreateStep: 0,
      downloadClusterYAMLClick: false,
      renderInTable: true,
      removeEdgeObj: {},
      versionType: "control plane and nodegroups",
      selected_nodegroups: [],
      checkList: [],
      openDrawer: false,
      selectedEdgeForGpu: null,
      custom: false,
      kubectlSettingsOpen: false,
      cancelAction: null,
      action: null,
      header: null,
      content: null,
    };

    this.reader = null;
  }

  UNSAFE_componentWillMount() {
    const { rowsPerPage, offset } = this.state;
    if (!this.props.location?.state?.healthStatus) {
      this.props.getMetros();
    }
    if (
      this.props.history &&
      this.props.history.location &&
      this.props.history.location.state &&
      this.props.history.location.state.clusterstatus === "ready"
    ) {
      this.state.searchStatus = "&status=READY";
      this.state.defaultOptions = [
        { label: "READY", value: "READY", color: "teal" },
      ];
    }
  }

  componentDidMount() {
    const { location } = this.props;
    if (location.state) {
      // manually change status filter option
      if (location.state.healthStatus === "Healthy") {
        this.handleFilter([{ label: "HEALTHY", value: 1, color: "teal" }]);
      } else if (location.state.healthStatus === "Unhealthy") {
        this.handleFilter([{ label: "UNHEALTHY", value: 2, color: "red" }]);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    const { rowsPerPage, page, offset, count } = this.state;
    const { userRole } = props;
    if (userRole && userRole.isSuperAdmin) {
      this.state.userRole = "SUPER_ADMIN";
    }
    if (userRole && userRole.isPartnerAdmin) {
      this.state.userRole = "PARTNER_ADMIN";
    }
    if (
      this.state.userRole !== "SUPER_ADMIN" &&
      this.state.userRole !== "PARTNER_ADMIN" &&
      props.organization &&
      props.organization.detail &&
      !this.state.callgetEdges
    ) {
      this.state.callgetEdges = true;
      this.setState({ ...this.state }, () => this.callGetEdges());
    }

    if (props.edges && props.edges.isEdgesResponseError) {
      this.state.isResponseError = true;
    }

    this.state.noEdgeDataAvailable = false;
    if (
      props.edges &&
      (!props.edges.list || (props.edges.list && props.edges.list.length === 0))
    ) {
      this.state.noEdgeDataAvailable = true;
      this.state.edges = [];
      this.state.edgesLoaded = true;
    }

    if (this.state.filterSetup && !this.state.statusSearchFilter) {
      this.state.statusSearchFilter = true;
    }

    if (!this.state.filterSetup && props.edges && props.edges.list) {
      this.state.filterSetup = true;
      this.state.edges = [];
      if (props.edges.list.length < 1) {
        this.state.searchStatus = "";
        this.state.defaultOptions = [];
        const defaultStatus = {
          defaultOptions: [],
          searchStatus: "",
        };
        this.props.setDefaultClusterStatus(defaultStatus);
        // this.setState({ ...this.state }, () => this.callGetEdges());
      }
      this.setState({ ...this.state }, () => this.callGetEdges());
      return;
    }
    if (props.edges && props.edges.list && this.state.statusSearchFilter) {
      this.state.edges = props.edges.list;
      this.state.edgesLoaded = true;
    }

    // This seems to be the cause for overwritten cluster. Clean up later
    if (
      props.edges.detail &&
      props.edges.detail.metadata.id &&
      !this.state.openAddEdge
    ) {
      this.state.edge = props.edges.detail;
    }

    if (this.state.downloadClusterYAMLClick && props.downloadYAML) {
      this.handleDownloadConfig(props.downloadYAML);
      this.state.downloadClusterYAMLClick = false;
    }

    if (
      props.edges.isUpdateEdgeSuccess &&
      this.state.v2ClusterUpdateInitiated
    ) {
      this.state.openAddEdge = false;
      this.state.v2ClusterUpdateInitiated = false;
      this.setState({ ...this.state });
      const { history } = this.props;
      history.push(
        `${history.location.pathname}/${this.state.edge.metadata.name}`
      );
    }

    if (props.edges.isAddEdgeSuccess) {
      this.props.resetAddEdge();
      if (
        props.edges.detail &&
        props.edges.detail.metadata.id &&
        (this.state.addEdgeClicked || this.state.clusterType === "import")
      ) {
        const { history } = this.props;
        history.push(
          `${history.location.pathname}/${props.edges.detail.metadata.name}`
        );
      }
    }

    if (props.edges.isDeleteEdgeSuccess) {
      this.props.getEdges(
        this.props.currentProject.metadata.name,
        rowsPerPage,
        offset,
        this.state.searchText,
        this.state.searchStatus,
        this.state.orderBy,
        this.state.order
      );
    }

    this.setState({ ...this.state });
  }

  UNSAFE_componentWillUpdate(props) {
    ValidatorForm.addValidationRule("regexVal", (value) => {
      const regex = /^[a-z0-9.A-Z-]+$/;
      if (value === this.state.edge.metadata.name) {
        return regex.test(this.state.edge.metadata.name);
      }
      return true;
    });

    ValidatorForm.addValidationRule("emptyVal", (value) => {
      if (value === "") {
        return false;
      }
      return true;
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { rowsPerPage, page, offset, count } = this.state;
    if (this.props.edges.list) {
      const count1 = this.props.edges.list.length;
      if (count1 && count1 !== count) {
        this.setState({ count: count1 });
      }
    }

    if (rowsPerPage !== prevState.rowsPerPage) {
      this.props.getEdges(
        this.props.currentProject.metadata.name,
        rowsPerPage,
        offset,
        this.state.searchText,
        this.state.searchStatus,
        this.state.orderBy,
        this.state.order
      );
    }

    if (page !== prevState.page) {
      this.props.getEdges(
        this.props.currentProject.metadata.name,
        rowsPerPage,
        offset,
        this.state.searchText,
        this.state.searchStatus,
        this.state.orderBy,
        this.state.order
      );
    }
  }

  handleSearchChange = (event) => {
    this.state.searchText = event.target.value;
    const { rowsPerPage, offset, orderBy, order } = this.state;

    if (this.setTime) {
      clearTimeout(this.setTime);
    }
    this.setTime = setTimeout(
      () =>
        this.props.getEdges(
          this.props.currentProject.metadata.name,
          rowsPerPage,
          offset,
          this.state.searchText,
          this.state.searchStatus,
          this.state.orderBy,
          this.state.order
        ),
      500
    );

    this.setState(this.state);
  };

  getLastSeen = (edge) => {
    let result = "";
    const lastSeenDate = new Date(edge.health_status_modified_at);
    const currentDate = new Date();
    let difference = currentDate.getTime() - lastSeenDate.getTime();

    const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24;

    const hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60;

    const minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60;

    const secondsDifference = Math.floor(difference / 1000);
    if (daysDifference !== 0) {
      result = `${result}${daysDifference} day/s `;
    }
    if (hoursDifference !== 0) {
      result = `${result}${hoursDifference} hour/s `;
    }
    if (minutesDifference !== 0) {
      result = `${result}${minutesDifference} minute/s `;
    }
    if (secondsDifference !== 0) {
      result = `${result}${secondsDifference} second/s `;
    }
    return result;
  };

  componentWillUnmount() {
    columnData = defaultColumnData;
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.edgesCommitedInterval) {
      clearInterval(this.edgesCommitedInterval);
    }
    if (this.clusterDetailPoller) {
      clearInterval(this.clusterDetailPoller);
    }
    clearInterval(this.alertstimeinterval);
    this.clearGetCluster();
    this.props.edgeDetailReset();
  }

  callGetEdges = () => {
    this.props.getEdges(
      this.props.currentProject.metadata.name,
      this.state.rowsPerPage,
      this.state.offset,
      this.state.searchText,
      this.state.searchStatus,
      this.state.orderBy,
      this.state.order
    );
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    this.timeInterval = setInterval(
      () =>
        this.props.getEdges(
          this.props.currentProject.metadata.name,
          this.state.rowsPerPage,
          this.state.offset,
          this.state.searchText,
          this.state.searchStatus,
          this.state.orderBy,
          this.state.order
        ),
      30000
    );
    this.state.isResponseSuccess = false;
    this.setState({ ...this.state });
  };

  pauseAutoRefresh = () => {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }

    if (this.alertstimeinterval) {
      clearInterval(this.alertstimeinterval);
    }
  };

  resumeAutoRefresh = () => {
    this.timeInterval = setInterval(
      () =>
        this.props.getEdges(
          this.props.currentProject.metadata.name,
          this.state.rowsPerPage,
          this.state.offset,
          this.state.searchText,
          this.state.searchStatus,
          this.state.orderBy,
          this.state.order
        ),
      30000
    );
  };

  callGetCluster = () => {
    this.props.getEdgeDetail(this.state.edge.name);
    this.clusterDetailPoller = setInterval(
      () => this.props.getEdgeDetail(this.state.edge.name),
      5000
    );
  };

  clearGetCluster = () => {
    clearInterval(this.clusterDetailPoller);
    this.clusterDetailPoller = null;
  };

  selectClusterType = (type) => {
    this.state.clusterType = type;
    this.setState({ ...this.state });
  };

  selectTargetEnvType = (type) => {
    this.state.targetEnvType = type;
    this.setState({ ...this.state });
  };

  clusterCreateStepNext = () => {
    this.state.clusterCreateStep += 1;
    if (this.state.clusterType === "import") {
      this.state.edge.metadata.name = "";
      // this.state.edge.cluster_type = 'v2'
      this.state.edge.spec.clusterType = "imported";
    }

    this.setState({ ...this.state });
  };

  clusterCreateStepBack = () => {
    this.state.clusterCreateStep -= 1;
    this.setState({ ...this.state });
  };

  downloadClusterYAML = () => {
    console.log(this.state.edge.name);
    this.state.downloadClusterYAMLClick = true;
    this.setState(
      { ...this.state },
      this.props.getDownloadBootstrapYAML(this.state.edge.name)
    );
  };

  handleDownloadConfig = (fileData) => {
    const textFileAsBlob = new Blob([fileData], { type: "text/plain" });
    const fileNameToSaveAs = `${this.state.edge.metadata.name}-bootstrap.yaml`;

    const downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }
    downloadLink.click();
  };

  finishClusterCreate = (cluster) => {
    this.state.openAddEdge = false;
    this.setState({ ...this.state });
    const { history } = this.props;
    history.push(`${history.location.pathname}/${cluster.metadata.name}`);
    this.setState({ ...this.state });
  };

  statusColorStyle = (status) => {
    for (let index = 0; index < colourOptions.length; index++) {
      const element = colourOptions[index];
      if (element.value === status) {
        return {
          color: element.color,
        };
      }
    }
    return { color: "black" };
  };

  parseSlatBackground = (index) => {
    if (index % 2 === 1) {
      return {
        backgroundColor: "#f0f8ff78",
      };
    }
    return {};
  };

  flipViewType = () => {
    this.setState({
      ...this.state,
      renderInTable: !this.state.renderInTable,
    });
  };

  setDefaultValue = () => {
    const values = [];
    colourOptions.forEach((c) => {
      if (this.state.searchStatus.includes(c.value)) {
        values.push(c);
      }
    });
    healthOptions.forEach((c) => {
      if (this.state.searchStatus.includes(c.value)) {
        values.push(c);
      }
    });
    return values;
  };

  handleSnackbarResponseClose = () => {
    this.setState({ showAlert: false, alertMessage: null });
  };

  errorCallback = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: message,
    });
  };

  handleCloseAlerts = () => {
    this.state.alertsOpen = false;
    this.setState({ ...this.state });
  };

  reRouteToKubeDetails = (data) => {
    const { history } = this.props;
    history.push({
      pathname: `${history.location.pathname}/${this.state.selected_cluster_id}/activity`,
      job_id: data.job_id,
    });
  };

  handleOpenKubectl = (name) => {
    this.props.closeKubectlDrawer();
    setTimeout(
      () =>
        this.props.openKubectlDrawer(
          this.props.currentProject.metadata.name,
          name
        ),
      500
    );
  };

  handleEksVersionType = (event) => {
    this.state.versionType = event.target.value;
    this.setState({ ...this.state });
  };

  handleChangeList = (ng) => {
    this.state.checkList[ng.name] = !this.state.checkList[ng.name];
    const notchecked = Object.keys(this.state.checkList).find(
      (x) => this.state.checkList[x] === false
    );
    this.state.selectAll = !notchecked;
    this.setState({ ...this.state });
  };

  handleSelectAll = () => {
    this.state.selectAll = !this.state.selectAll;
    if (this.state.selectAll) {
      Object.keys(this.state.checkList).forEach((cl) => {
        this.state.checkList[cl] = true;
      });
    } else {
      Object.keys(this.state.checkList).forEach((cl) => {
        this.state.checkList[cl] = false;
      });
    }
    this.setState({ ...this.state });
  };

  handleCloseDrawer = () => {
    this.setState({
      ...this.state,
      openDrawer: false,
      selectedEdgeForGpu: null,
    });
  };

  handleOpenDrawer = (drawerType) => {
    this.setState({
      ...this.state,
      openDrawer: true,
      drawerType,
    });
  };

  setSelectedEdgeForGpu = (edge) => {
    this.setState({
      ...this.state,
      selectedEdgeForGpu: edge,
      openDrawer: true,
    });
  };

  render() {
    const { classes } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const { match, UserSession, Projects, sshEdges, partnerDetail } =
      this.props;
    let data = [];
    if (!this.state.edges) {
      return null;
    }

    if (this.state.edges) {
      data = this.state.edges;
    }
    if (
      data == null ||
      this.state.partners == null ||
      this.state.organizations == null
    ) {
      return <ContainerHeader title="Clusters" match={match} />;
    }

    if (this.props.defaultClusterStatus && this.state.filterSetup) {
      this.state.searchStatus = this.props.defaultClusterStatus.searchStatus;
      this.state.defaultOptions =
        this.props.defaultClusterStatus.defaultOptions;
    }

    const { showAlert, alertMessage, cluster } = this.state;
    const { history } = this.props;
    const cluster_type = cluster?.cluster_type || null;

    const isClusterReady = (cluster) => {
      let ready = false;
      if (
        cluster?.spec.clusterData &&
        cluster?.spec.clusterData.cluster_status &&
        cluster?.spec.clusterData.cluster_status.conditions &&
        cluster?.spec.clusterData.cluster_status.conditions.length > 0
      ) {
        for (
          let index = 0;
          index < cluster?.spec.clusterData?.cluster_status?.conditions?.length;
          index++
        ) {
          ready =
            cluster.spec.clusterData.cluster_status.conditions[index].type ===
              "ClusterReady" &&
            cluster.spec.clusterData.cluster_status.conditions[index].status ===
              "Success";
          if (ready) {
            return ready;
          }
        }
      }
      return ready;
    };

    const hasWriteAccessInCluster = (projectName) => {
      let hasWriteAccess = false;
      var allPermissions = this.props.userAndRoleDetail.spec.permissions
        .filter((obj) => obj.project === projectName || obj.role === "ADMIN")
        .map((item) => item.permissions);
      let deduplicatedPermissions = new Set(allPermissions.flat(1));
      hasWriteAccess = deduplicatedPermissions.has("cluster.write");
      return hasWriteAccess;
    };

    return (
      <Spinner loading={!this.state.edgesLoaded} hideChildren addHeight>
        <div>
          <div className="row">
            <div className="col-md-12">
              <h1 className={`p-0 ${classes.clusterHeading}`}>Clusters</h1>
              {data.length ? (
                <p className={`pt-0 ${classes.helpText}`}>
                  Your configured Clusters are listed below. You can manage
                  individual clusters through the corresponding ACTIONS menu, or
                  you can create a new cluster by clicking on the NEW CLUSTER
                  button.
                </p>
              ) : (
                <p className={`pt-0 ${classes.helpText}`}>
                  Currently you don't have clusters. Create a new cluster by
                  clicking on the NEW CLUSTER button
                </p>
              )}
            </div>
          </div>
          <Paper className="mb-4">
            <DataTableToolbar
              renderInTable={this.state.renderInTable}
              callGetEdges={this.callGetEdges}
              setDefaultValue={this.setDefaultValue}
              flipViewType={this.flipViewType}
              numSelected={selected.length}
              handleDownloadKubectlConfig={(e) =>
                this.handleDownloadKubectlConfig(e)
              }
              handleCreateClick={(e) => this.handleCreateClick(e)}
              handleSearchChange={(e) => this.handleSearchChange(e)}
              searchValue={this.state.searchText}
              handleFilter={this.handleFilter}
              handleLabelsFilter={this.handleLabelsFilter}
              clusterLabels={this.props.clusterLabels}
              userRole={this.state.userRole}
              defaultOptions={this.state.defaultOptions}
              statusSearchFilter={this.state.statusSearchFilter}
              userAndRoleDetail={this.props.userAndRoleDetail}
              data={data}
            />
            {!data.length && <AppNoData label="No cluster available!" />}
            {!!(this.state.renderInTable && data.length) && (
              <div className="flex-auto">
                <div className="table-responsive-material">
                  <Table className="">
                    <DataTableHead
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={this.handleSelectAllClick}
                      onRequestSort={this.handleRequestSort}
                      rowCount={data.length}
                    />
                    <TableBody>
                      {this.state.noEdgeDataAvailable && (
                        <p className={classes.noDataText}>
                          * No data available for this selection
                        </p>
                      )}
                      {data.map((n) => (
                        <TableRow
                          // hover
                          onKeyDown={(event) =>
                            this.handleKeyDown(event, n.metadata.name)
                          }
                          key={n.id}
                        >
                          <TableCell
                            className="pr-0"
                            onClick={() =>
                              history.push(
                                `${history.location.pathname}/${n.metadata.name}`
                              )
                            }
                          >
                            <span className={classes.clusterName}>
                              {n.metadata.name}
                              <br />
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="row">
                              <div className="col-md-10 order-md-1">
                                <DateFormat timestamp={n.metadata.createdAt} />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell data={n}>
                            <div className="row">
                              {isClusterReady(n) && (
                                <KubeCtlShellAccess
                                  projectId={n.metadata.project}
                                  clusterName={n.metadata.name}
                                  iconOnly={true}
                                />
                              )}
                              {hasWriteAccessInCluster(n.metadata.project) && (
                                <Tooltip title="Kubectl Settings">
                                  <IconButton
                                    aria-label="edit"
                                    className="m-0"
                                    onClick={(event) => {
                                      this.handleKubectlSettings(null, n);
                                    }}
                                  >
                                    <SettingsIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {hasWriteAccessInCluster(n.metadata.project) && (
                                <DeleteIconComponent
                                  key={n.metadata.name}
                                  button={{
                                    type: "danger-icon",
                                    label: "Delete",
                                    confirmText: (
                                      <span>
                                        Are you sure you want to delete
                                        <b> {n.metadata.name} </b>?
                                      </span>
                                    ),
                                    handleClick: () => {
                                      this.deleteEdge(n, true);
                                    },
                                  }}
                                />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          count={this.state.count}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onChangePage={this.handleChangePage}
                          onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
            )}
          </Paper>
          {!!(!this.state.renderInTable && data.length) && (
            <div>
              {data.map((n, index) => (
                <SlatList
                  key={n.metadata.id}
                  cluster={n}
                  state={{ ...this.state }}
                  parentProps={{ ...this.props }}
                  index={index}
                  UserSession={this.props.UserSession}
                  hasWriteAccessInCluster={hasWriteAccessInCluster(
                    n.metadata.project
                  )}
                  isUpdateEndpointsSuccess={this.props.isUpdateEndpointsSuccess}
                  isUpdateEndpointsError={this.props.isUpdateEndpointsError}
                  UpdateEndpointsError={this.props.UpdateEndpointsError}
                  statusColorStyle={this.statusColorStyle}
                  history={this.props.history}
                  handleOpenKubectl={() =>
                    this.handleOpenKubectl(n.metadata.name)
                  }
                  outstandingAlerts={this.props.outstandingAlerts || []}
                  alertsConfig={this.props.alertsConfig}
                  partnerDetail={this.props.partnerDetail}
                  projectList={this.props.projectList}
                  handleOpenDrawer={this.handleOpenDrawer}
                  setSelectedEdgeForGpu={this.setSelectedEdgeForGpu}
                  pauseAutoRefresh={this.pauseAutoRefresh}
                  resumeAutoRefresh={this.resumeAutoRefresh}
                />
              ))}
              <Paper className="mt-4">
                <Table className="">
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={this.state.count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </Paper>
            </div>
          )}
          {this.state.openAddEdge && (
            <CreateClusterV2
              open={this.state.openAddEdge}
              handleClose={this.handleAddEdgeClose}
              handleCloseCluster={this.handleAddClusterClose}
            />
          )}
          {this.state.kubectlSettingsOpen && (
            <ClusterActionDialog
              isOpen={this.state.kubectlSettingsOpen}
              header={this.state.header}
              content={this.state.content}
              action={this.state.action}
              cancelAction={this.state.cancelAction}
            />
          )}
          {this.state.openAddEdgeImages && (
            <EdgeImagesDialog
              isEdit={false}
              edgeImages={this.state.edgeImages}
              userRole={this.state.userRole}
              open={this.state.openAddEdgeImages}
              handleAddEdgeImagesClose={this.handleAddEdgeImagesClose}
              handleAddEdgeImages={this.handleAddEdgeImages}
              handleEdgeImagesChange={this.handleEdgeImagesChange}
            />
          )}
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={!!(this.state.isResponseError && this.getErrorMessage())}
            onClose={this.handleResponseErrorClose}
            SnackbarContentProps={{
              "aria-describedby": "message-id",
            }}
            className="mb-3 bg-danger"
            message={this.getErrorMessage()}
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
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.isEdgeNotFound}
            onClose={this.handleEdgeNotFoundErrorClose}
            SnackbarContentProps={{
              "aria-describedby": "message-id",
            }}
            className="mb-3 bg-danger"
            message={this.state.edgeNotFoundErrorMessage}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleEdgeNotFoundErrorClose}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.isResponseSuccess && this.getSuccessMessage()}
            onClose={this.handleResponseErrorClose}
            SnackbarContentProps={{
              "aria-describedby": "message-id",
            }}
            className="mb-3 bg-primary"
            message={this.getSuccessMessage()}
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
          <Dialog
            open={this.state.edgeOpen || false}
            onClose={() => {
              this.setState({ edgeOpen: false });
            }}
            maxWidth="md"
          >
            <DialogTitle>
              {this.state.edge && this.state.edge.metadata?.name}
            </DialogTitle>
            <DialogActions>
              <Button
                color="primary"
                onClick={() => {
                  this.setState({ edgeOpen: false });
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <AppSnackbar
            open={showAlert}
            message={capitalizeFirstLetter(alertMessage)}
            closeCallback={this.handleSnackbarResponseClose}
          />
        </div>
      </Spinner>
    );
  }
}

const mapStateToProps = ({ settings, Projects, UserSession }) => {
  const {
    edges,
    organization,
    userAndRoleDetail,
    metroList,
    downloadYAML,
    defaultClusterStatus,
    userRole,
  } = settings;
  const { currentProject } = Projects;
  const partnerDetail = settings.partnerDetail;
  return {
    edges,
    organization,
    userAndRoleDetail,
    metroList,
    downloadYAML,
    defaultClusterStatus,
    userRole,
    currentProject,
    UserSession,
    partnerDetail,
    Projects,
    projectList: Projects.projectsList?.items || [],
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getEdgeDetail,
    getDownloadBootstrapYAML,
    getEdges,
    edgeDetailReset,
    getMetros,
    createCluster,
    updateCluster,
    removeCluster,
    resetAddEdge,
    setDefaultClusterStatus,
    openKubectlDrawer,
    closeKubectlDrawer,
  })(withStyles(styles)(PrivateEdgeList))
);
