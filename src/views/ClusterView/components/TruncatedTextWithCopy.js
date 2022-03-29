import React, { useState } from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";

const TruncatedTextWithCopy = ({ text }) => {
  if (!text) return "-";

  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopiedToClipboard(true);
  };
  const resetClipboardCopyTooltip = () => {
    setCopiedToClipboard(false);
  };

  return (
    <div className="d-flex justify-content-start">
      <span
        style={{ overflowWrap: "break-word" }}
        className="d-flex align-items-center mr-3"
      >
        {text.substring(0, 80)}
        ...
      </span>
      <Tooltip
        placement="right"
        title={copiedToClipboard ? "Copied!" : "Copy to clipboard"}
        id="TruncatedTextWithCopy"
        onClose={resetClipboardCopyTooltip}
      >
        <IconButton aria-label="edit" className="m-0" onClick={copyToClipboard}>
          <FileCopyOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default TruncatedTextWithCopy;
