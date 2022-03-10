import { pipe, map, last } from "ramda";
import { normalizeTimeSeries } from "./cluster-view-helpers";

const UNITS = {
  H: {
    Hz: 1,
    KHz: 1000 ** 1,
    MHz: 1000 ** 2,
    GHz: 1000 ** 3,
    THz: 1000 ** 4,
    PHz: 1000 ** 5,
    EHz: 1000 ** 6
  },
  W: {
    W: 1,
    kW: 1000 ** 1,
    MW: 1000 ** 2,
    GW: 1000 ** 3,
    TW: 1000 ** 4,
    PW: 1000 ** 5,
    EW: 1000 ** 6
  },
  B: {
    B: 1,
    KB: 1000 ** 1,
    MB: 1000 ** 2,
    GB: 1000 ** 3,
    TB: 1000 ** 4,
    PB: 1000 ** 5,
    EB: 1000 ** 6
  }
};

const commonOptions = {
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      minute: "%H:%M"
    },
    title: {
      text: null
    }
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false
      }
    }
  }
};

function converter(v, unit) {
  const number = Math.max(
    0,
    Math.floor(Math.log(Math.abs(v)) / Math.log(1000))
  );
  const unitSymbol = Object.keys(UNITS[unit])[number];
  const denominator = UNITS[unit][unitSymbol];
  const value = v / denominator;

  return { value, unitSymbol };
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

function setDecimalPoint(value, decimalPoints = 1) {
  if (isFloat(Number(value)) && decimalPoints)
    return value.toFixed(decimalPoints);
  return value;
}

const getPlotValues = response => {
  let MAX_VALUE = 0;
  const data = pipe(
    map(([ts, value]) => {
      MAX_VALUE = Math.max(MAX_VALUE, value);
      return { x: Number(ts) * 1000, y: Number(value) };
    }),
    normalizeTimeSeries
  )(response);
  return { MAX_VALUE, data };
};

export function gpuMemClockOptions(res) {
  const { MAX_VALUE, data } = getPlotValues(res);

  return {
    ...commonOptions,
    series: [
      {
        color: "teal",
        name: "Memory Clocks",
        data
      }
    ],
    yAxis: {
      gridLineWidth: 1,
      title: { text: null },
      min: 0,
      max: Math.ceil(MAX_VALUE) || 1,
      tickAmount: 6,
      visible: true,
      labels: {
        formatter() {
          return `${this.value} Hz`;
        }
      }
    },
    tooltip: {
      shared: true,
      pointFormatter() {
        const { color, y, series } = this;
        return `<span style="color:${color}">●</span> ${
          series.name
        }: <b>${setDecimalPoint(y)}</b> Hz<br/>`;
      }
    }
  };
}

export function gpuSMClocks(res) {
  const { MAX_VALUE, data } = getPlotValues(res);
  return {
    ...commonOptions,
    chart: {
      type: "area"
    },
    series: [
      {
        color: "#2d8180",
        fillOpacity: 0.4,
        name: "SM Clocks",
        data
      }
    ],
    yAxis: {
      gridLineWidth: 1,
      title: { text: null },
      min: 0,
      max: Math.ceil(MAX_VALUE) || 1,
      tickAmount: 6,
      visible: true,
      labels: {
        formatter() {
          return `${this.value} Hz`;
        }
      }
    },
    tooltip: {
      shared: true,
      pointFormatter() {
        const { color, y, series } = this;
        return `<span style="color:${color}">●</span> ${
          series.name
        }: <b>${setDecimalPoint(y)}</b> Hz<br/>`;
      }
    }
  };
}

export const gpuFramebufferMemory = T => res => getFrameBufferOptions(res, T);

export function getFrameBufferOptions(res, T) {
  let MAX_VALUE = 0;
  const data = pipe(
    map(([ts, value]) => {
      const { value: y, unitSymbol: z } = converter(value, "B");
      MAX_VALUE = Math.max(MAX_VALUE, value);
      return { x: Number(ts) * 1000, _y: Number(value), y, z };
    }),
    normalizeTimeSeries
  )(res);

  const { value: maxValue, unitSymbol } = converter(MAX_VALUE, "B");

  return {
    ...commonOptions,
    series: [
      {
        color: "teal",
        name: `Framebuffer Memory ${T}`,
        data
      }
    ],
    yAxis: {
      gridLineWidth: 1,
      title: { text: null },
      min: 0,
      max: Math.ceil(maxValue) || 1,
      tickAmount: 6,
      visible: true,
      labels: {
        formatter() {
          return `${this.value}${unitSymbol}`;
        }
      }
    },
    tooltip: {
      shared: true,
      pointFormatter() {
        const { color, y, z, series, total } = this;
        return `<span style="color:${color}">●</span> ${
          series.name
        }: <b>${setDecimalPoint(y)}</b> ${z}<br/>`;
      }
    }
  };
}

export function gpuClockValue(res) {
  let v = last(res) || "";
  v = v[1];
  if (!v) return "";

  const { value, unitSymbol } = converter(v, "H");

  return `${setDecimalPoint(value, 2)} ${unitSymbol}`;
}

// Dont delete the commented code below,
// Waqar 29-9-2021

// export function gpuTemperatureOld(res) {
//   const v = res[1];
//   if (!v) return {};

//   return {
//     yAxis: {
//       min: 0,
//       max: 100,
//       title: {
//         text: "GPU Avg Temp"
//       }
//     },

//     credits: {
//       enabled: false
//     },

//     series: [
//       {
//         name: "temperature",
//         data: [Number(v)],
//         dataLabels: {
//           format:
//             '<div style="text-align:center">' +
//             '<span style="font-size:25px">{y}°C</span><br/>' +
//             "</div>"
//         },
//         tooltip: {
//           valueSuffix: "°C"
//         }
//       }
//     ]
//   };
// }

export function gpuTemperature(res) {
  const v = res[1];
  if (!v) return {};

  let rawData = v,
    data = getData(rawData);

  return {
    chart: {
      type: "solidgauge",
      marginTop: 10
    },

    title: {
      text: ""
    },
    subtitle: {
      text: `${v}°C`,
      style: {
        "font-size": "30px"
        // "font-weight": "bold"
      },
      y: 170,
      zIndex: 7
    },
    tooltip: {
      enabled: false
    },
    pane: [
      {
        center: ["50%", "65%"],
        startAngle: -120,
        endAngle: 120,
        background: [
          {
            // Track for Move
            outerRadius: "90%",
            innerRadius: "65%",
            backgroundColor: "#EEE",
            // backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0])
            //   .setOpacity(0.3)
            //   .get(),
            borderWidth: 0,
            shape: "arc"
          }
        ],
        size: "110%",
        center: ["50%", "65%"]
      },
      {
        center: ["50%", "65%"],
        startAngle: -120,
        endAngle: 120,
        size: "75%",
        center: ["50%", "65%"],
        background: []
      }
    ],
    yAxis: [
      {
        min: 0,
        max: 100,
        lineWidth: 2,
        lineColor: "white",
        tickInterval: 10,
        labels: {
          enabled: false
        },
        minorTickWidth: 0,
        tickLength: 50,
        tickWidth: 5,
        tickColor: "white",
        zIndex: 6,
        stops: [
          [0.1, "#009a60"],
          [0.2, "#4aa84e"],
          [0.3, "#92b73a"],
          [0.4, "#c6bf22"],
          [0.5, "#edbd02"],
          [0.6, "#ffad00"],
          [0.7, "#ff8c00"],
          [0.8, "#fc6114"],
          [0.9, "#f43021"],
          [1.0, "#ed0022"]
        ]
      }
    ],
    credits: {
      enabled: false
    },

    series: [
      {
        name: "Power",
        data: data,
        dataLabels: {
          enabled: false
        },
        radius: "90%",
        innerRadius: "65%"
      }
    ]
  };
}

export function gpuPower(res) {
  const v = res[1];
  if (!v) return {};

  const { value, unitSymbol } = converter(v, "W");

  return {
    subtitle: {
      text: `${value.toFixed(1)}${unitSymbol}`,
      style: {
        "font-size": "30px"
        // "font-weight": "bold"
      },
      y: 150,
      zIndex: 7
    },
    yAxis: {
      min: 0,
      max: 100,
      labels: {
        y: 16
      },
      title: {
        text: "GPU Power"
      }
    },
    credits: {
      enabled: false
    },

    series: [
      {
        name: "Power",
        data: [Number(value.toFixed(1))],
        dataLabels: {
          enabled: false,
          format:
            '<div style="text-align:center">' +
            `<span style="font-size:30px">{y} ${unitSymbol}</span><br/>` +
            "</div>"
        },
        tooltip: {
          valueSuffix: unitSymbol
        }
      }
    ]
  };
}

function getData(rawData) {
  let data = [],
    start = Math.round(Math.floor(rawData / 10) * 10);
  data.push(rawData);
  for (let i = start; i > 0; i -= 10) {
    data.push({
      y: i
    });
  }
  return data;
}

export function gpuMemoryCopyUtilization(res) {
  return getUtilizationOptions(res, "Memory Copy");
}

export function gpuUtilization(res) {
  return getUtilizationOptions(res, "GPU");
}

export function getUtilizationOptions(res, T) {
  const { data } = getPlotValues(res);

  return {
    ...commonOptions,
    series: [
      {
        color: "teal",
        name: `${T} Utilization`,
        data
      }
    ],
    yAxis: {
      gridLineWidth: 1,
      title: { text: null },
      min: 0,
      max: 100,
      tickAmount: 6,
      visible: true,
      labels: {
        formatter() {
          return `${this.value}%`;
        }
      }
    },
    tooltip: {
      shared: true,
      pointFormatter() {
        const { color, y, series } = this;
        return `<span style="color:${color}">●</span> ${
          series.name
        }: <b>${setDecimalPoint(y)}</b>%<br/>`;
      }
    }
  };
}
