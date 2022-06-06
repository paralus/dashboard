import React from "react";
import { TableBody } from "@material-ui/core";

import DataTableRow from "./DataTableRow";
import DataTableRowCollapsible from "./DataTableRowCollapsible";

const DataTableBody = ({
  data,
  parseRowData,
  getCollapsedRow,
  columnLabels,
}) => {
  if (getCollapsedRow) {
    return (
      <TableBody>
        {data.map((n, index) => (
          <DataTableRowCollapsible
            key={index}
            rowIndex={index}
            data={n}
            parseRowData={parseRowData}
            getCollapsedRow={getCollapsedRow}
            colSpan={columnLabels.length + 1}
          />
        ))}
      </TableBody>
    );
  }
  return (
    <TableBody>
      {data.map((n, index) => (
        <DataTableRow
          key={index}
          rowIndex={index}
          data={n}
          parseRowData={parseRowData}
        />
      ))}
    </TableBody>
  );
};

export default DataTableBody;
