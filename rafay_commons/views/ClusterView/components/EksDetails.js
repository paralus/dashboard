import { Box, makeStyles, Paper, Tab, Tabs } from "@material-ui/core";
import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import IfThen from "./IfThen";
import MetaItem from "./MetaItem";
import { safelyParseJSON } from "../../../utils";

const viewArray = ids => {
  if (!ids || ids?.length === 0) {
    return "N/A";
  }
  return (
    <div
      style={{
        border: "1px solid #80808038",
        width: "fit-content",
        minWidth: "200px",
        padding: "5px"
      }}
    >
      {ids?.map(id => (
        <p className="m-0">{id}</p>
      ))}
    </div>
  );
};

export default function EksDetails({ edge }) {
  const edge_provider_params = safelyParseJSON(
    edge?.edge_provider_params?.params
  );

  const edgeDNS = edge.dns_records?.find(e => e.dns_type === "edge");

  return (
    <>
      <IfThen condition={edge_provider_params}>
        <MetaItem
          label="Cluster Endpoint Access Type"
          value={edge_provider_params.cluster_endpoint_access_type || "N/A"}
        />
      </IfThen>
      <IfThen condition={edgeDNS}>
        <MetaItem
          label="DNS For Wavelength"
          value={edgeDNS?.dns_name || "N/A"}
        />
      </IfThen>
      <MetaItem
        label="Public Subnet Ids"
        value={viewArray(edge_provider_params.vpc_public_subnets)}
      />
      <MetaItem
        label="Private Subnet Ids"
        value={viewArray(edge_provider_params.vpc_private_subnets)}
      />
      <MetaItem
        label="Cluster Availability Zones"
        value={viewArray(edge_provider_params.zones)}
      />
      <MetaItem
        label="Node Availability Zones"
        value={viewArray(edge_provider_params.node_zones)}
      />
      <MetaItem
        label="Security Groups"
        value={viewArray(edge_provider_params.node_security_groups)}
      />
    </>
  );
}
