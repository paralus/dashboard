import * as R from "ramda";
import * as Y from "yup";
import * as T from "./policy-texts";

const isWildcard = v => {
  if (v.length > 1 && v.includes("*")) return false;
  return true;
};

const noWildcardArraySchema = Y.array().test(
  "isWildcard",
  T.NO_WILDCARD,
  isWildcard
);

const fromSpec = (...fns) =>
  R.pipe(R.path(["spec", "template", "spec", "spec"]), ...fns);

const makeArray = R.ifElse(R.anyPass([R.isEmpty, R.isNil]), R.always([]), x => [
  x
]);

const removeRanges = R.when(
  R.complement(R.propEq("rule", "MustRunAs")),
  R.dissoc("ranges")
);

const removeSeLinuxOptions = R.when(
  R.complement(R.propEq("rule", "MustRunAs")),
  R.dissoc("seLinuxOptions")
);

export function generateNewPSPObject({ name, description }) {
  return {
    apiVersion: "config.rafay.dev/v2",
    kind: "PSP",
    metadata: {
      name,
      description,
      labels: {}
    },
    status: {},
    spec: {
      template: {
        apiVersion: "policy/v1beta1",
        kind: "PodSecurityPolicy",
        metadata: {
          name,
          description
        },
        spec: {
          apiVersion: "policy/v1beta1",
          kind: "PodSecurityPolicy",
          metadata: {
            name,
            description,
            annotations: {
              "seccomp.security.alpha.kubernetes.io/allowedProfileNames": "*"
            }
          },
          spec: {
            hostIPC: true,
            hostNetwork: true,
            hostPID: true,
            privileged: false,
            readOnlyRootFilesystem: false,
            allowPrivilegeEscalation: false,
            defaultAllowPrivilegeEscalation: false,
            allowedCapabilities: ["*"],
            defaultAddCapabilities: [],
            requiredDropCapabilities: [],
            volumes: ["*"],
            allowedHostPaths: [],
            fsGroup: {
              rule: "RunAsAny"
            },
            hostPorts: [
              {
                min: 0,
                max: 65535
              }
            ],
            runAsUser: {
              rule: "RunAsAny"
            },
            runAsGroup: {
              rule: "RunAsAny"
            },
            seLinux: {
              rule: "RunAsAny"
            },
            supplementalGroups: {
              rule: "RunAsAny"
            },
            labels: {}
          }
        }
      }
    }
  };
}

export function convertPspToFormValues(psp) {
  return R.applySpec({
    name: R.path(["metadata", "name"]),
    hostIPC: fromSpec(R.propOr(false, "hostIPC")),
    hostNetwork: fromSpec(R.propOr(false, "hostNetwork")),
    hostPID: fromSpec(R.propOr(false, "hostPID")),
    privileged: fromSpec(R.propOr(false, "privileged")),
    allowPrivilegeEscalation: fromSpec(
      R.propOr(false, "allowPrivilegeEscalation")
    ),
    defaultAllowPrivilegeEscalation: fromSpec(
      R.propOr(false, "defaultAllowPrivilegeEscalation")
    ),
    readOnlyRootFilesystem: fromSpec(R.propOr(false, "readOnlyRootFilesystem")),
    hostPorts: fromSpec(R.propOr([], "hostPorts")),
    runAsUser: fromSpec(R.propOr({ rule: "RunAsAny" }, "runAsUser")),
    runAsGroup: fromSpec(R.propOr({ rule: "RunAsAny" }, "runAsGroup")),
    seLinux: fromSpec(R.propOr({ rule: "RunAsAny" }, "seLinux")),
    fsGroup: fromSpec(R.propOr({ rule: "RunAsAny" }, "fsGroup")),
    supplementalGroups: fromSpec(
      R.propOr({ rule: "RunAsAny" }, "supplementalGroups")
    ),
    allowedHostPaths: fromSpec(R.propOr([], "allowedHostPaths")),
    volumes: fromSpec(R.propOr([], "volumes")),
    allowedCapabilities: fromSpec(R.propOr([], "allowedCapabilities")),
    defaultAddCapabilities: fromSpec(R.propOr([], "defaultAddCapabilities")),
    requiredDropCapabilities: fromSpec(R.propOr([], "requiredDropCapabilities"))
  })(psp);
}

