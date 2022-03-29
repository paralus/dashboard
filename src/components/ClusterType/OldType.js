import React from "react";
import AWS from "assets/images/aws-ec2.png";
import GCP from "assets/images/gcp.png";
import EKS from "assets/images/amazon-eks.png";
import K8s from "assets/images/k8s.png";
import OnPrem from "assets/images/on-prem.png";
import AKS from "assets/images/aks.png";

const TypeImg = ({ src, type, label }) => {
  let width = "20px";
  switch (type) {
    case "aws-ec2":
      width = "30px";
      break;
    case "google-gcp":
      width = "23px";
      break;
    default:
      break;
  }
  return (
    <span>
      <img
        src={src}
        alt="Paris"
        style={{
          width,
          marginRight: "5px",
          marginLeft: "5px",
        }}
        id={`size-image-${type}`}
      />
      {label}
    </span>
  );
};

const OldType = ({ type }) => {
  return (
    <>
      {type === "aws-ec2" && (
        <TypeImg type={type} src={AWS} label="Amazon EC2" />
      )}
      {type === "google-gcp" && (
        <TypeImg type={type} src={GCP} label="Google Cloud Platform" />
      )}
      {["imported", "v2"].includes(type) && (
        <TypeImg type={type} src={K8s} label="Import" />
      )}
      {type === "aws-eks" && (
        <TypeImg type={type} src={EKS} label="Amazon EKS" />
      )}
      {type === "azure-aks" && (
        <TypeImg type={type} src={AKS} label="AZURE AKS" />
      )}
      {type === "manual" && (
        <TypeImg type={type} src={OnPrem} label="On-prem" />
      )}
    </>
  );
};

export default OldType;
