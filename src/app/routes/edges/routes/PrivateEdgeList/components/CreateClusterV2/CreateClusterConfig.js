import { Machine, assign } from "xstate";

const setClusterType = assign({
  clusterType: (_, event) => event.type,
  deploymentType: "",
  providerType: "",
  serviceType: "",
  packageType: "",
});

const resetContextParams = assign({
  deploymentType: "",
  providerType: "",
  serviceType: "",
  packageType: "",
  showForm: false,
});

const setDeploymentType = assign({
  deploymentType: (_, event) => event.type,
  providerType: "",
  serviceType: "",
  packageType: "",
  showForm: false,
});

const setProviderType = assign({
  providerType: (_, event) => event.type,
  serviceType: "",
  packageType: "",
  showForm: false,
});

const setServiceType = assign({
  serviceType: (_, event) => event.type,
  showForm: true,
});

const setPackageType = assign({
  packageType: (_, event) => event.type,
  showForm: true,
});

export const wizardConfig = Machine(
  {
    id: "wizard",
    initial: "step1",
    context: {
      clusterType: "CREATE",
      deploymentType: "",
      providerType: "",
      serviceType: "",
      packageType: "",
      showForm: false,
    },
    states: {
      step1: {
        entry: ["resetContextParams"],
        on: {
          NEXT: "step2",
          CREATE: { actions: "setClusterType" },
          IMPORT: { actions: "setClusterType" },
          TEMPLATE: { actions: "setClusterType" },
        },
      },
      step2: {
        on: {
          BACK: "step1",
          NEXT: "step3",
          CLOUD: { actions: "setDeploymentType" },
          ONPREM: { actions: "setDeploymentType" },
          AWS: { actions: "setProviderType" },
          GCP: { actions: "setProviderType" },
          AZURE: { actions: "setProviderType" },
          EKS: { actions: "setServiceType" },
          EKSD: { actions: "setServiceType" },
          GKE: { actions: "setServiceType" },
          MKS: { actions: "setServiceType" },
          AKS: { actions: "setServiceType" },
          OTHER: { actions: "setServiceType" },
          OPENSHIFT: { actions: "setServiceType" },
          EKSANYWHERE: { actions: "setServiceType" },
          RKE: { actions: "setServiceType" },
          LINUX: { actions: "setPackageType" },
          OVA: { actions: "setPackageType" },
          QCOW2: { actions: "setPackageType" },
        },
      },
      step3: {
        on: { NEXT: "final", BACK: "step2" },
      },
      final: {},
    },
  },
  {
    actions: {
      setClusterType,
      setPackageType,
      setServiceType,
      setProviderType,
      setDeploymentType,
      resetContextParams,
    },
  },
);