export function convertFormValuesToPsp(original, values) {
  const {
    name,
    hostIPC,
    hostNetwork,
    hostPID,
    privileged,
    readOnlyRootFilesystem,
    allowPrivilegeEscalation,
    defaultAllowPrivilegeEscalation,
    allowedCapabilities,
    defaultAddCapabilities,
    requiredDropCapabilities,
    volumes,
    allowedHostPaths,
    fsGroup,
    hostPorts,
    runAsUser,
    runAsGroup,
    seLinux,
    supplementalGroups
  } = values;

  return R.mergeDeepRight(original, {
    apiVersion: "config.rafay.dev/v2",
    kind: "PSP",
    metadata: {
      name,
      labels: {}
    },
    status: {},
    spec: {
      template: {
        apiVersion: "policy/v1beta1",
        kind: "PodSecurityPolicy",
        metadata: {
          name
        },
        spec: {
          apiVersion: "policy/v1beta1",
          kind: "PodSecurityPolicy",
          metadata: {
            name,
            annotations: {
              "seccomp.security.alpha.kubernetes.io/allowedProfileNames": "*"
            }
          },
          spec: {
            hostIPC,
            hostNetwork,
            hostPID,
            privileged,
            readOnlyRootFilesystem,
            allowPrivilegeEscalation,
            defaultAllowPrivilegeEscalation,
            allowedHostPaths,
            allowedCapabilities,
            defaultAddCapabilities,
            requiredDropCapabilities,
            volumes,
            fsGroup: removeRanges(fsGroup),
            runAsUser: removeRanges(runAsUser),
            runAsGroup: removeRanges(runAsGroup),
            supplementalGroups: removeRanges(supplementalGroups),
            seLinux: removeSeLinuxOptions(seLinux),
            hostPorts,
            labels: {}
          }
        }
      }
    }
  });
}

export function makePspSettingSpec(
  name,
  policies,
  setting,
  type = "cluster-scoped"
) {
  if (!name) {
    throw Error("Can't generate pspsetting.spec without a PSP name");
  }
  if (!policies.length) {
    throw Error("Can't generate pspsetting.spec without a list of policies");
  }

  return R.pipe(
    R.find(R.pathEq(["metadata", "name"], name)),
    R.propOr({}, "metadata"),
    R.pick(["name", "organizationID", "projectID", "partnerID"]),
    R.applySpec({
      spec: { pspSpec: R.identity, pspPolicyType: R.always(type) }
    }),
    R.mergeDeepRight(setting || {})
  )(policies);
}

export function validatePspSchema({ hostPorts }) {
  const { min: pMin, max: pMax } = hostPorts;

  return Y.object().shape({
    hostPorts: Y.array().of(
      Y.object().shape({
        min: Y.number()
          .required(T.REQUIRED)
          .min(pMin, T.NOT_SMALLER(pMin)),
        max: Y.number()
          .required(T.REQUIRED)
          .max(pMax, T.NOT_GREATER(pMax))
      })
    ),
    fsGroup: Y.object().shape({
      rule: Y.string().required(),
      ranges: Y.array().of(
        Y.object().shape({
          min: Y.number()
            .required(T.REQUIRED)
            .min(0, T.NOT_SMALLER(0)),
          max: Y.number().required(T.REQUIRED)
        })
      )
    }),
    runAsUser: Y.object().shape({
      rule: Y.string().required(),
      ranges: Y.array().of(
        Y.object().shape({
          min: Y.number()
            .required(T.REQUIRED)
            .min(0, T.NOT_SMALLER(0)),
          max: Y.number().required(T.REQUIRED)
        })
      )
    }),
    runAsGroup: Y.object().shape({
      rule: Y.string().required(),
      ranges: Y.array().of(
        Y.object().shape({
          min: Y.number()
            .required(T.REQUIRED)
            .min(0, T.NOT_SMALLER(0)),
          max: Y.number().required(T.REQUIRED)
        })
      )
    }),
    supplementalGroups: Y.object().shape({
      rule: Y.string().required(),
      ranges: Y.array().of(
        Y.object().shape({
          min: Y.number()
            .required(T.REQUIRED)
            .min(0, T.NOT_SMALLER(0)),
          max: Y.number().required(T.REQUIRED)
        })
      )
    }),
    allowedCapabilities: noWildcardArraySchema,
    volumes: noWildcardArraySchema
  });
}
