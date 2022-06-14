import React from "react";
import { Paper } from "@material-ui/core";
import AWS from "assets/images/aws-ec2.png";
import GCP from "assets/images/gcp.png";
import EKS from "assets/images/amazon-eks.png";
import GKE from "assets/images/gke.png";
import AKS from "assets/images/aks.png";
import Azure from "assets/images/azure.png";
import Linux from "assets/images/linux.png";
// import Import from "assets/images/import.png";
import Ova from "assets/images/ova.png";
import KVM from "assets/images/kvm.png";
import RKE from "assets/images/rke.png";
import Paris from "assets/images/eksd.png";
import Openshift from "assets/images/openshift.png";
import Any from "assets/images/any.svg";
// import OnPrem from "assets/images/on-prem.png";

const ClusterTypeLabels = {
  "on-prem": "On-prem",
  aws: "Amazon EC2",
  gcp: "Google Cloud Platform",
  "aws-eks": "Amazon EKS",
  gke: "Google Kubernetes Engine",
  aks: "Azure Kubernetes Service",
  import: "Import",
};

const ComponentStyle = {
  paper: {
    cursor: "pointer",
    padding: "10px",
    margin: "10px",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    minHeight: "80px",
    width: "180px",
    fontWeight: "500",
    fontSize: "13px",
    backgroundColor: "whitesmoke",
    border: "5px solid rgb(10, 176, 155, 0)",
  },
  paperSelected: {
    backgroundColor: "white",
    border: "5px solid rgb(10, 176, 155)",
  },
  paperDisabled: {
    backgroundColor: "whitesmoke",
    cursor: "not-allowed",
    border: "3px solid rgb(10, 176, 155, 0)",
  },
  typeHeading: { color: "black", marginBottom: "10px" },
  typeHelptext: {
    // fontStyle: "italic",
    color: "rgb(117, 117, 117)",
    fontSize: "15px",
    marginBottom: "6px",
  },
  typeImage: {
    width: "30px",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "10px",
    display: "block",
  },
};

const ClusterTypeButton = ({
  label,
  type,
  clusterType,
  disabled,
  image,
  icon,
  onTypeSelect,
}) => {
  const paperStyle = (_) => {
    if (disabled)
      return { ...ComponentStyle.paper, ...ComponentStyle.paperDisabled };
    if (clusterType === type)
      return { ...ComponentStyle.paper, ...ComponentStyle.paperSelected };
    return ComponentStyle.paper;
  };
  return (
    <Paper
      elevation={1}
      onClick={(_) => onTypeSelect(type)}
      className="mx-2 w-100"
      style={paperStyle()}
    >
      {image && (
        <img
          src={image}
          alt="Paris"
          style={ComponentStyle.typeImage}
          id="size_image_"
        />
      )}
      {icon && <div style={ComponentStyle.typeImage}>{icon}</div>}
      {label}
    </Paper>
  );
};

const BlankButton = () => {
  return (
    <Paper
      elevation={0}
      // onClick={(_) => onTypeSelect(type)}
      className="mx-2 w-100"
      style={{ ...ComponentStyle.paper, backgroundColor: "white" }}
    />
  );
};

const ButtonRow = ({ title, helptext, buttons, noBorder }) => {
  return (
    <Paper
      elevation={0}
      className=" h-100 mb-2 row"
      // style={{ border: "1px solid lightgray" }}
      style={noBorder ? {} : { borderBottom: "1px solid lightgray" }}
    >
      <div
        className="d-flex flex-column pl-0 py-3 pr-3 col-md-5"
        // style={{ borderBottom: "1px solid lightgray" }}
      >
        <h2 style={ComponentStyle.typeHeading}>{title}</h2>
        <p style={ComponentStyle.typeHelptext}>{helptext}</p>
      </div>
      <div className="d-flex flex-row mb-2 pt-2 col-md-7">
        {buttons.map((button, index) => {
          if (button.blank) {
            return <BlankButton />;
          }
          return (
            <ClusterTypeButton
              key={index}
              type={button.type}
              image={button.image}
              clusterType={button.value}
              onTypeSelect={button.onSelect}
              label={button.label}
              disabled={button.disabled}
            />
          );
        })}
      </div>
    </Paper>
  );
};

