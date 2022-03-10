/* eslint-disable prefer-promise-reject-errors */
import React from "react";
import moment from "moment";
import numeral from "numeral";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import Link from "@material-ui/core/Link";
import * as R from "ramda";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";

import { formatter } from "utils";

const LONG_DASH = "—";
const theme = createMuiTheme();

const errorChipStyle = {
  marginRight: theme.spacing(1 / 2),
  background: theme.palette.error.light,
  color: "white"
};
const healthyChipStyle = {
  marginRight: theme.spacing(1 / 2),
  background: theme.palette.success.light,
  color: "white",
  userSelect: "none"
};
const warningChipStyle = {
  marginRight: theme.spacing(1 / 2),
  background: theme.palette.warning.light,
  color: "white",
  userSelect: "none"
};
const unknownChipStyle = {
  marginRight: theme.spacing(1 / 2),
  background: theme.palette.grey[400],
  color: "white",
  userSelect: "none"
};

// General Helpers
export const isNothing = R.either(R.isEmpty, R.isNil);

export const isSomething = R.complement(isNothing);

// Highcharts Helpers
export const seriesHaveNoData = R.pipe(
  R.propOr([], "series"),
  R.all(({ data }) => isNothing(data))
);

export const makeCancelable = promise => {
  let hasCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    }
  };
};

export const debounce = (milliseconds, handler) => {
  let timeout = null;
  return value => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (handler) handler(value);
    }, milliseconds);
  };
};

export const longEm = (input, placeholder = LONG_DASH) => {
  if (input === "" || input === undefined) return placeholder;
  return R.defaultTo(placeholder, input);
};

export const getKubeAge = ts => {
  if (!ts) return longEm();

  const formatted = moment(ts).format("MMM D, YYYY, HH:mm");
  const milliseconds =
    moment()
      .startOf("m")
      .valueOf() - ts;
  let ageText = "";

  if (milliseconds < 0) ageText = "0s";
  else {
    const periods = [30758400000, 86400000, 3600000, 60000, 1000];
    const postfixes = ["y", "d", "h", "m", "s"];
    const { values } = periods.reduce(
      (a, c) => ({
        ms: a.ms % c,
        values: [...a.values, Math.floor(a.ms / c)]
      }),
      { ms: milliseconds, values: [] }
    );
    const getString = (value, idx) =>
      value ? `${value}${postfixes[idx]}` : "";
    ageText = values
      .map(getString)
      .filter(isSomething)
      .slice(0, 2)
      .join(" ");
  }

  if (!ageText) return longEm();

  return (
    <Tooltip title={formatted}>
      <span style={{ textDecoration: "underline #666 dotted" }}>{ageText}</span>
    </Tooltip>
  );
};

export const getZtkKubeAge = date => {
  if (!date) return longEm();
  const dt = new Date(date);
  return getKubeAge(dt.getTime());
};

export const mapAgeToRow = data => {
  return (
    data?.map(d => {
      return { ...d, createdAt: d.metadata.creationTimestamp };
    }) || []
  );
};

export const getVMAge = ts => {
  if (!ts) return longEm();
  return moment(ts).fromNow(true);
};

export const handleZtkResolution = data => {
  return data?.body?.items || [];
};

export const getDuration = (completionTime, startTime) => {
  if (!completionTime || !startTime) return longEm();
  const ct = moment(completionTime);
  const st = moment(startTime);
  const duration = moment.duration(ct.diff(st));
  return `${duration.asSeconds()}s`;
};

export const testLabel = k => /^(label_)/.test(k);

export const removeLabel = k => k.replace(/^(label_)/, "");

export const colorCodePhases = R.pipe(
  R.uniq,
  R.map(
    R.cond([
      [
        R.anyPass([
          R.equals("Running"),
          R.equals("Succeeded"),
          R.equals("Completed")
        ]),
        p => <Chip size="small" style={healthyChipStyle} label={p} />
      ],
      [
        R.equals("Unknown"),
        p => <Chip size="small" style={unknownChipStyle} label={p} />
      ],
      [
        R.equals("Pending"),
        p => <Chip size="small" style={warningChipStyle} label={p} />
      ],
      [R.T, p => <Chip size="small" style={errorChipStyle} label={p} />]
    ])
  )
);

