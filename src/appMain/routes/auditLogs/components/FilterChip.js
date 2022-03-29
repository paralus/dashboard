import React from "react";
import { Chip } from "@material-ui/core";

const NO_DELETE = ["timefrom"];

const FilterChip = ({ label, content, onDelete, labelMap }) => {
  const isNotDeletable = NO_DELETE.includes(label);
  const capitalizeFirstCharacter = (string) => {
    return string.charAt(0).toUpperCase() + string.substr(1);
  };

  const snakeCaseToTitleCase = (string) => {
    string = capitalizeFirstCharacter(string);
    return string.replace(/([A-Z]|_)/g, function (txt) {
      if (txt[0] === "_") txt = txt.substr(1);
      return ` ${capitalizeFirstCharacter(txt)}`;
    });
  };

  const formattedLabel = labelMap[label] || snakeCaseToTitleCase(label) || "";
  const chipLabel =
    formattedLabel?.length > 0 ? `${formattedLabel}: ${content}` : content;

  return (
    <Chip
      style={{ margin: "2px" }}
      label={chipLabel}
      onDelete={isNotDeletable ? null : () => onDelete(label)}
    />
  );
};

export default FilterChip;
