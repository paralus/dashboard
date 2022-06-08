const dateFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};

const DateFormat = ({ timestamp }) => {
  if (!timestamp) return "-";
  try {
    return new Intl.DateTimeFormat("en-US", dateFormatOptions).format(
      new Date(timestamp.seconds * 1000 + timestamp.nanos / 1e6)
    );
  } catch (error) {
    return "-";
  }
};

export default DateFormat;
