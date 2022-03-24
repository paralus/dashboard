import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Button,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import RafayDelete from "components/RafayDelete";
import TableToolbar from "./TableToolbar";
import DataTableHead from "./DataTableHead";

const dateFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};

class ProjectsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "asc",
      orderBy: "name",
      selected: [],
      page: 0,
      offset: 0,
      count: 5,
      rowsPerPage: 10,
      searchText: "",
    };
  }

  UNSAFE_componentWillMount() {
    const { rowsPerPage, offset, searchText, orderBy, order } = this.state;
  }

  handleChangePage = (event, page) => {
    const offset = Math.abs(page * this.state.rowsPerPage);
    this.setState({ page, offset });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, offset: 0, page: 0 });
  };

  handleGoToProjectClick = (name) => {
    window.localStorage.setItem("currentProject", JSON.stringify(name));
    this.props.changeProject(name, true);
    let defaultPath = "/app/edges";
    this.props.history.push(defaultPath);
  };

  render() {
    if (this.props.list) {
      this.state.count = this.props.list.length;
    }
    const { handleGoToManageUsers, handleDelete, list, session } = this.props;
    const { count, rowsPerPage, page, order, orderBy, selected, searchText } =
      this.state;

    let data = [];
    if (list && list.length) {
      let dataList = [];
      const found = list.find((p) => p.spec.default);
      if (found) {
        dataList = [found, ...list.filter((p) => !p.spec.default)];
      } else {
        dataList = [...list];
      }
      if (dataList && dataList.length > this.state.rowsPerPage) {
        const startIndex = this.state.rowsPerPage * this.state.page;
        const endIndex = startIndex + this.state.rowsPerPage;
        data = dataList.slice(startIndex, endIndex);
      } else {
        data = dataList;
      }
    }

    return (
      <Paper>
        <TableToolbar
          numSelected={selected.length}
          handleCreateClick={this.props.handleCreateClick}
          session={session}
        />
        <div className="flex-auto">
          <div className="table-responsive-material">
            <Table className="" size="small">
              <DataTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {data.map((n, index) => (
                  <TableRow hover key={index}>
                    <TableCell
                      id={`${index}_name`}
                      onClick={(event) => handleGoToManageUsers(event, n)}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="text-teal">{n.metadata.name}</span>
                    </TableCell>
                    <TableCell id={`${index}_Actions`} className="text-right">
                      <Button
                        color="primary"
                        size="small"
                        variant="outlined"
                        className="mr-4"
                        endIcon={<TrendingFlatIcon />}
                        onClick={(_) =>
                          this.handleGoToProjectClick(n.metadata.name)
                        }
                      >
                        Go to project
                      </Button>
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label="edit"
                          className="m-0"
                          onClick={(event) => handleGoToManageUsers(event, n)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <RafayDelete
                        key={index}
                        button={{
                          type: "danger-icon",
                          label: "Delete",
                          disabled: n.spec.default,
                          confirmText: (
                            <span>
                              <span>Are you sure you want to delete </span>
                              <span
                                style={{ fontWeight: 500, fontSize: "16px" }}
                              >
                                {n.metadata.name}
                              </span>
                              <span> ?</span>
                            </span>
                          ),
                          handleClick: () => handleDelete(n.metadata.name),
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    count={count}
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
      </Paper>
    );
  }
}

export default ProjectsTable;
