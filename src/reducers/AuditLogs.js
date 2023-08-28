const initialData = {
  loading: false,
  auditLogsList: null,
  kubectlLogsList: {
    RelayAPI: null,
    RelayCommands: null,
  },
};

const AuditLogs = (state = initialData, action) => {
  switch (action.type) {
    case "load_audit_logs":
      return {
        ...state,
        loading: true,
      };
    case "get_audit_logs":
      return {
        ...state,
        loading: false,
        auditLogsList: action.payload,
      };
    case "get_kubectl_RelayAPI_logs":
      return {
        ...state,
        loading: false,
        kubectlLogsList: {
          RelayAPI: action.payload,
        },
      };
    case "get_kubectl_RelayCommands_logs":
      return {
        ...state,
        loading: false,
        kubectlLogsList: {
          RelayCommands: action.payload,
        },
      };
    case "error":
      return {
        ...state,
        loading: false,
        auditLogsList: null,
        kubectlLogsList: {
          RelayAPI: null,
          RelayCommands: null,
        },
      };
    default:
      return state;
  }
};

export default AuditLogs;
