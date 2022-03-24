import React from "react";
import { withRouter } from "react-router-dom";
import { useQuery } from "utils";
import NewPageWrapper from "./wrappers/NewPageWrapper";
import Kubectl from "./Kubectl";

const FullScreenKubectl = (props) => {
  const match = props.match;
  const clusterName = match.params.clusterName;
  const projectId = match.params.projectId;

  const urlParams = new URLSearchParams(props?.location?.search);
  const { query } = useQuery();

  return (
    <NewPageWrapper>
      <Kubectl
        clusterName={clusterName}
        projectId={projectId}
        namespace={query?.get("namespace")}
        height={`${window.innerHeight * 0.5}px`}
        command={query?.get("command")}
        kubectl_type={query?.get("kubectl_type")}
        edge_id={query?.get("edge_id")}
        isLogsOnly={query?.get("isLogsOnly") === "true"}
      />
    </NewPageWrapper>
  );
};

export default withRouter(FullScreenKubectl);
