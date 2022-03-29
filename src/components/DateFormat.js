import React from "react";

const DateFormat = ({ date }) => {
  if (!date) return "-";
  const dateFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  try {
    return new Intl.DateTimeFormat("en-US", dateFormatOptions).format(
      new Date(date)
    );
  } catch (error) {
    return "-";
  }
};

export default DateFormat;
