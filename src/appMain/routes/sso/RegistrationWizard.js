import {
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  LinearProgress,
  Select,
  Switch,
  TextField,
  Paper,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Step,
  Stepper,
  Tooltip,
  StepLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import T from "i18n-react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { FileCopyOutlined, ArrowBack } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import {
  getServiceProviderConfig,
  uploadMetaDataFile,
  handleIdentityProviderSubmission,
} from "actions/IDPs";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafayWizard from "components/RafayWizard";
import { downloadCertificate } from "./util";
import UploadMetadata from "./UploadMetadata";

const SpConfigSchema = Yup.object().shape({
  name: Yup.string()
    .max(256, `Can't be longer than 256`)
    .required("Organization is required"),
  clientId: Yup.string()
    .max(256, `Can't be longer than 256`)
    .required("Client identifier is required"),
  clientSecret: Yup.string()
    .max(256, `Can't be longer than 256`)
    .required("Client secret is required"),
  providerName: Yup.string()
    .max(256, `Can't be longer than 256`)
    .required("Idp name is required"),
});

const R = require("ramda");

const MetaDataUrlSchema = Yup.object().shape({
  metadata_url: Yup.string()
    .matches(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Invalid link "
    )
    .max(300, `Can't be longer than 300`),
});

const idpModeConfig = {
  CREATE: {
    label: "Created",
  },
  UPDATE: {
    label: "Updated",
  },
};

const ignoreConfigList = [
  "group_attribute_name",
  "mapperUrl",
  "issuerUrl",
  "authUrl",
  "tokenUrl",
];

const ignoreConfigListUpdate = [
  "clientSecret",
  "group_attribute_name",
  "mapperUrl",
  "issuerUrl",
  "authUrl",
  "tokenUrl",
];

const CustomInput = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <div>
      <TextField
        helperText={
          touched[field.name] && errors[field.name] ? errors[field.name] : ""
        }
        error={!!touched[field.name] && !!errors[field.name]}
        {...field}
        {...props}
      />
    </div>
  );
};

const CustomSwitch = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  return (
    <div>
      <FormControlLabel
        style={{ width: 500 }}
        control={<Switch {...field} {...props} />}
        label="Encrypted SAML Assertion"
      />
    </div>
  );
};

const CustomSelect = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, //  values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const Field = { ...field, value: field?.value?.toLowerCase() };
  return (
    <div>
      <FormControl error={!!touched[field.name] && !!errors[field.name]}>
        <InputLabel id="select-label">IdP Type</InputLabel>
        <Select {...Field} {...props}>
          <MenuItem value="google">Google</MenuItem>
          <MenuItem value="facebook">Facebook</MenuItem>
          <MenuItem value="microsoft">Microsoft</MenuItem>
          <MenuItem value="github">Github</MenuItem>
          <MenuItem value="generic">Generic</MenuItem>
        </Select>
        <FormHelperText margin="dense">
          {touched[field.name] && errors[field.name] ? errors[field.name] : ""}
        </FormHelperText>
      </FormControl>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },

  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  highLightUrl: {
    backgroundColor: "#f8f8f8",
    border: "1px solid #cccccc",
    fontSize: "13px",
    lineHeight: "19px",
    overflow: "auto",
    padding: "6px 10px",
    borderRadius: "3px",
  },
  textField: {
    marginBottom: theme.spacing(2),
    minWidth: "500px",
  },
  spConfigLabel: {
    width: "350px",
  },
  urlCopy: {
    position: "relative",
    borderRadius: "3px",
    backgroundColor: "whitesmoke",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "grey",
    color: "black",
    paddingLeft: "15px",
    paddingRight: "15px",
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
}));

