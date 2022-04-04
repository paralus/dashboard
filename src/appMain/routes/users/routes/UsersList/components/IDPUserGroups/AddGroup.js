import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import T from "i18n-react";

const AddGroup = ({ groups, onClose, open, onSave, groupsList }) => {
  if (!open) return null;

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [nameError, setNameError] = useState(false);

  const handleSaveClick = (_) => {
    if (!selectedGroup) {
      setNameError(true);
      return;
    }
    setNameError(false);
    onSave(selectedGroup);
  };

  const uGroupList = groupsList
    ?.filter((a) => a.spec.type === "SYSTEM" && !groups.includes(a.metadata.name))
    .map((b) => b.metadata.name);

  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Group</DialogTitle>

        <DialogContent>
          {/* <p className="font-italic text-muted">Select group</p> */}
          <TextField
            select
            margin="dense"
            id="type"
            label=""
            value={selectedGroup || ""}
            onChange={(e) => setSelectedGroup(e.target.value)}
            fullWidth
            error={nameError}
            helperText={nameError && "Required"}
          >
            {uGroupList.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" onClick={handleSaveClick}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddGroup;