const StepTwoContent = ({
  clusterType,
  deploymentType,
  providerType,
  serviceType,
  packageType,
  onTypeSelect,
  showForm,
  infoForm,
}) => {
  return (
    <div className="py-0 row">
      <div className="col-md-9">
        <div className="col-md-12">
          <Paper
            elevation={0}
            className=" h-100 mb-2 row"
            // style={{ border: "1px solid lightgray" }}
            style={{ borderBottom: "1px solid lightgray" }}
          >
            <div
              className="d-flex flex-column pl-0 py-3 pr-3 col-md-5"
              // style={{ borderBottom: "1px solid lightgray" }}
            >
              <h2 style={ComponentStyle.typeHeading}>Select Environment</h2>
              {clusterType === "IMPORT" && (
                <p style={ComponentStyle.typeHelptext}>
                  Specify the operating environment for your existing Kubernetes
                  cluster
                </p>
              )}
            </div>
            <div className="d-flex flex-row mb-2 pt-2 col-md-7">
              <ClusterTypeButton
                type="CLOUD"
                clusterType={deploymentType}
                onTypeSelect={onTypeSelect.CLOUD}
                label="Public Cloud"
                icon={<i className="zmdi zmdi-cloud-outline-alt zmdi-hc-2x" />}
              />
              <ClusterTypeButton
                type="ONPREM"
                clusterType={deploymentType}
                onTypeSelect={onTypeSelect.ONPREM}
                label="Data center / Edge"
                icon={<i className="zmdi zmdi-dns zmdi-hc-2x" />}
              />
            </div>
          </Paper>
        </div>
        <div className="col-md-12 ">
          <>
            {clusterType === "IMPORT" && deploymentType === "CLOUD" && (
              <>
                <ButtonRow
                  title="Select Kubernetes Distribution"
                  helptext="Paralus will provision your managed Kubernetes cluster in your account and install management agent"
                  buttons={[
                    {
                      type: "EKS",
                      image: EKS,
                      value: serviceType,
                      onSelect: onTypeSelect.EKS,
                      label: "Amazon EKS",
                    },
                    {
                      type: "GKE",
                      image: GKE,
                      value: serviceType,
                      onSelect: onTypeSelect.GKE,
                      label: "GCP GKE",
                    },
                    {
                      type: "AKS",
                      image: AKS,
                      value: serviceType,
                      onSelect: onTypeSelect.AKS,
                      label: "Azure AKS",
                    },
                  ]}
                  noBorder
                />
                <ButtonRow
                  buttons={[
                    {
                      type: "OPENSHIFT",
                      image: Openshift,
                      value: serviceType,
                      onSelect: onTypeSelect.OPENSHIFT,
                      label: "RedHat OpenShift",
                    },
                    {
                      type: "OTHER",
                      image: Linux,
                      value: serviceType,
                      onSelect: onTypeSelect.OTHER,
                      label: "Other",
                    },
                    {
                      blank: true,
                    },
                  ]}
                  noBorder
                />
              </>
            )}
            {clusterType === "IMPORT" && deploymentType === "ONPREM" && (
              <>
                <ButtonRow
                  title="Select Kubernetes Distribution"
                  helptext="Paralus will provision your managed Kubernetes cluster in your account and install management agent"
                  buttons={[
                    {
                      type: "OPENSHIFT",
                      image: Openshift,
                      value: serviceType,
                      onSelect: onTypeSelect.OPENSHIFT,
                      label: "RedHat OpenShift",
                    },
                    {
                      type: "RKE",
                      image: RKE,
                      value: serviceType,
                      onSelect: onTypeSelect.RKE,
                      label: "Rancher RKE",
                    },
                    {
                      type: "EKSANYWHERE",
                      image: Any,
                      value: serviceType,
                      onSelect: onTypeSelect.EKSANYWHERE,
                      label: "EKS Anywhere",
                    },
                  ]}
                  noBorder
                />
                <ButtonRow
                  buttons={[
                    {
                      type: "OTHER",
                      image: Linux,
                      value: serviceType,
                      onSelect: onTypeSelect.OTHER,
                      label: "Other",
                    },
                    {
                      blank: true,
                    },
                    {
                      blank: true,
                    },
                  ]}
                  noBorder
                />
              </>
            )}
          </>
        </div>
      </div>
      <div className="col-md-3">{infoForm}</div>
    </div>
  );
};

export default StepTwoContent;