const RegistrationWizard = (props) => {
  const { editModeOn } = props;

  const firstStep = useRef();
  const secondStep = useRef();
  const classes = useStyles();

  const [idpPayload, setIdpPayload] = useState({});
  const [loading, setLoading] = useState(false);
  const [idpId, setIdpId] = useState(props.match.params.ssoId);

  const [idpResponse, setIdpResponse] = useState(
    props.location.state ? props.location.state : {}
  );
  const [activeStep, setActiveStep] = useState(0);

  const [redirect, setRedirect] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [certficiate, setCertificate] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [toolTip, setToolTip] = useState("Copy");

  const [spConfig, setSpConfig] = useState({});
  const [msg, setMsg] = useState("");
  const [type, setMetadataType] = useState("url");
  const [metadata_file, setMetaDataFile] = useState(null);

  useEffect(() => {
    if (idpId) {
      setEditMode(true);
    }

    if (R.has("update", props.match.path) && !props.location.state) {
      props.history.push("/main/sso");
    }
  }, []);

  function getSpConfig(idpId) {
    setLoading(true);
    getServiceProviderConfig(idpId)
      .then((response) => {
        setSpConfig(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setSpConfig({});
        setLoading(false);
      });
  }

  function checkIfValid(object) {
    for (const item of Object.entries(object)) {
      if (
        !editMode &&
        !ignoreConfigList.includes(item[0]) &&
        item[1] === undefined
      ) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    if (activeStep > 0 && !spConfig?.spec?.callbackUrl) {
      getSpConfig(idpId);
    }
  }, [activeStep]);

  function saveIdpDetails(payload, mode, skipNextStep) {
    setLoading(true);
    setIdpPayload(payload);
    handleIdentityProviderSubmission(payload, idpId, mode)
      .then((response) => {
        setIdpId(response.data.metadata.name);
        setIdpResponse(response.data);
        //setCertificate(response.data.sp_cert);
        setLoading(false);
        setMsg(`IdP ${idpModeConfig[mode].label} Successfully!`);
        if (skipNextStep) setRedirect(true);
        else setActiveStep((prevActiveStep) => prevActiveStep + 1);
      })
      .catch((error) => {
        setError(
          error.response.data
            ? error.response.data.message
            : "Unable to process request"
        );
        setLoading(false);
        setMsg("");
      });
  }

  function updateIDPWithMetaUrl(values) {
    setLoading(true);
    const payload = { ...idpPayload };
    payload.spec.callbackUrl = spConfig.spec.callbackUrl;
    payload.spec.issuerUrl = spConfig.spec.issuerUrl;
    payload.spec.authUrl = spConfig.spec.authUrl;
    payload.spec.tokenUrl = spConfig.spec.tokenUrl;

    payload.spec.mapperUrl = values.metadata_url || "";

    handleIdentityProviderSubmission(payload, idpId, "UPDATE")
      .then((response) => {
        setIsSuccess(true);
        setLoading(false);
        setRedirect(true);
        setTimeout(() => {}, 500);
      })
      .catch((error) => {
        setError(
          error.response.data
            ? error.response.data.message
            : "Unable to process request"
        );
        setLoading(false);
        setMsg("");
      });
  }

  const handleUPloadMetaDataFile = () => {
    uploadMetaDataFile(idpResponse?.id, {
      idp_metadata: metadata_file,
    })
      .then((response) => {
        setIsSuccess(true);
        setLoading(false);
        setRedirect(true);
      })
      .catch((error) => {
        setError(
          error.response.data && error.response.data.details.length
            ? error.response.data.details[0].detail
            : "Unable to process request"
        );
        setLoading(false);
        setMsg("");
      });
  };

  const handleSecondStepSubmit = () => {
    if (type === "upload") {
      handleUPloadMetaDataFile();
    } else if (secondStep.current) {
      secondStep.current.handleSubmit();
      if (checkIfValid(secondStep.current.values)) {
        updateIDPWithMetaUrl(secondStep.current.values);
      }
    }
  };

  const transformRequest = (data) => {
    let scope =
      editMode && data["group_attribute_name"]
        ? data["group_attribute_name"]
        : data["group_attribute_name"]
        ? data["group_attribute_name"].split(",").map((e) => e.trim())
        : [];
    let payload = {
      metadata: {
        name: data["name"],
      },
      spec: {
        providerName: data["providerName"],
        clientId: data["clientId"],
        clientSecret: data["clientSecret"],
        scopes: scope,
        issuerUrl: data["issuer_url"],
      },
    };
    return payload;
  };

  const handleSubmit = (skipNextStep) => {
    if (firstStep.current) {
      firstStep.current.handleSubmit();

      if (checkIfValid(firstStep.current.values)) {
        if (editMode || editModeOn) {
          saveIdpDetails(
            transformRequest(firstStep.current.values),
            "UPDATE",
            skipNextStep
          );
          return;
        }
        saveIdpDetails(
          transformRequest(firstStep.current.values),
          "CREATE",
          skipNextStep
        );
      }
    }
  };

  function getStepContent(step) {
    const classes = useStyles();
    let defaultValue = "";
    if (!defaultValue) {
      defaultValue = "url";
      if (
        props &&
        props.location &&
        props.location.state &&
        props.location.state.metadata_filename
      ) {
        defaultValue = "upload";
      }
    }

    useEffect(() => {
      if (
        props &&
        props.location &&
        props.location.state &&
        props.location.state.metadata_filename
      ) {
        setMetadataType("upload");
      }
    }, []);

    switch (step) {
      case 0:
        return (
          <Box p={3}>
            <Grid direction="row" justify="flex-start" alignItems="center">
              <Formik
                key="first"
                innerRef={firstStep}
                initialValues={{
                  name: idpResponse?.metadata?.name,
                  clientId: idpResponse?.spec?.clientId,
                  clientSecret: idpResponse?.spec?.clientSecret,
                  providerName: idpResponse?.spec?.providerName,
                  group_attribute_name: idpResponse?.spec?.scopes,
                  issuer_url: idpResponse?.spec?.issuerUrl,
                }}
                validationSchema={SpConfigSchema}
                render={({
                  submitForm,
                  isSubmitting,
                  values,
                  setFieldValue,
                  errors,
                  touched,
                }) => {
                  return (
                    <Form>
                      <div className="">
                        <div className="d-flex flex-row">
                          <Field
                            component={CustomInput}
                            className={classes.textField}
                            label="Name"
                            name="name"
                            size="medium"
                            required
                          />
                          <FormHelperText
                            focused
                            className="text-grey mt-4 ml-4"
                          >
                            Please add a unique name
                          </FormHelperText>
                        </div>

                        <div className="d-flex flex-row">
                          <Field
                            style={{ width: 500 }}
                            fullWidth
                            name="providerName"
                            required
                            component={CustomSelect}
                          />
                        </div>

                        <div className="d-flex flex-row mt-3">
                          <Field
                            name="clientId"
                            placeholder="6779ef20e75817b79602"
                            component={CustomInput}
                            className={classes.textField}
                            fullWidth
                            label="client identifier"
                            required
                          />
                          <FormHelperText
                            focused
                            className="text-grey mt-4 ml-4"
                          >
                            This is the client id generated from the respective
                            oauth provider
                          </FormHelperText>
                        </div>

                        <div className="d-flex flex-row mt-3">
                          <Field
                            name="clientSecret"
                            placeholder="6779ef20e75817b79602"
                            component={CustomInput}
                            className={classes.textField}
                            fullWidth
                            label="secret"
                            required
                            disabled={editMode}
                          />
                          <FormHelperText
                            focused
                            className="text-grey mt-4 ml-4"
                          >
                            This is the client secret generated from the
                            respective oauth provider
                          </FormHelperText>
                        </div>

                        <div className="d-flex flex-row mt-3">
                          <Field
                            name="group_attribute_name"
                            component={CustomInput}
                            className={classes.textField}
                            fullWidth
                            label="Scopes / Group Attribute Name"
                          />
                          <FormHelperText
                            focused
                            className="text-grey mt-4 ml-4"
                          >
                            Configure all the scopes including the optional
                            Group Attribute Name (comma seperated) which maps to
                            the group with assigned roles in the console
                          </FormHelperText>
                        </div>

                        <div className="d-flex flex-row mt-3">
                          <Field
                            name="issuer_url"
                            component={CustomInput}
                            className={classes.textField}
                            fullWidth
                            label="Issuer Url"
                            required
                          />
                          <FormHelperText
                            focused
                            className="text-grey mt-4 ml-4"
                          >
                            Configure the Issuer URL that corresponds to your
                            oidc provider.
                          </FormHelperText>
                        </div>
                      </div>
                    </Form>
                  );
                }}
              />
            </Grid>
          </Box>
        );
      case 1:
        return (
          <div className="p-4">
            <p className={classes.helpText}>
              Use the information below to create an application in your
              identity provider (IdP)
            </p>

            <div className="">
              <div className="d-flex flex-row">
                <div className={classes.spConfigLabel}>
                  <div className="pt-2">
                    <b>
                      <div>Callback URL</div>
                    </b>
                  </div>
                </div>
                <div className="">
                  <div className={classes.urlCopy}>
                    {spConfig?.spec?.callbackUrl}
                    <Tooltip
                      title={toolTip}
                      id="clip"
                      onClose={props.resetClipboardCopyTooltip}
                    >
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${spConfig?.spec?.callbackUrl}`
                          );
                          setToolTip("Copied");
                        }}
                        aria-label="copy"
                      >
                        <FileCopyOutlined />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-row mt-3">
                <div className={classes.spConfigLabel}>
                  <div className="pt-3">
                    <b>Issuer URL</b>
                  </div>
                </div>
                <div className="">
                  <div className={classes.urlCopy}>
                    {spConfig?.spec?.issuerUrl}
                    <Tooltip
                      title={toolTip}
                      id="clip"
                      onClose={props.resetClipboardCopyTooltip}
                    >
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${spConfig?.spec?.issuerUrl}`
                          );
                          setToolTip("Copied");
                        }}
                        aria-label="copy"
                      >
                        <FileCopyOutlined />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-row mt-3">
                <div className={classes.spConfigLabel}>
                  <div className="pt-3">
                    <b>Auth URL</b>
                  </div>
                </div>
                <div className="">
                  <div className={classes.urlCopy}>
                    {spConfig?.spec?.authUrl}
                    <Tooltip
                      title={toolTip}
                      id="clip"
                      onClose={props.resetClipboardCopyTooltip}
                    >
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${spConfig?.spec?.authUrl}`
                          );
                          setToolTip("Copied");
                        }}
                        aria-label="copy"
                      >
                        <FileCopyOutlined />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-row mt-3">
                <div className={classes.spConfigLabel}>
                  <div className="pt-3">
                    <b>Token URL</b>
                  </div>
                </div>
                <div className="">
                  <div className={classes.urlCopy}>
                    {spConfig?.spec?.tokenUrl}
                    <Tooltip
                      title={toolTip}
                      id="clip"
                      onClose={props.resetClipboardCopyTooltip}
                    >
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${spConfig?.spec?.tokenUrl}`
                          );
                          setToolTip("Copied");
                        }}
                        aria-label="copy"
                      >
                        <FileCopyOutlined />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="p-4">
            <FormControl component="fieldset">
              <p className={classes.helpText}>Configure IdP Mapper</p>
              <RadioGroup
                row
                aria-label="position"
                name="position"
                defaultValue={defaultValue}
              >
                <FormControlLabel
                  value="url"
                  control={
                    <Radio
                      color="primary"
                      onClick={() => setMetadataType("url")}
                    />
                  }
                  label="IdP Mapper Link"
                />
              </RadioGroup>
            </FormControl>

            {type === "url" ? (
              <>
                <p className={classes.helpText}>
                  Provide the link to fetch IdP Mapper
                </p>

                <div className="">
                  <Formik
                    key="second"
                    initialValues={{
                      metadata_url: idpResponse?.spec?.mapperUrl,
                    }}
                    validationSchema={MetaDataUrlSchema}
                    innerRef={secondStep}
                    render={({
                      submitForm,
                      isSubmitting,
                      values,
                      setFieldValue,
                    }) => {
                      return (
                        <Form>
                          <Field
                            name="metadata_url"
                            component={CustomInput}
                            className={classes.textField}
                            fullWidth
                            label="Mapper Link"
                            size="small"
                            disabled={false}
                          />
                        </Form>
                      );
                    }}
                  />
                </div>
              </>
            ) : (
              <UploadMetadata
                idpId={idpId}
                data={props?.location?.state}
                setMetaDataFile={setMetaDataFile}
              />
            )}
          </div>
        );
      default:
        return "Unknown step";
    }
  }
  const steps = ["IdP Creation", "SP Configuration", "Submit Request"];

  const handleNext = () => {
    if (activeStep === 0) {
      handleSubmit();
      return;
    }
    if (activeStep === steps.length - 1) {
      handleSecondStepSubmit();
      return;
    }

    // First step first send the request and then proceed next
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setEditMode(true);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const config = { links: [] };
  config.links = [
    {
      label: "Identity Providers",
      href: "#/main/sso",
    },
    {
      label: idpResponse?.metadata?.name
        ? idpResponse.metadata.name
        : "New IdP",
    },
  ];

  const handleSetStep = (value) => {
    if (activeStep === 0) {
      setIdpPayload(transformRequest(firstStep.current.values));
    }
    setActiveStep(value);
  };

  const handleSaveandExit = () => {
    if (activeStep === 0) {
      handleSubmit(true);
      return;
    }

    setRedirect(true);
  };

  return (
    <Box className="">
      {loading ? <LinearProgress /> : null}

      <div className="py-2">
        <div className={classes.root}>
          {redirect ? <Redirect to="/main/sso" /> : null}
          <RafayWizard
            breadcrumb={<ResourceBreadCrumb config={config} />}
            help=""
            tabs={[
              {
                label: "IdP Configuration",
                panel: getStepContent(0),
              },
              {
                label: "SP Configuration",
                panel: getStepContent(1),
              },
              {
                label: "Mapper Configuration",
                panel: getStepContent(2),
              },
            ]}
            step={activeStep}
            handleChange={props.location.state ? handleSetStep : undefined}
          />
          <Paper
            elevation={3}
            className="workload-detail-bottom-navigation"
            style={{ left: "26px" }}
          >
            <div className="row d-flex justify-content-between pt-3">
              <div className="d-flex flex-row">
                <div className="d-flex align-items-center">
                  <Button
                    className="ml-4 mr-4"
                    variant="contained"
                    color="default"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    type="submit"
                  >
                    <ArrowBack />
                    &nbsp;Back
                  </Button>
                  <Button
                    className="mr-4 bg-red text-white"
                    variant="contained"
                    color="primary"
                    onClick={() => setRedirect(true)}
                    type="submit"
                  >
                    &nbsp;Discard & exit
                  </Button>
                  {[0, 1].includes(activeStep) && (
                    <Button
                      className="mr-4 bg-white text-teal"
                      variant="contained"
                      color="default"
                      onClick={handleSaveandExit}
                      type="submit"
                    >
                      &nbsp;Save & exit
                    </Button>
                  )}
                </div>
              </div>
              <div className="next d-flex align-items-center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                  type="submit"
                  disabled={loading}
                >
                  {activeStep === steps.length - 1
                    ? "Save & Exit"
                    : editMode || editModeOn
                    ? "Update & Continue"
                    : "Save & Continue"}
                </Button>
              </div>
            </div>
          </Paper>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={error || isSuccess}
            onClose={() => setError("")}
            className="mb-3"
            message={error || msg}
            action={[
              <IconButton
                onClick={() => setError("")}
                key="close"
                aria-label="Close"
                color="inherit"
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
        </div>
      </div>
    </Box>
  );
};
const mapStateToProps = ({ settings }) => {
  const { drawerType } = settings;
  return { drawerType };
};
export default withRouter(connect(mapStateToProps, {})(RegistrationWizard));
