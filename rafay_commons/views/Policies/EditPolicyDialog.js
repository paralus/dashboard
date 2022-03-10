import React, { useContext } from "react";
import * as R from "ramda";
import {
  makeStyles,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link
} from "@material-ui/core";
import { Formik, Form } from "formik";

import {
  FTextField,
  FCheckboxField,
  FMinMaxField,
  FSelectMinMaxField,
  FMultiTextField,
  FSelectTextField,
  FAutocompleteField
} from "../../components/FormikBindings";
import {
  convertPspToFormValues,
  convertFormValuesToPsp,
  validatePspSchema
} from "./policies-utils";
import PoliciesContext from "./PoliciesContext";
import RButton from "../../components/RButton";
import FieldCard from "../../components/FieldCard";
import useFullWidth from "../../utils/useFullWidth";
import { useSnack } from "../../utils/useSnack";
import Banner from "../../components/Banner";

const VALIDATION_CONFIG = {
  hostPorts: {
    min: 0,
    max: 65535
  }
};

const EDITING_WARNING =
  "Updating and republishing PSPs might impact existing applications in unintended ways.";

const VOLUMES = [
  "azureFile",
  "azureDisk",
  "flocker",
  "flexVolume",
  "hostPath",
  "emptyDir",
  "gcePersistentDisk",
  "awsElasticBlockStore",
  "gitRepo",
  "secret",
  "nfs",
  "iscsi",
  "glusterfs",
  "persistentVolumeClaim",
  "rbd",
  "cinder",
  "cephFS",
  "downwardAPI",
  "fc",
  "configMap",
  "vsphereVolume",
  "quobyte",
  "photonPersistentDisk",
  "projected",
  "portworxVolume",
  "scaleIO",
  "storageos",
  "*"
];

const CAPABILITIES = [
  "AUDIT_CONTROL",
  "AUDIT_WRITE",
  "BLOCK_SUSPEND",
  "CHOWN",
  "DAC_OVERRIDE",
  "DAC_READ_SEARCH",
  "FOWNER",
  "FSETID",
  "IPC_LOCK",
  "IPC_OWNER",
  "KILL",
  "LEASE",
  "LINUX_IMMUTABLE",
  "MAC_ADMIN",
  "MAC_OVERRIDE",
  "MKNOD",
  "NET_ADMIN",
  "NET_BIND_SERVICE",
  "NET_BROADCAST",
  "NET_RAW",
  "SETFCAP",
  "SETGID",
  "SETPCAP",
  "SETUID",
  "SYSLOG",
  "SYS_ADMIN",
  "SYS_BOOT",
  "SYS_CHROOT",
  "SYS_MODULE",
  "SYS_NICE",
  "SYS_PACCT",
  "SYS_PTRACE",
  "SYS_RAWIO",
  "SYS_RESOURCE",
  "SYS_TIME",
  "SYS_TTY_CONFIG",
  "WAKE_ALARM"
];

const oneOfDefault = R.anyPass([
  R.equals("rafay-privileged-psp"),
  R.equals("rafay-restricted-psp")
]);

const useStyles = makeStyles(theme => ({
  chip: {
    borderRadius: 2,
    userSelect: "none"
  },
  search: {
    width: 350
  },
  actionBtn: {
    marginRight: theme.spacing(1),
    "&:last-child": {
      marginRight: "unset"
    }
  },
  iconBtn: {
    padding: 8,
    marginRight: theme.spacing(1)
  },
  section: {
    padding: theme.spacing(2)
  },
  sectionTitle: {
    marginBottom: theme.spacing(2)
  },
  sectionField: {
    marginBottom: theme.spacing(1.5),
    "&:last-child": {
      marginBottom: "unset"
    }
  },
  checkboxLabelPlacementStart: {
    marginLeft: 0,
    marginRight: 0,
    display: "flex"
  },
  checkboxLabel: {
    flex: 1
  },
  helperText: {
    marginLeft: theme.spacing(3)
  },
  stickyNav: {
    top: 24,
    position: "sticky"
  },
  appBar: {
    bottom: 0,
    position: "fixed",
    backgroundColor: "white",
    "& > div": {
      justifyContent: "flex-end"
    }
  },
  crumbNav: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    width: "calc(100% - 16px)"
  },
  breadcrumbs: {
    flex: 1
  },
  banner: {
    width: "calc(100% - 16px)",
    marginBottom: theme.spacing(2)
  }
}));