export const colorCodeJobs = R.pipe(
  R.uniq,
  R.map(
    R.cond([
      [
        R.anyPass([R.equals("Success"), R.equals("Complete")]),
        p => <Chip size="small" style={healthyChipStyle} label={p} />
      ],
      [
        R.equals("Unknown"),
        p => <Chip size="small" style={unknownChipStyle} label={p} />
      ],
      [
        R.equals("Pending"),
        p => <Chip size="small" style={warningChipStyle} label={p} />
      ],
      [R.T, p => <Chip size="small" style={errorChipStyle} label={p} />]
    ])
  )
);

export const colorCodeHelmChart = R.pipe(
  R.cond([
    [
      R.equals("Failed"),
      p => <Chip size="small" style={errorChipStyle} label={p} />
    ],
    [
      R.equals("Unknown"),
      p => <Chip size="small" style={unknownChipStyle} label={p} />
    ],
    [
      R.anyPass([
        R.equals("Pending_Install"),
        R.equals("Pending_Upgrade"),
        R.equals("Deleting"),
        R.equals("Pending_Rollback")
      ]),
      p => <Chip size="small" style={warningChipStyle} label={p} />
    ],
    [R.T, p => <Chip size="small" style={healthyChipStyle} label={p} />]
  ])
);

export const readStatusByPods = ({ rowData }) => {
  const isHealthyStatus = R.anyPass([
    R.equals(["Running"]),
    R.equals(["Succeeded"]),
    R.equals(["Completed"])
  ]);

  return R.pipe(
    R.propOr({}, "pods"),
    R.values,
    R.map(({ phase, containerReasons }) => {
      return containerReasons ? R.values(containerReasons) : [phase];
    }),
    R.flatten,
    R.uniq,
    R.without([undefined]),
    R.when(R.complement(isHealthyStatus), R.reject(isHealthyStatus)),
    R.ifElse(isNothing, R.always(longEm()), colorCodePhases)
  )(rowData);
};

export const renderLabels = (data = []) => {
  if (!data.length || data === longEm()) return longEm();
  return data.map(d => (
    <Tooltip title={d} enterDelay={500}>
      <Chip
        size="small"
        label={d}
        style={{
          marginBottom: theme.spacing(1),
          marginRight: theme.spacing(1),
          maxWidth: 250
        }}
      />
    </Tooltip>
  ));
};

export const getKeyValuePair = R.pipe(
  R.toPairs,
  R.map(d => `${d[0]}:${d[1]}`)
);

export const getFormatedTrendData = R.pipe(
  R.map(d => ({ [d.time]: d.count })),
  R.applySpec({
    min: R.pipe(R.head, R.keys, R.head),
    seriesData: R.pipe(R.mergeAll, R.values)
  })
);

export const renderClusterResourcesProperty = (data = []) => {
  if (!data.length || data === longEm()) return longEm();
  return data.map(d => (
    <Chip
      size="small"
      label={d}
      style={{
        marginBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
        maxWidth: 250
      }}
    />
  ));
};

export const useQuery = () => {
  const { search } = useLocation();
  return { query: new URLSearchParams(search), search };
};

export const getHealthyPodsCount = ({ rowData }) => {
  return R.pipe(
    R.propOr({}, "pods"),
    R.values,
    R.filter(c => {
      return (
        (c.phase === "Running" || c.phase === "Succeeded") &&
        !c.containerReasons
      );
    }),
    R.length
  )(rowData);
};

export const renderHealthyPodsCount = edgeName => ({ rowData, cellData }) => {
  const getTotal = (running, total) => `${running}/${total}`;
  if (!rowData.pods) return getTotal(0, 0);

  const linkText = getTotal(cellData, R.values(rowData.pods).length);
  const queryText = R.keys(rowData.pods).join(",");
  const linkPath = `/app/edges/${edgeName}/resources/pods?search=${queryText}`;
  return (
    <Link component={RouterLink} to={linkPath}>
      {linkText}
    </Link>
  );
};

