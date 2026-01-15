import React from "react";
import Button from "@material-ui/core/Button";
import { JSONArrayToCSV } from "utils/helpers";

const ExportTable = ({ list, tableType, headerMapping = null }) => {
  let data;
  const isSafari = () =>
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const headerMappingForData = () => {
    data[0] = data[0].map((col) => headerMapping[col] || col);
  };

  const downloadLink = () => {
    const type = isSafari() ? "application/csv" : "text/csv";
    const dataString = data.join("\n");
    const blob = new Blob(["\uFEFF", dataString], { type });
    const dataURI = `data:${type};charset=utf-8,\uFEFF'${dataString}`;

    const URL = window.URL || window.webkitURL;
    return URL?.createObjectURL(blob) || dataURI;
  };

  const handleExport = () => {
    data = JSONArrayToCSV(
      list.map((e) => e?._source),
      ["meta"]
    );
    if (headerMapping) headerMappingForData();
    const a = document.createElement("a");
    a.href = downloadLink();
    a.download = `${tableType}.csv`;
    a.click();
    a.remove();
  };

  return (
    <Button
      className="mr-4 bg-white text-teal"
      dense="true"
      variant="contained"
      color="default"
      onClick={handleExport}
    >
      <span>
        <i className="zmdi zmdi-download zmdi-hc-fw " />
      </span>
      Export
    </Button>
  );
};

export default ExportTable;
