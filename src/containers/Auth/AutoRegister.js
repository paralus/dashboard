import React, { useState, useEffect } from "react";
import { newKratosSdk } from "actions/Auth";
import { useQuery } from "utils/helpers";

const AutoRegister = (props) => {
  const { query } = useQuery();
  const flowid = query.get("flow");

  // NOTE: flow might be needed on allowing this ui to change other attributes
  const [flow, setFlow] = useState(undefined);
  const [csrf_token, setCSRF] = useState(undefined);

  const getRegistrationFlow = () => {
    const provider = window.localStorage.getItem("provider");
    newKratosSdk()
      .initializeSelfServiceRegistrationFlowForBrowsers(undefined)
      .then(({ data: flow }) => {
        setFlow(flow);
        console.log("FLOW", flow);
        flow.ui.nodes.forEach((node) => {
          if (node.attributes.name === "csrf_token") {
            setCSRF(node.attributes.value);
          }
        });

        newKratosSdk()
          .submitSelfServiceRegistrationFlow(flowid, {
            csrf_token,
            method: "oidc",
            provider: provider,
          })
          .then(() => {
            props.history.push("/");
          });
      })
      .catch(console.error);
  };

  useEffect((_) => {
    getRegistrationFlow();
  }, []);

  return <></>;
};

export default AutoRegister;
