import React from "react";
import { Table } from "@material-ui/core";
import Spinner from "components/Spinner";
import AppNoData from "components/AppNoData";
import DataTableFooter from "./DataTableFooter";
import DataTableHead from "./DataTableHead";
import DataTableBody from "./DataTableBody";

const DataTable = ({
  columnLabels,
  list,
  count = null,
  parseRowData,
  type = "client",
  getCollapsedRow,
  loading = false,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  count = count || list.length;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };
  let data = [];
  if (list) {
    if (list.length > rowsPerPage) {
      const startIndex = rowsPerPage * page;
      const endIndex = startIndex + rowsPerPage;
      data = list.slice(startIndex, endIndex);
    } else {
      data = list;
    }
  }
  return (
    <div className="flex-auto">
      <Spinner loading={loading} addHeight hideChildren>
        {data?.length ? (
          <div className="table-responsive-material">
            <Table size="small">
              <DataTableHead columnData={columnLabels} />
              <DataTableBody
                data={data}
                parseRowData={parseRowData}
                columnLabels={columnLabels}
                getCollapsedRow={getCollapsedRow}
              />
              {type === "client" && (
                <DataTableFooter
                  count={count}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
              )}
            </Table>
          </div>
        ) : (
          <AppNoData />
        )}
      </Spinner>
    </div>
  );
};

export default DataTable;
