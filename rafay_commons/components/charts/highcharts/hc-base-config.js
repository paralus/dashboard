export default {
  chart: {
    animation: false,
    marginTop: 20,
    style: {
      fontFamily: "Roboto",
      fontSize: "14px"
    }
  },
  credits: { enabled: false },
  title: {
    text: null
  },
  subtitle: { text: null },
  xAxis: {
    tickWidth: 0,
    showEmpty: false
  },
  yAxis: {
    gridLineWidth: 0,
    title: { text: "" },
    showEmpty: false
  },
  lang: {
    noData: "No data available."
  },
  noData: {
    style: {
      fontWeight: "300",
      fontSize: "18px",
      color: "rgba(0, 0, 0, 0.6)"
    }
  },
  tooltip: {
    pointFormat:
      '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:.2f}</b><br/>',
    dateTimeLabelFormats: {
      day: "%a, %b %e, %Y",
      hour: "%a, %b %e, %H:%M",
      millisecond: "%a, %b %e, %H:%M:%S.%L",
      minute: "%a, %b %e, %H:%M",
      second: "%a, %b %e, %H:%M:%S",
      week: "Week from %a, %b %e, %Y",
      year: "%Y"
    },
    style: {
      fontFamily: "Roboto",
      whiteSpace: "nowrap"
    }
  },
  legend: {
    symbolHeight: 0,
    symbolWidth: 0,
    symbolRadius: 0,
    useHTML: true,
    labelFormatter: function() {
      return (
        '<div><div style="background: ' +
        this.color +
        '"></div><div style="margin: 0 10px">' +
        this.name +
        "</div></div>"
      );
    }
  }
  // legend: {
  //   align: "right",
  //   verticalAlign: "top",
  //   floating: true,
  //   x: 0,
  //   y: -15
  // }
};
