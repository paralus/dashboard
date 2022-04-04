import { Button, Grid, Menu, MenuItem, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowDownwardOutlined, CloseOutlined } from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { deleteIdentityProvider, getAllIdentityProviders } from "actions/IDPs";
import DataGrid from "components/DataGrid/DataGrid";
import React, { useEffect, useState } from "react";
import { downloadCertificate } from "./util";

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main
    },
    cursor: "pointer"
  },

  toolbar: theme.mixins.toolbar,
  highLightUrl: {
    backgroundColor: "#f8f8f8",
    border: "1px solid #cccccc",
    fontSize: "13px",
    lineHeight: "19px",
    overflow: "auto",
    padding: "6px 10px",
    borderRadius: "3px"
  }
}));

function IDPRegistration(props) {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [idpDetail, setIdpDetail] = useState({ organization: {}, partner: {} });
  const [tableData, setTableData] = useState([]);
  const [deleteInfo, setDeleteInfo] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewDetail, setViewDetail] = useState(false);

  const open = Boolean(anchorEl);

  const [openDialog, setOpenDialog] = useState(false);

  function handleClick(event, rowData) {
    setAnchorEl(event.currentTarget);
    setIdpDetail(rowData);
    setDeleteInfo({ deleteId: rowData.id, deleteName: rowData.name });
  }

  function handleClose() {
    setIdpDetail({ organization: {}, partner: {} });
    setDeleteInfo({ deleteId: undefined, deleteName: "" });
    setAnchorEl(null);
  }

  function fetchIDPRegistrations() {
    handleClose();
    setLoading(true);
    getAllIdentityProviders()
      .then(response => {
        setLoading(false);
        console.log("IDPS", response);
        setTableData(response.data.items);
      })
      .catch(error => setLoading(false));
  }

  useEffect(() => {
    fetchIDPRegistrations();
  }, []);

  function enableEditMode() {
    setAnchorEl(null);

    props.history.push({
      pathname: `/main/sso/update/${idpDetail.id}`,
      state: idpDetail
    });
  }

  function deleteIDPRegistration(idpId) {
    setAnchorEl(null);
    setLoading(true);
    setOpenDialog(false);
    deleteIdentityProvider(idpId)
      .then(response => {
        fetchIDPRegistrations();
        // setOpen(undefined);
        setDeleteInfo({});
        setLoading(false);
      })
      .catch(error => setLoading(false));
  }

  function openDetail(idpDetail) {
    setIdpDetail(idpDetail);
    setViewDetail(true);
  }

  function closeDeleteDialog() {
    setOpenDialog(false);
    setDeleteInfo({ deleteId: undefined, deleteName: "" });
  }

  function RenderDetailRow({ name, property, isCode }) {
    return (
      <>
        {property ? (
          <Grid
            className="px-4 py-2"
            container
            direction="row"
            justify="flex-start"
            alignItems="baseline"
          >
            <Grid item xs={4}>
              <Typography variant="subtitle2">{name}</Typography>
            </Grid>
            <Grid item xs={6}>
              {isCode ? (
                <code>{property}</code>
              ) : (
                <Typography variant="body2">{property}</Typography>
              )}
            </Grid>
          </Grid>
        ) : null}
      </>
    );
  }

  return (
    <div className="px-4 py-4">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="p-0" style={{ marginBottom: "20px", color: "#ff9800" }}>
          IDPs
        </h1>

        <Button
          onClick={() => {
            props.history.push("/main/sso/new");
          }}
          variant="contained"
          className="jr-btn jr-btn-label left text-nowrap text-white my-2"
          style={{ marginRight: "15px" }}
          color="primary"
        >
          <i className="zmdi zmdi-plus zmdi-hc-fw " />
          <span> New IDP</span>
        </Button>
      </div>

      <div>
        <>
          <DataGrid
            element={
              <h1
                className="p-0"
                style={{ marginBottom: "20px", color: "#ff9800" }}
              >
                New IDP
              </h1>
            }
            loading={loading}
            data={tableData}
            columns={[
              {
                label: "Name",
                dataKey: "name",
                render: ({ rowData }) => (
                  <span
                    onClick={() => openDetail(rowData)}
                    className={classes.link}
                  >
                    {rowData.name}
                  </span>
                )
              },

              {
                label: "Domain",
                dataKey: "domain"
              },
              {
                label: "Group Attribute Name",
                dataKey: "group_attribute_name"
              },

              {
                label: "Certficate Enabled",
                dataKey: "is_sae_enabled",
                render: ({ rowData }) =>
                  rowData.is_sae_enabled ? "Enabled" : "Disabled"
              },
              {
                label: "Actions",
                dataKey: "action",
                render: ({ rowData }) => {
                  return (
                    <div>
                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={event => handleClick(event, rowData)}
                      >
                        <MoreVertIcon />
                      </IconButton>

                      <Menu
                        elevation={2}
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            maxHeight: 40 * 4.5,
                            width: 170
                          }
                        }}
                      >
                        <MenuItem onClick={() => enableEditMode()} key="edit">
                          Edit
                        </MenuItem>
                        <MenuItem
                          key="delete"
                          onClick={() => setOpenDialog(true)}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </div>
                  );
                }
              }
            ]}
          />
        </>
      </div>

      <Dialog
        open={openDialog}
        onClose={() => closeDeleteDialog()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete{" "}
            <span style={{ color: "teal" }}>{deleteInfo.deleteName}</span> Idp ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} autoFocus>
            CANCEL
          </Button>
          <Button onClick={() => deleteIDPRegistration(deleteInfo.deleteId)}>
            YES
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth="md"
        open={viewDetail}
        onClose={() => setViewDetail(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography className="px-4" variant="h6">
            Registration Details
          </Typography>
          <IconButton onClick={() => setViewDetail(false)}>
            <CloseOutlined />
          </IconButton>
        </div>

        <DialogContent>
          <RenderDetailRow name="Name" property={idpDetail.name} />
          <RenderDetailRow name="IDP Name" property={idpDetail.idp_name} />
          <RenderDetailRow name="Domain" property={idpDetail.domain} />
          <RenderDetailRow
            name="Access Url"
            property={idpDetail.acs_url}
            isCode
          />
          <RenderDetailRow
            name="MetaData Url"
            property={idpDetail.metadata_url}
            isCode
          />

          {idpDetail.sp_cert ? (
            <Grid
              className="px-4 pt-2"
              container
              direction="row"
              justify="flex-start"
              alignItems="baseline"
            >
              <Grid item xs={4}>
                <Typography variant="subtitle2">SP Certificate</Typography>
              </Grid>
              <Grid item xs={6}>
                <b>
                  <Button
                    color="primary"
                    endIcon={<ArrowDownwardOutlined />}
                    onClick={() =>
                      downloadCertificate(
                        idpDetail.scp_cert,
                        "okta-certificate.pem",
                        "text/plain"
                      )
                    }
                  >
                    Download
                  </Button>
                </b>
              </Grid>
            </Grid>
          ) : null}

          <RenderDetailRow
            name="Encrypted SAML Assertion"
            property={idpDetail.is_sae_enabled ? "Enabled" : "Disabled"}
          />

          <RenderDetailRow
            name="Grop Attribute Name"
            property={idpDetail.group_attribute_name}
          />

          <br />
          <br />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default IDPRegistration;