function HelperText({ text }) {
  return (
    <Typography variant="body2" color="textSecondary">
      {text}
    </Typography>
  );
}

const Section = React.forwardRef(({ id, title, children }, ref) => {
  const classes = useStyles();

  return (
    <Grid ref={ref} item xs={12} id={id}>
      <Paper className={classes.section}>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          className={classes.sectionTitle}
        >
          {title}
        </Typography>
        <Box>{children}</Box>
      </Paper>
    </Grid>
  );
});

function SectionField({ children, helperText }) {
  const classes = useStyles();

  return (
    <Grid container alignItems="center" className={classes.sectionField}>
      <Grid item xs={5}>
        {children}
      </Grid>
      <Grid item xs={7}>
        <div className={classes.helperText}>
          {typeof helperText === "string" ? (
            <HelperText text={helperText} />
          ) : (
            helperText
          )}
        </div>
      </Grid>
    </Grid>
  );
}

function PolicyBreadcrumbs({ current, readOnly, allowEdit, history }) {
  const classes = useStyles();

  return (
    <Box className={classes.crumbNav}>
      <Breadcrumbs separator="›" className={classes.breadcrumbs}>
        <Link color="inherit" href="#/app/policies">
          Policies
        </Link>
        <Typography color="textPrimary">{current}</Typography>
      </Breadcrumbs>
      {readOnly && allowEdit && (
        <RButton
          disableElevation
          color="primary"
          variant="contained"
          onClick={() => history.push(`/app/policies/edit/${current}`)}
        >
          Edit
        </RButton>
      )}
    </Box>
  );
}

