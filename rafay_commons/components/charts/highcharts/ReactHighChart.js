import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { merge } from "highcharts";
import BASE_OPTIONS from "./hc-base-config";

const defaultChartStyles = {
  height: `100%`,
  width: "100%"
};

const ReactHighChart = props => {
  const mergedOptions = merge(BASE_OPTIONS, props.options);
  return (
    // <div style={{ position: "relative", paddingBottom: "50%" }}>
    // <div style={{ position: "absolute", width: "100%", height: "100%" }}>
    <HighchartsReact
      highcharts={Highcharts}
      options={mergedOptions}
      containerProps={{
        style: props.styles || defaultChartStyles
      }}
    />
    // </div>
    // </div>
  );
};

export default ReactHighChart;
