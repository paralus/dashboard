import React from "react";
import AWS from "assets/images/aws-ec2.png";
import GCP from "assets/images/gcp.png";
import EKS from "assets/images/amazon-eks.png";
import K8s from "assets/images/k8s.png";
import AKS from "assets/images/aks.png";
import GKE from "assets/images/gke.png";
import Rafay from "assets/images/rafay.png";
import Rafay2 from "assets/images/rafay2.png";
import RKE from "assets/images/rke.png";
import Paris from "assets/images/eksd.png";
import OpenShift from "assets/images/openshift.png";
import Any from "assets/images/any.svg";

const TypeImg = ({ src, width }) => {
  return (
    <img
      src={src}
      alt=""
      style={{
        width: width || "20px",
        marginRight: "5px",
        marginLeft: "5px",
      }}
      id="size-image"
    />
  );
};

export function getClusterType(params) {
  if (!params) return {};
  const {
    environmentProvider,
    kubernetesProvider,
    provisionEnvironment,
    provisionPackageType,
    provisionType,
  } = params;
  const type = "";
  let label = "";
  let src = null;
  const imgWidth = null;
  // environmentProvider: "AWS"
  // kubernetesProvider: "MKS"
  // provisionEnvironment: "CLOUD"
  // provisionPackageType: ""
  // provisionType: "CREATE"
  if (provisionType === "CREATE") {
    if (provisionEnvironment === "CLOUD") {
      if (kubernetesProvider === "EKSD") {
        label = "Amazon EKS Distro";
        src = <TypeImg src={Paris} />;
      }
      if (kubernetesProvider === "EKSD" && environmentProvider === "GCP") {
        label = "Amazon EKS Distro (GCP)";
        src = <TypeImg src={Paris} />;
      }
      if (kubernetesProvider === "EKSD" && environmentProvider === "AZURE") {
        label = "Amazon EKS Distro (AZURE)";
        src = <TypeImg src={Paris} />;
      }
      if (kubernetesProvider === "EKS" && environmentProvider === "AWS") {
        label = "Amazon EKS";
        src = <TypeImg src={EKS} />;
      }
      if (kubernetesProvider === "MKS") {
        if (environmentProvider === "AWS") {
          label = "Upstream Kubernetes (AWS)";
        }
        if (environmentProvider === "GCP") {
          label = "Upstream Kubernetes (GCP)";
        }
        if (environmentProvider === "AZURE") {
          label = "Upstream Kubernetes (Azure)";
        }
        src = <TypeImg src={Rafay} />;
      }
      if (kubernetesProvider === "GKE" && environmentProvider === "GCP") {
        label = "Google GKE";
        src = <TypeImg src={GKE} />;
      }
      if (kubernetesProvider === "AKS" && environmentProvider === "AZURE") {
        label = "Azure AKS";
        src = <TypeImg src={AKS} />;
      }
    }
    if (provisionEnvironment === "ONPREM") {
      if (provisionPackageType === "LINUX") {
        label = "Upstream Kubernetes (Linux)";
      }
      if (provisionPackageType === "OVA") {
        label = "Upstream Kubernetes (VMware OVA)";
      }
      if (provisionPackageType === "QCOW2") {
        label = "Upstream Kubernetes (Openstack QCOW2)";
      }
      src = <TypeImg src={Rafay} />;
      if (kubernetesProvider === "EKSD") {
        label = "Amazon EKS Distro";
        src = <TypeImg src={Paris} />;
      }
    }
  }
  if (provisionType === "IMPORT") {
    if (provisionEnvironment === "CLOUD") {
      if (kubernetesProvider === "EKS") {
        label = "Amazon EKS (Imported)";
        src = <TypeImg src={EKS} />;
      }
      if (kubernetesProvider === "OPENSHIFT") {
        label = "Redhat Openshift (Imported)";
        src = <TypeImg src={OpenShift} />;
      }
      if (kubernetesProvider === "GKE") {
        label = "Google GKE (Imported)";
        src = <TypeImg src={GKE} />;
      }
      if (kubernetesProvider === "AKS") {
        label = "Azure AKS (Imported)";
        src = <TypeImg src={AKS} />;
      }
      if (kubernetesProvider === "OTHER") {
        label = "Other (Imported)";
        src = <TypeImg src={K8s} />;
      }
    }
    if (provisionEnvironment === "ONPREM") {
      if (kubernetesProvider === "OPENSHIFT") {
        label = "Redhat Openshift (Imported)";
        src = <TypeImg src={OpenShift} />;
      }
      if (kubernetesProvider === "RKE") {
        label = "Rancher RKE (Imported)";
        src = <TypeImg src={RKE} />;
      }
      if (kubernetesProvider === "OTHER") {
        label = "Other (Imported)";
        src = <TypeImg src={K8s} />;
      }
      if (kubernetesProvider === "EKSANYWHERE") {
        label = "EKS ANYWHERE";
        src = <TypeImg src={Any} />;
      }
    }
  }

  return { label, src };
}
