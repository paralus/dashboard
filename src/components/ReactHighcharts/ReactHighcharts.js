import React from "react";
import Measure from "react-measure";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import Treemap from "highcharts/modules/treemap";
import SolidGauge from "highcharts/modules/solid-gauge";
import Heatmap from "highcharts/modules/heatmap";
import Timeline from "highcharts/modules/timeline";
import XRange from "highcharts/modules/xrange";
import NoData from "highcharts/modules/no-data-to-display";
import PropTypes from "prop-types";
import classnames from "classnames";
import equals from "ramda/src/equals";

HighchartsMore(Highcharts);
Heatmap(Highcharts);
Treemap(Highcharts);
SolidGauge(Highcharts);
Timeline(Highcharts);
XRange(Highcharts);
NoData(Highcharts);

Highcharts.setOptions({
  global: { useUTC: false },
});

const randomShortText = () => {
  return Math.random().toString(16).substring(2, 10);
};

class ReactHighcharts extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.chartId = `react-highchart-${randomShortText()}`;
  }

  componentDidMount() {
    this.initChart();
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (!equals(this.props, prevProps) || !equals(this.state, prevState)) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps) {
    this.initChart();
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  addRenderToInConfig = () => {
    const { config } = this.props;
    return Highcharts.merge(config, {
      chart: { renderTo: this.chartId },
    });
  };

  initChart = () => {
    const { callback, setRef } = this.props;
    this.chart = new Highcharts.Chart(this.addRenderToInConfig(), callback);
    if (setRef) setRef(this.chart);
  };

  render() {
    const { style, className, measureRef } = this.props;
    return (
      <div
        id={this.chartId}
        ref={measureRef}
        style={style}
        className={classnames("react-highchart-container", {
          [className]: Boolean(className),
        })}
      />
    );
  }
}

ReactHighcharts.propTypes = {
  config: PropTypes.object,
  callback: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  setRef: PropTypes.func,
};

const ReactHighchartsWithMeasure = (props) => {
  return (
    <Measure>
      {({ measureRef, ...rest }) => {
        return <ReactHighcharts measureRef={measureRef} {...rest} {...props} />;
      }}
    </Measure>
  );
};

export default ReactHighchartsWithMeasure;
