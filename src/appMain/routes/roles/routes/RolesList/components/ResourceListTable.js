import React from "react";
import { connect } from "react-redux";
import { getGroupDetail } from "actions";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import RafayDelete from "components/RafayDelete";
import { ROLE_COLUMN_HEADER_CONFIG } from "constants/Constant";
import DataTableDynamic from "components/RafayTable/DataTableDynamic";
import TableToolbar from "./TableToolbar";
import PermissionList from "components/PermissionList";

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
  projectList: {
    whiteSpace: "unset",
    wordBreak: "break-all",
    maxWidth: "15rem",
  },
  mutedLabel: {
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#BDBDBD",
  },
  userNameLabel: {
    color: "teal",
    fontWeight: 500,
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  userNameTitleLabel: {
    color: "#BDBDBD",
    fontSize: "0.7rem",
    lineHeight: "1.5rem",
    cursor: "pointer",
    fontWeight: "500",
  },
  userTypeLabel: {
    color: "#BDBDBD",
    fontSize: "0.8rem",
  },
  lastAccessValue: {
    color: "#BDBDBD",
    fontSize: "0.8rem",
  },
  actionContainer: {
    paddingLeft: "2rem",
    float: "right",
  },
  roleDetailContainer: {
    padding: "0.5rem 0",
    width: "12rem",
    overflowWrap: "break-word",
  },
  noResult: {
    textAlign: "center",
    margin: "0 2rem",
  },
  nameLabel: {
    fontWeight: "500",
  },
  nameLabelDescription: {
    fontSize: "0.65rem",
  },
};
class ResourceListTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "asc",
      orderBy: "name",
      selected: [],
      page: 0,
      offset: 0,
      count: 10,
      rowsPerPage: 10,
      searchText: "",
      columnLabels: ROLE_COLUMN_HEADER_CONFIG,
    };
  }

  UNSAFE_componentWillMount() {
    const { rowsPerPage, offset, searchText, orderBy, order } = this.state;
  }

  handleChangePage = (event, page) => {
    const { rowsPerPage } = this.state;
    const offset = Math.abs(page * rowsPerPage);
    this.setState({ page, offset });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, offset: 0, page: 0 });
  };

  handleSearchChange = (event) => {
    this.setState({
      searchText: event.target.value,
    });
  };

  handleGoToRoleDetail = (event, id) => {
    const { history } = this.props;
    history.push(`/main/roles/${id}`);
  };

  getName = (data) => {
    if (data.spec.scope === "system") {
      return (
        <>
          <div style={style.nameLabel}>{data.metadata.name}</div>
          <div className="text-muted" style={style.nameLabelDescription}>
            Default role for all system admins
          </div>
        </>
      );
    }
    if (data.spec.scope === "organization") {
      return (
        <>
          <div style={style.nameLabel}>{data.metadata.name}</div>
          <div className="text-muted" style={style.nameLabelDescription}>
            Default role for all organization admins
          </div>
        </>
      );
    }
    return data.metadata.name;
  };

  getCollapsedRow = (data) => {
    return (
      <PermissionList
        permissions={data.spec.rolepermissions}
        showExpandedList
      ></PermissionList>
    );
  };

  parseRowData = (data) => {
    const roleDetails = (
      <div
        style={style.roleDetailContainer}
        onClick={(event) => this.props.handleGoToManageRoles(event, data)}
      >
        <div style={style.userNameLabel}> {this.getName(data)}</div>
      </div>
    );

    const permissions = (
      <PermissionList permissions={data.spec.rolepermissions} />
    );

    const actionDetails = (
      <div style={style.actionContainer}>
        <Tooltip title="Edit">
          <IconButton
            aria-label="edit"
            className="m-0"
            onClick={(event) =>
              this.handleGoToRoleDetail(event, data.metadata.name.toLowerCase())
            }
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <RafayDelete
          key={data.metadata.id}
          button={{
            type: "danger-icon",
            label: "Delete",
            disabled: data.spec.isGlobal,
            confirmText: (
              <span>
                Are you sure you want to delete
                <b> {data.metadata.name} </b>?
              </span>
            ),
            handleClick: () => this.props.handleRemoveRole(data.metadata.name),
          }}
        />
      </div>
    );

    const rows = [
      {
        type: "regular",
        isExpandable: false,
        value: roleDetails,
      },
      {
        type: "regular",
        isExpandable: true,
        value: permissions,
      },
      {
        type: "regular",
        isExpandable: false,
        value: actionDetails,
      },
    ];

    return rows;
  };

  render() {
    const { list } = this.props;
    const { handleCreateClick, handleRemoveRole, handleGoToManageRoles } =
      this.props;
    const { count, rowsPerPage, page, order, orderBy, selected, searchText } =
      this.state;

    let listCount = list.length;
    let roleList = [...list];
    if (searchText) {
      roleList = list.filter(
        (u) =>
          u.metadata.name &&
          u.metadata.name.indexOf(searchText.toUpperCase()) !== -1
      );
      listCount = roleList.length;
    }

    let data = [];
    if (roleList) {
      if (roleList && roleList.length > rowsPerPage) {
        const startIndex = rowsPerPage * page;
        const endIndex = startIndex + rowsPerPage;
        data = roleList.slice(startIndex, endIndex);
      } else {
        data = roleList;
      }
    }

    return (
      <Paper>
        <TableToolbar
          numSelected={selected.length}
          handleCreateClick={handleCreateClick}
          handleSearchChange={this.handleSearchChange}
          searchValue={searchText}
        />
        <div className="flex-auto">
          <div className="table-responsive-material">
            <DataTableDynamic
              loading={this.props.loading}
              columnLabels={this.state.columnLabels}
              list={data || []}
              getCollapsedRow={this.getCollapsedRow}
              parseRowData={this.parseRowData}
              handleGetRows={(_) => this.handleGetRows}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              count={listCount}
              customRowsPerPage={rowsPerPage}
              customPage={page}
              customHandleChangePage={this.handleChangePage}
              customHandleChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </div>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = ({ Groups }) => {
  const { groupDetail } = Groups;
  return { groupDetail };
};

export default connect(mapStateToProps, {
  getGroupDetail,
})(ResourceListTable);