export default function EditPolicyDialog({
  match,
  history,
  data,
  refreshPolicyList,
  readOnly: _readOnly
}) {
  const classes = useStyles();
  const { showSnack } = useSnack();
  const { actions, selectorID } = useContext(PoliciesContext);
  const isOneOfDefault = oneOfDefault(match.params.name);
  const footerWidth = useFullWidth();
  const readOnly = !!_readOnly || isOneOfDefault;

  const labelClasses = {
    label: classes.checkboxLabel,
    labelPlacementStart: classes.checkboxLabelPlacementStart
  };
  const currentPsp = R.find(
    R.pathEq(["metadata", "name"], match.params.name),
    data
  );
  const sectionIDs = [
    "general",
    "namespaces",
    "volumes-and-file-systems",
    "users-and-groups",
    "selinux",
    "capabilities"
  ];
  const refs = sectionIDs.reduce((acc, id) => {
    return { ...acc, [id]: React.createRef() };
  }, {});

  const handleNavClick = id => () => {
    refs[id].current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  // If PSP not found in data, return to listing view.
  if (!currentPsp) {
    history.push("/app/policies");
    return null;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={convertPspToFormValues(currentPsp)}
      onSubmit={(values, formik) => {
        return actions
          .update(
            selectorID,
            match.params.name,
            convertFormValuesToPsp(currentPsp, values)
          )
          .then(() => {
            formik.setSubmitting(false);
            history.push("/app/policies");
          })
          .then(refreshPolicyList)
          .catch(err => {
            let errText = err.message;
            if (typeof err.response?.data === "string") {
              errText = err.response?.data;
            }
            showSnack(errText);
            console.error(err);
            formik.setSubmitting(false);
          });
      }}
      validationSchema={validatePspSchema(VALIDATION_CONFIG)}
    >
      {({ values, isSubmitting, isValid }) => {
        return (
          <Form>
            <Box p={3} pb={5}>
              <PolicyBreadcrumbs
                history={history}
                current={match.params.name}
                readOnly={readOnly}
                allowEdit={!isOneOfDefault}
              />
              <Banner
                severity="warning"
                title="Warning"
                message={EDITING_WARNING}
                classes={{ root: classes.banner }}
              />
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Paper className={classes.stickyNav}>
                    <List component="nav">
                      <ListItem button onClick={handleNavClick("general")}>
                        <ListItemText primary="General" />
                      </ListItem>
                      <ListItem button onClick={handleNavClick("namespaces")}>
                        <ListItemText primary="Host Namespaces" />
                      </ListItem>
                      <ListItem
                        button
                        onClick={handleNavClick("volumes-and-file-systems")}
                      >
                        <ListItemText primary="Volumes & File Systems" />
                      </ListItem>
                      <ListItem
                        button
                        onClick={handleNavClick("users-and-groups")}
                      >
                        <ListItemText primary="Users & Groups" />
                      </ListItem>
                      <ListItem button onClick={handleNavClick("selinux")}>
                        <ListItemText primary="SELinux" />
                      </ListItem>
                      <ListItem button onClick={handleNavClick("capabilities")}>
                        <ListItemText primary="Capabilities" />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
                <Grid item container xs={9} spacing={2}>
                  <Section ref={refs.general} title="General">
                    <SectionField>
                      <FTextField disabled fullWidth name="name" label="Name" />
                    </SectionField>
                    <SectionField helperText="Running of privileged containers">
                      <FCheckboxField
                        fullWidth
                        disabled={readOnly}
                        name="privileged"
                        label="Privileged"
                        labelPlacement="start"
                        classes={labelClasses}
                      />
                    </SectionField>
                    <SectionField helperText="Running of a container that allow privilege escalation from its parent">
                      <FCheckboxField
                        fullWidth
                        disabled={readOnly}
                        name="allowPrivilegeEscalation"
                        label="Allow Privilege Escalation"
                        labelPlacement="start"
                        classes={labelClasses}
                      />
                    </SectionField>
                    <SectionField helperText="Control whether a process can gain more privileges than its parent process">
                      <FCheckboxField
                        fullWidth
                        disabled={readOnly}
                        name="defaultAllowPrivilegeEscalation"
                        label="Default Allow Privilege Escalation"
                        labelPlacement="start"
                        classes={labelClasses}
                      />
                    </SectionField>
                  </Section>

                  <Section ref={refs.namespaces} title="Host Namespaces">
                    <SectionField helperText="Use of host's PID namespace">
                      <FCheckboxField
                        fullWidth
                        disabled={readOnly}
                        name="hostPID"
                        label="Host PID"
                        labelPlacement="start"
                        classes={labelClasses}
                      />
                    </SectionField>
                    <SectionField helperText="Use of host's IPC namespace">
                      <FCheckboxField
                        fullWidth
                        disabled={readOnly}
                        name="hostIPC"
                        label="Host IPC"
                        labelPlacement="start"
                        classes={labelClasses}
                      />
                    </SectionField>
                    <SectionField helperText="Use of host networking">
                      <FCheckboxField
                        fullWidth
                        disabled={readOnly}
                        name="hostNetwork"
                        label="Host Network"
                        labelPlacement="start"
                        classes={labelClasses}
                      />
                    </SectionField>
                    <SectionField helperText="Use of host ports">
                      <FieldCard title="Host Ports" disabled={readOnly}>
                        <FMinMaxField
                          disabled={readOnly}
                          name="hostPorts"
                          defaultMax={VALIDATION_CONFIG.hostPorts.max}
                        />
                      </FieldCard>
                    </SectionField>
                  </Section>

                  <Section
                    ref={refs["volumes-and-file-systems"]}
                    title="Volumes & File Systems"
                  >
                    <SectionField helperText="Control the usage of volume types">
                      <FAutocompleteField
                        fullWidth
                        multiple
                        disabled={readOnly}
                        name="volumes"
                        label="Volumes"
                        options={VOLUMES}
                      />
                    </SectionField>
                    <SectionField helperText="Requiring the use of a read only root file system">
                      <FCheckboxField
                        fullWidth
                        disabled={readOnly}
                        name="readOnlyRootFilesystem"
                        label="Read Only Root Filesystem"
                        labelPlacement="start"
                        classes={labelClasses}
                      />
                    </SectionField>
                    {values.volumes.includes("flexVolume") && (
                      <SectionField helperText="Whitelist of allowed flex volumes">
                        <FieldCard
                          title="Allowed Flex Volumes"
                          disabled={readOnly}
                        >
                          <FMultiTextField
                            fullWidth
                            disabled={readOnly}
                            name="allowedFlexVolumes"
                            itemName="driver"
                            defaultPlaceholder="example/lvm"
                          />
                        </FieldCard>
                      </SectionField>
                    )}
                    <SectionField
                      helperText={
                        values.fsGroup.rule === "MustRunAs"
                          ? "Requires at least one range to be specified. Uses the minimum value of the first range as the default. Validates against the first ID in the first range."
                          : values.fsGroup.rule === "MayRunAs"
                          ? "Requires at least one range to be specified. Allows FSGroups to be left unset without providing a default. Validates against all ranges if FSGroups is set."
                          : "No default provided. Allows any fsGroup ID to be specified."
                      }
                    >
                      <FieldCard title="FS Group" disabled={readOnly}>
                        <FSelectMinMaxField
                          fullWidth
                          disabled={readOnly}
                          name="fsGroup"
                          selectProps={{
                            name: "rule",
                            options: ["MustRunAs", "MayRunAs", "RunAsAny"],
                            fullWidth: true
                          }}
                          rangeName="ranges"
                          showRangeWhen={({ rule }) => rule !== "RunAsAny"}
                        />
                      </FieldCard>
                    </SectionField>
                    <SectionField helperText="Whitelist of allowed host paths">
                      <FieldCard title="Allowed Host Paths" disabled={readOnly}>
                        <FMultiTextField
                          fullWidth
                          disabled={readOnly}
                          name="allowedHostPaths"
                          itemName="pathPrefix"
                          defaultPlaceholder="/foo"
                        />
                      </FieldCard>
                    </SectionField>
                  </Section>

                  <Section
                    ref={refs["users-and-groups"]}
                    title="Users & Groups"
                  >
                    <SectionField
                      helperText={
                        values.runAsUser.rule === "MustRunAs"
                          ? "Requires a range to be configured. Uses the first value of the range as the default. Validates against the configured range."
                          : values.runAsUser.rule === "MustRunAsNonRoot"
                          ? "Requires that the pod be submitted with a non-zero runAsUser or have the USER directive defined in the image. No default provided."
                          : "No default provided. Allows any runAsUser to be specified."
                      }
                    >
                      <FieldCard title="Run As User" disabled={readOnly}>
                        <FSelectMinMaxField
                          fullWidth
                          disabled={readOnly}
                          name="runAsUser"
                          selectProps={{
                            name: "rule",
                            options: [
                              "MustRunAs",
                              "MustRunAsNonRoot",
                              "RunAsAny"
                            ],
                            fullWidth: true
                          }}
                          rangeName="ranges"
                          defaultMin={1}
                          defaultMax={6}
                          showRangeWhen={({ rule }) => rule === "MustRunAs"}
                        />
                      </FieldCard>
                    </SectionField>
                    <SectionField
                      helperText={
                        values.runAsGroup.rule === "MustRunAs"
                          ? "Requires at least one range to be specified. Uses the minimum value of the first range as the default. Validates against all ranges."
                          : values.runAsGroup.rule === "MayRunAs"
                          ? "Does not require that RunAsGroup be specified. However, when RunAsGroup is specified, they have to fall in the defined range."
                          : "No default provided. Allows any runAsGroup to be specified."
                      }
                    >
                      <FieldCard title="Run As Group" disabled={readOnly}>
                        <FSelectMinMaxField
                          fullWidth
                          disabled={readOnly}
                          name="runAsGroup"
                          selectProps={{
                            name: "rule",
                            options: ["MustRunAs", "MayRunAs", "RunAsAny"],
                            fullWidth: true
                          }}
                          rangeName="ranges"
                          defaultMin={1}
                          defaultMax={6}
                          showRangeWhen={({ rule }) => rule !== "RunAsAny"}
                        />
                      </FieldCard>
                    </SectionField>
                    <SectionField
                      helperText={
                        values.supplementalGroups.rule === "MustRunAs"
                          ? "Requires at least one range to be specified. Uses the minimum value of the first range as the default. Validates against all ranges."
                          : values.supplementalGroups.rule === "MayRunAs"
                          ? "Requires at least one range to be specified. Allows supplementalGroups to be left unset without providing a default. Validates against all ranges if supplementalGroups is set."
                          : "No default provided. Allows any supplementalGroups to be specified."
                      }
                    >
                      <FieldCard
                        title="Supplemental Groups"
                        disabled={readOnly}
                      >
                        <FSelectMinMaxField
                          fullWidth
                          disabled={readOnly}
                          name="supplementalGroups"
                          selectProps={{
                            name: "rule",
                            options: ["MustRunAs", "MayRunAs", "RunAsAny"],
                            fullWidth: true
                          }}
                          rangeName="ranges"
                          defaultMax={6}
                          showRangeWhen={({ rule }) => rule !== "RunAsAny"}
                        />
                      </FieldCard>
                    </SectionField>
                  </Section>

                  <Section ref={refs["selinux"]} title="SELinux">
                    <SectionField
                      helperText={
                        values.seLinux.rule === "MustRunAs"
                          ? "Uses seLinuxOptions as the default. Validates against seLinuxOptions."
                          : "Allows any seLinuxOptions to be specified."
                      }
                    >
                      <FSelectTextField
                        fullWidth
                        disabled={readOnly}
                        name="seLinux"
                        selectProps={{
                          name: "rule",
                          options: ["MustRunAs", "RunAsAny"],
                          fullWidth: true
                        }}
                        showWhen={({ rule }) => rule === "MustRunAs"}
                        fields={[
                          { label: "Level", name: "seLinuxOptions.level" },
                          { label: "Role", name: "seLinuxOptions.role" },
                          { label: "User", name: "seLinuxOptions.user" }
                        ]}
                      />
                    </SectionField>
                  </Section>

                  <Section ref={refs.capabilities} title="Capabilities">
                    <SectionField>
                      <FAutocompleteField
                        multiple
                        fullWidth
                        disabled={readOnly}
                        name="allowedCapabilities"
                        label="Allowed Capabilities"
                        options={R.append("*", CAPABILITIES)}
                      />
                    </SectionField>
                    <SectionField>
                      <FAutocompleteField
                        multiple
                        fullWidth
                        disabled={readOnly}
                        name="defaultAddCapabilities"
                        label="Default Add Capabilities"
                        options={CAPABILITIES}
                      />
                    </SectionField>
                    <SectionField>
                      <FAutocompleteField
                        multiple
                        fullWidth
                        disabled={readOnly}
                        name="requiredDropCapabilities"
                        label="Required Drop Capabilities"
                        options={CAPABILITIES}
                      />
                    </SectionField>
                  </Section>
                </Grid>
              </Grid>
            </Box>
            {!readOnly && (
              <AppBar
                position="static"
                component="footer"
                className={classes.appBar}
                style={{ width: footerWidth }}
              >
                <Toolbar>
                  <RButton
                    className={classes.actionBtn}
                    onClick={() => history.push("/app/policies")}
                  >
                    Cancel
                  </RButton>
                  <RButton
                    type="submit"
                    className={classes.actionBtn}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || !isValid}
                  >
                    Save
                  </RButton>
                </Toolbar>
              </AppBar>
            )}
          </Form>
        );
      }}
    </Formik>
  );
}