export const makeLabelCellData = ({ rowData }) => {
  return R.flatten(
    Object.keys(rowData)
      .filter(testLabel)
      .map(k => {
        if (R.is(Array, rowData[k])) {
          return rowData[k].map(k1 => {
            return `${removeLabel(k)}:${k1}`;
          });
        }

        return `${removeLabel(k)}:${rowData[k]}`;
      })
  );
};

export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export function fixExponential(number) {
  const expFormat = number.toExponential();
  const exponent = +expFormat.split("e").pop();
  return exponent <= -6 ? 0 : number;
}

export const applyNumeral = R.curry((format, value) => {
  return numeral(fixExponential(value)).format(format);
});

export const applyFormatter = R.curry((f, v) => formatter(v, f));

export const getBulkLabelPayload = (edges, label, isDelete = false) => {
  const { key, value } = label?.meta;
  let labels;
  if (!isDelete)
    labels = {
      [key]: value
    };
  else labels = [key];

  return {
    clusters: edges.map(x => x.name),
    labels
  };
};

export const readHelmChartStatus = ({ rowData }) => {
  return R.pipe(R.propOr("", "value"), colorCodeHelmChart)(rowData);
};

export const renderLink = (linkText, linkPath) => (
  <Link component={RouterLink} to={linkPath}>
    {linkText}
  </Link>
);

export const safelyParseJSON = text => {
  if (!text) return {};
  if (typeof text === "object") return text;
  try {
    const result = JSON.parse(text);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const transformLabelsArray = labels => {
  if (!labels) return {};

  const payload = labels.reduce((acc, curr) => {
    acc[curr.key] = curr.value || "";
    return acc;
  }, {});

  return payload;
};

export const transformLabelsObject = labels => {
  if (!labels) return [];

  const payload = Object.keys(labels).map(k => {
    return { key: k, value: labels[k] || null };
  });

  return payload;
};

// JSON Flatten for Reports
export const JSONtoCSV = (
  obj,
  excludedColumns = [],
  path = [],
  headers = [],
  headerString = null
) => {
  if (obj == null) return null;
  Object.keys(obj).forEach(key => {
    if (excludedColumns.includes(key)) return;

    let value = obj[key];
    const header =
      key === "id" && headerString ? [headerString, key].join("_") : key;

    if (
      Array.isArray(value) ||
      value === null ||
      typeof value === "string" ||
      !isNaN(value)
    ) {
      headers.push(header);
      value = isNaN(value) && value.includes(",") ? value.split(",") : value;
      path.push(Array.isArray(value) ? value.join(" | ") : `${value}`);
    } else {
      JSONtoCSV(value, excludedColumns, path, headers, key);
    }
  });

  return {
    key: headers,
    value: path
  };
};

export const JSONArrayToCSV = (jsonArray, excludedColumns = []) => {
  const values = [];
  let headers = [];
  jsonArray.forEach(row => {
    const flattened = JSONtoCSV(row, excludedColumns);
    if (flattened) {
      headers = flattened.key.length > headers.length ? flattened.key : headers;
      values.push(flattened.value);
    }
  });
  return [headers, ...values];
};

export const testProtocol = value => {
  if (!value) return false;

  return !/^(ftp|http|https):\/\/[^ "]+\/$/.test(value);
};

export const parseError = err => {
  if (typeof err === "string") return err;
  if (typeof err?.data === "string") return err?.data;
  if (typeof err?.response?.data === "string") return err?.response?.data;
  if (typeof err?.response?.data?.error === "string")
    return err?.response?.data?.error;
  if (typeof err?.response?.data?.details === "object")
    return err.response.data.details[0].detail;
  return JSON.stringify(err?.response?.data);
};

export const getTimeFromNow = time => {
  return moment(time).fromNow();
};

export const downloadFile = (
  fileName,
  content,
  type = "text/plain",
  extention = null
) => {
  const textFileAsBlob = new Blob([content], { type });
  if (extention) fileName += `.${extention}`;

  const downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }
  downloadLink.click();
};
