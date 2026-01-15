import React, { useState } from "react";
import * as R from "ramda";
import { useQuery } from "../../../utils";

export default function useHealth() {
  const { query } = useQuery();
  const [status, setStatus] = useState(query.get("status") || "all");
  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Running", value: "healthy" },
    { label: "Error", value: "unhealthy" },
  ];
  const updateStatus = (e, value) => {
    setStatus(value);
  };
  const filterByHealth = R.filter(
    R.cond([
      [R.always(status === "all"), R.T],
      [R.always(status === "healthy"), R.propEq("healthy", true)],
      [R.always(status === "unhealthy"), R.propEq("healthy", false)],
    ]),
  );

  return {
    status,
    statusOptions,
    updateStatus,
    filterByHealth,
  };
}
