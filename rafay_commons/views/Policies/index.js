import React, { useState, createContext } from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { Switch, Route } from "react-router-dom";
import * as R from "ramda";

import { makePspSettingSpec } from "./policies-utils";
import Spinner from "../../components/Spinner";
import useThunk from "../../utils/useThunk";
import PolicyList from "./PolicyList";
import CreatePolicyDialog from "./CreatePolicyDialog";
import EditPolicyDialog from "./EditPolicyDialog";
import DeletePolicyDialog from "./DeletePolicyDialog";
import { useSnack } from "../../utils/useSnack";
import Banner from "../../components/Banner";
import PoliciesContext from "./PoliciesContext";

const CUSTOM_PSP_DISABLED_MESSAGE =
  "Ask your partner admin to enable custom PSPs for this organization to manage PSPs.";

const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.warning.main,
    marginBottom: theme.spacing(2)
  },
  subtitle: {
    color: theme.palette.text.secondary,
    fontStyle: "italic",
    marginBottom: theme.spacing(2)
  },
  spinnerInner: {
    top: theme.spacing(8)
  },
  banner: {
    marginBottom: theme.spacing(2)
  }
}));

function Title() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h5" className={classes.title}>
        Pod Security Policies
      </Typography>
      <Typography variant="body2" className={classes.subtitle}>
        Pod Security Policies (PSPs) provide a framework to ensure that pods and
        containers run only with the appropriate privileges and access only a
        finite set of resources. PSP is an admission controller resource you
        create that validates requests to create and update pods on your
        cluster.
      </Typography>
    </React.Fragment>
  );
}

export default function Policies({
  match,
  history,
  actions,
  selector,
  selectorType,
  customPspsEnabled = true
}) {
  const { id: selectorID } = R.defaultTo({}, selector);
  const isOrg = selectorType === "organization";

  if (!selectorID) return null;

  const classes = useStyles();
  const { showSnack } = useSnack();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [pspName, setPspName] = useState(null);
  const { loading, data, refresh: refreshPolicyList } = useThunk({
    thunk: actions.read,
    args: [selectorID],
    initialData: [],
    handleResolution: R.propOr([], "items")
  });

  const makePath = path => `${match.url}/${path}`;
  const toggleCreateDialog = open => () => setOpenCreateDialog(open);
  const toggleDeleteDialog = open => name => () => {
    setOpenDeleteDialog(open);
    setPspName(open && name ? name : null);
  };
  const setDefault = name => () => {
    actions
      .settings(selectorID, makePspSettingSpec(name, data))
      .then(refreshPolicyList)
      .catch(err => {
        showSnack(err.response?.data);
      });
  };

  return (
    <PoliciesContext.Provider value={{ actions, selectorID }}>
      <Spinner
        hideChildren
        loading={loading && !data.length}
        classes={{ spinnerInner: classes.spinnerInner }}
      >
        <Switch>
          <Route exact path={makePath("")}>
            <Box p={3}>
              <Title />
              {isOrg && !customPspsEnabled && (
                <Banner
                  severity="info"
                  closeable={false}
                  message={CUSTOM_PSP_DISABLED_MESSAGE}
                  classes={{ root: classes.banner }}
                />
              )}
              <PolicyList
                loading={loading}
                data={data}
                setDefault={setDefault}
                openCreateDialog={toggleCreateDialog(true)}
                openDeleteDialog={toggleDeleteDialog(true)}
                disableManagement={isOrg && !customPspsEnabled}
                history={history}
              />
              <CreatePolicyDialog
                open={openCreateDialog}
                data={data}
                onClose={toggleCreateDialog(false)}
                refreshPolicyList={refreshPolicyList}
                history={history}
              />
              <DeletePolicyDialog
                open={openDeleteDialog}
                pspName={pspName}
                onClose={toggleDeleteDialog(false)(null)}
                refreshPolicyList={refreshPolicyList}
              />
            </Box>
          </Route>
          <Route
            path={makePath("view/:name")}
            render={props => {
              return (
                <EditPolicyDialog
                  {...props}
                  readOnly
                  data={data}
                  refreshPolicyList={refreshPolicyList}
                />
              );
            }}
          />
          {customPspsEnabled && (
            <Route
              path={makePath("edit/:name")}
              render={props => {
                return (
                  <EditPolicyDialog
                    {...props}
                    data={data}
                    refreshPolicyList={refreshPolicyList}
                  />
                );
              }}
            />
          )}
        </Switch>
      </Spinner>
    </PoliciesContext.Provider>
  );
}
