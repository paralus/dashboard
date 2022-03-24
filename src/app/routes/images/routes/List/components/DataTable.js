import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Typography,
  Divider,
  Button,
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";

import Delete from "@material-ui/icons/Delete";

import DataTableHead from "./DataTableHead";

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "asc",
      orderBy: "name",
      selected: [],
      data: [],
      page: 0,
      offset: 0,
      count: 5,
      rowsPerPage: 5,
      searchText: "",
      expanded: null,
      imageTagsContainer: {},
      viewExpanded: {},
      warningDeleteDialog: {
        open: false,
        image: "",
        tag: "",
      },
    };
  }

  UNSAFE_componentWillMount() {
    this.props.pullImages(this.props.currentProject.id);
  }

  UNSAFE_componentWillReceiveProps(props) {
    const { count } = this.state;
    if (this.props.list) {
      const count1 = this.props.list.count;
      if (count1 !== count) {
        this.setState({ count: count1 });
      }
    }

    if (props.tag_list) {
      this.state.imageTagsContainer[props.tag_list.name] = props.tag_list;
      this.setState({ ...this.state });
    }
  }

  handleChange = (panel) => (event, expanded) => {
    console.log(event, expanded);
    this.state.viewExpanded[panel] = expanded;

    if (expanded) {
      this.props.pullImageTags(panel, this.props.currentProject.id);
    }
    this.setState({
      ...this.state,
      expanded: expanded ? panel : false,
    });
  };

  handleChangePage = (event, page) => {
    const offset = Math.abs(page * this.state.rowsPerPage);
    this.setState({ page, offset });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, offset: 0, page: 0 });
  };

  handleRequestSort = (event, property) => {
    // const orderBy = property;
    // let order = 'desc';
    // if (this.state.orderBy === property && this.state.order === 'desc') {
    //     order = 'asc';
    // }
    // const { rowsPerPage, offset, searchText } = this.state;
    // this.setState({ order, orderBy });
  };

  pullImageTags = (event, image) => {
    event.preventDefault();
    this.props.pullImageTags(image, this.props.currentProject.id);
  };

  handleDeleteImage = (image, tag) => {
    this.setState({
      ...this.state,
      warningDeleteDialog: {
        open: true,
        image,
        tag,
      },
    });
  };

  deleteImage = (image, tag) => {
    // console.log("delete image", image, tag);
    this.props.deleteImage(image, tag, this.props.currentProject.id);
    this.setState({
      ...this.state,
      warningDeleteDialog: {
        open: false,
        image: "",
        tag: "",
      },
    });
  };

  highlightImageName = (image) => {
    const org = image.substring(0, image.lastIndexOf("/") + 1);
    const name = image.substring(image.lastIndexOf("/") + 1);
    return (
      <span>
        {org}
        <span style={{ fontWeight: "500" }}>{name}</span>
      </span>
    );
  };

  render() {
    const { order, orderBy, selected } = this.state;
    const { classes } = this.props;
    let data = [];
    if (this.props.list) {
      data = this.props.list;
    }

    return (
      <Paper>
        <div className="flex-auto">
          <div className="table-responsive-material">
            <Table className="">
              <DataTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {data.map((n, index) => (
                  <TableRow hover key={n}>
                    <TableCell
                      id={n}
                      style={{
                        verticalAlign: "top",
                        paddingTop: "14px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: "300",
                        }}
                      >
                        {this.highlightImageName(n)}
                      </span>
                    </TableCell>
                    <TableCell id={`${n}_tags`} style={{ padding: "0px" }}>
                      <ExpansionPanel
                        style={{
                          boxShadow: "none",
                          background: "transparent",
                        }}
                        expanded={this.state.viewExpanded[n]}
                        onChange={this.handleChange(n)}
                      >
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography className={classes.heading}>
                            <span
                              style={{
                                color: "teal",
                                cursor: "pointer",
                              }}
                            >
                              View tags
                            </span>
                          </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className="p-2">
                          <List>
                            {this.state.imageTagsContainer[n] &&
                              this.state.imageTagsContainer[n].error && (
                                <div>
                                  <i
                                    className="zmdi zmdi-alert-circle-o zmdi-hc-lg"
                                    style={{
                                      marginRight: "10px",
                                      color: "#ff9800",
                                    }}
                                  />
                                  <span>
                                    {this.state.imageTagsContainer[n].error}
                                  </span>
                                </div>
                              )}
                            {this.state.imageTagsContainer[n] &&
                              this.state.imageTagsContainer[n].tags ===
                                null && (
                                <div>
                                  <i
                                    className="zmdi zmdi-alert-circle-o zmdi-hc-lg"
                                    style={{
                                      marginRight: "10px",
                                      color: "#ff9800",
                                    }}
                                  />
                                  <span>
                                    All tags removed. Image marked for deletion.
                                  </span>
                                </div>
                              )}
                            {this.state.imageTagsContainer[n] &&
                              this.state.imageTagsContainer[n].tags &&
                              this.state.imageTagsContainer[n].tags.map(
                                (tag, index) => (
                                  <div key={index}>
                                    <ListItem
                                      button
                                      className="pl-3 pr-3 pt-1 pb-1"
                                      style={{
                                        cursor: "initial",
                                      }}
                                    >
                                      <ListItemText primary={tag} />
                                      <Delete
                                        onClick={() =>
                                          this.handleDeleteImage(n, tag)
                                        }
                                        style={{
                                          marginTop: "0px",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </ListItem>
                                    {index !==
                                      this.state.imageTagsContainer[n].tags
                                        .length -
                                        1 && <Divider light />}
                                  </div>
                                )
                              )}
                          </List>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog
              open={this.state.warningDeleteDialog.open}
              onClose={(event) =>
                this.setState({ WarningCompDialogOpen: false })
              }
            >
              <DialogContent>
                <div
                  style={{
                    fontWeight: "500",
                    fontSize: "16px",
                    paddingBottom: "20px",
                  }}
                >
                  {this.state.warningDeleteDialog.image}:
                  {this.state.warningDeleteDialog.tag}
                </div>
                <div>
                  Are you sure you want to delete the image? All tags associated
                  with this image will be removed.
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={(event) =>
                    this.setState({
                      warningDeleteDialog: {
                        open: false,
                        image: "",
                        tag: "",
                      },
                    })
                  }
                  color="primary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    this.deleteImage(
                      this.state.warningDeleteDialog.image,
                      this.state.warningDeleteDialog.tag
                    )
                  }
                  color="accent"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(DataTable);
