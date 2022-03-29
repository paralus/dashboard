import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import CheckboxField from "components/FormFields/CheckboxField";

// Format action/ cancelAction { isHidden: bool , onClick: function , text: string , color: string }
const ClusterActionDialog = ({
  isOpen,
  header,
  content,
  action,
  cancelAction,
  checkBox = null,
}) => {
  const actionOnClick = () => {
    action.onClick();
    cancelAction.onClick();
  };

  return (
    <Dialog open={isOpen} onClose={cancelAction?.onClick} fullWidth>
      <DialogTitle>{header}</DialogTitle>
      <DialogContent>
        {typeof content === "string" ? (
          <DialogContentText>{content}</DialogContentText>
        ) : (
          content
        )}
        <div className="d-flex flex-row align-items-center">
          {checkBox && (
            <CheckboxField
              checked={checkBox.checked}
              label={checkBox.label}
              onChange={checkBox.onChange}
            />
          )}
        </div>
        <div className="mt-1">
          {checkBox?.checked && checkBox?.checkedText && (
            <DialogContentText>{checkBox?.checkedText}</DialogContentText>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        {!cancelAction?.isHidden && (
          <Button
            onClick={cancelAction.onClick}
            color={cancelAction?.color || "default"}
          >
            {cancelAction?.text || "CANCEL"}
          </Button>
        )}
        {!action?.isHidden && (
          <Button onClick={actionOnClick} color={action?.color || "primary"}>
            {action?.text || "YES"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ClusterActionDialog;
