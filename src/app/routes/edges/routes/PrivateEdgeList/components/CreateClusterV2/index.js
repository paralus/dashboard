import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { interpret } from "xstate";
import { createCluster } from "actions/index";
import RafaySnackbar from "components/RafaySnackbar";
import { wizardConfig } from "./CreateClusterConfig";
import CreateClusterDialog from "./CreateClusterDialog";
import StepOneContent from "./StepOneContent";
import StepTwoContent from "./StepTwoContent";
import InfoForm from "./InfoForm";
import { capitalizeFirstLetter } from "../../../../../../../utils";

class CreateClusterV2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: wizardConfig.initialState,
      clusterName: "",
      description: "",
      alert: {
        open: false,
        message: "",
        severity: "error",
      },
    };
    this.service = interpret(wizardConfig).onTransition((current) => {
      this.setState({ current });
    });
  }

  componentDidMount() {
    // console.log("!!! Starting Service !!!");
    this.service.start();
  }

  componentWillUnmount() {
    // console.log("!!! Stopping Service !!!");
    this.service.stop();
  }

  resetInputFields = (_) =>
    this.setState({
      clusterName: "",
      description: "",
    });

  parseClusterType = (_) => {
    const { current } = this.state;
    const clusterType = current.context.clusterType;
    const deploymentType = current.context.deploymentType;
    const providerType = current.context.providerType;
    const serviceType = current.context.serviceType;
    if (clusterType === "IMPORT") {
      return "imported";
    }
    if (deploymentType === "ONPREM") {
      return "manual";
    }
    if (providerType === "AWS") {
      if (serviceType === "MKS") {
        return "aws-ec2";
      }
      if (serviceType === "EKS") {
        return "aws-eks";
      }
    }
    if (providerType === "GCP") {
      return "google-gcp";
    }
    if (providerType === "AZURE") {
      if (serviceType === "MKS") {
        return "manual";
      }
      if (serviceType === "AKS") {
        return "azure-aks";
      }
    }
    return null;
  };

  handleSaveCluster = (_) => {
    const { current, description, clusterName } = this.state;
    const provision_params = {
      provisionType: current.context.clusterType,
      provisionEnvironment: current.context.deploymentType,
      provisionPackageType: current.context.packageType,
      environmentProvider: current.context.providerType,
      kubernetesProvider: current.context.serviceType,
      state: "CONFIG",
    };
    const cluster_type = this.parseClusterType();
    const params = {
      kind: "Cluster",
      metadata: {
        name: clusterName,
        description: description,
      },
      spec: {
        clusterType: cluster_type,
        params: provision_params,
      },
    };

    createCluster(params)
      .then((res) => {
        this.props.handleCloseCluster(res?.data);
      })
      .catch((e) => {
        let message = e?.response?.data;
        this.setState({
          alert: { open: true, severity: "error", message },
        });
      });
  };

  render() {
    if (!this.service) return null;
    const { open, handleClose } = this.props;
    const {
      current,
      description,
      clusterName,
      alert,
      templateName,
      templateVersion,
    } = this.state;
    const { send } = this.service;
    let dialogTitle = "New Cluster";
    if (current.value !== "step1") {
      dialogTitle = {
        IMPORT: "Import Existing Kubernetes Cluster",
      }[current.context.clusterType];
    }

    const wizardContent = (
      <>
        {current.matches("step1") && (
          <StepOneContent
            type={current.context.clusterType}
            onTypeSelect={{
              IMPORT: () => send("IMPORT"),
            }}
          />
        )}
        {current.matches("step2") && (
          <StepTwoContent
            clusterType={current.context.clusterType}
            deploymentType={current.context.deploymentType}
            providerType={current.context.providerType}
            serviceType={current.context.serviceType}
            packageType={current.context.packageType}
            // showForm={current.context.showForm}
            infoForm={
              <InfoForm
                clusterType={current.context.clusterType}
                showForm={current.context.showForm}
                clusterName={clusterName}
                description={description}
                onNameChange={(name) =>
                  this.setState({ clusterName: name, formError: false })
                }
                onDescChange={(desc) => this.setState({ description: desc })}
                error={this.state.formError}
                serviceType={current.context.serviceType}
              />
            }
            onTypeSelect={{
              CLOUD: () => send("CLOUD"),
              ONPREM: () => send("ONPREM"),
              AWS: () => send("AWS"),
              GCP: () => send("GCP"),
              AZURE: () => send("AZURE"),
              OTHER: () => send("OTHER"),
              EKS: () => send("EKS"),
              EKSD: () => send("EKSD"),
              GKE: () => send("GKE"),
              AKS: () => send("AKS"),
              MKS: () => send("MKS"),
              LINUX: () => send("LINUX"),
              OVA: () => send("OVA"),
              QCOW2: () => send("QCOW2"),
              RKE: () => send("RKE"),
              OPENSHIFT: () => send("OPENSHIFT"),
              EKSANYWHERE: () => send("EKSANYWHERE"),
            }}
          />
        )}
      </>
    );

    let isDisabled =
      current.matches("step2") &&
      !(current.context.showForm && clusterName.length > 0);
    return (
      <>
        <CreateClusterDialog
          open={open}
          handleClose={handleClose}
          title={dialogTitle}
          content={wizardContent}
          actions={{
            backButton: {
              handleClick: () => {
                this.resetInputFields();
                send("BACK");
              },
              disabled: current.nextEvents.indexOf("BACK") === -1,
            },
            cancelButton: true,
            continueButton: {
              handleClick: () => {
                if (current.matches("step2")) {
                  this.handleSaveCluster();
                } else send("NEXT");
              },
              label: "Continue",
              disabled: isDisabled,
            },
          }}
        />
        <RafaySnackbar
          open={alert.open}
          message={capitalizeFirstLetter(alert.message)}
          severity={alert.severity}
          closeCallback={(_) => this.setState({ alert: { open: false } })}
        />
      </>
    );
  }
}

export default withRouter(CreateClusterV2);
