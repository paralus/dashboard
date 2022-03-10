import React, { useEffect } from "react";
import Paper from "@material-ui/core/Paper";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-monokai";

const CustomConfig = ({
  handleChange,
  value,
  title = "",
  helperText = "",
  height = 650,
  readOnly = false
}) => {
  const handleValueChange = value => {
    handleChange(value);
  };

  useEffect(() => handleChange(value), []);

  return (
    <div className="row mt-2">
      <div className="col-md-12">
        <Paper style={{ padding: "15px", minWidth: "1000px" }}>
          <div className="row">
            <div className="col-md-12 ">
              <h3>{title}</h3>
              <p className="text-muted">{helperText}</p>
              <hr className="my-0" />
            </div>
          </div>
          <AceEditor
            placeholder="Type Here "
            mode="yaml"
            theme="monokai"
            name="ace"
            width="100%"
            onChange={handleValueChange}
            fontSize={14}
            height={height}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={value}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              readOnly: readOnly
            }}
          />
        </Paper>
      </div>
    </div>
  );
};

export default CustomConfig;
