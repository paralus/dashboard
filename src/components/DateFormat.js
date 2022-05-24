import React from "react";

const DateFormat = ({ timestamp }) => {
  if (!timestamp) return "-";
  try {
    return new Date(
      timestamp.seconds * 1000 + timestamp.nanos / 1e6
    ).toISOString();
  } catch (error) {
    return "-";
  }
};

export default DateFormat;
