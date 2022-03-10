import React, { useEffect, useState, useRef } from "react";
import { Button } from "@material-ui/core";

import CustomConfig from "./CustomConfig";
import RafayDrawer from "./RafayDrawer";

function RafayEditor({
  open,
  name,
  data = "",
  onClose,
  onSave,
  helperText,
  readOnly,
  ...rest
}) {
  const [inputData, setInputData] = useState("");
  const [isLoading, setLoading] = useState(true);

  const refData = useRef(inputData);

  useEffect(() => {
    setLoading(!data);
    setInputData(data);
    refData.current = data;
  }, [data]);

  const handleChange = data => {
    setInputData(data);
  };

  const handleOnSave = _ => {
    refData.current = inputData;
    onSave(inputData, name);
  };

  const handleOnClose = _ => {
    setInputData(refData.current);
    onClose(refData.current, name);
  };

  return (
    <>
      <RafayDrawer
        anchor="right"
        open={open}
        onClose={handleOnClose}
        headerText={name}
        loading={isLoading}
        showSpinner={isLoading}
      >
        <CustomConfig
          handleChange={handleChange}
          value={inputData}
          readOnly={readOnly}
        />
        {helperText && (
          <p className="py-3 pl-3 font-weight-bold">{helperText}</p>
        )}
        <div
          className="p-3"
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            zIndex: 100,
            backgroundColor: "white"
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleOnSave}
            disabled={inputData === refData.current}
          >
            Update
          </Button>
          <Button
            className="ml-3 bg-white text-red"
            variant="contained"
            color="default"
            onClick={handleOnClose}
          >
            Cancel
          </Button>
        </div>
      </RafayDrawer>
    </>
  );
}

export default RafayEditor;
