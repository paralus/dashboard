import React, { useEffect, useState, useRef } from "react";
import { TextField, ListItemText } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { debounce } from "../utils";

function RafaySelect({
  value = "",
  source,
  label,
  onSelect,
  placeholder,
  allowInput,
  error,
  helperText,
  dynamicLoader = null,
  timeout = 500,
  disabled,
  ...rest
}) {
  const [options, setOptions] = useState([]);
  const [inputText, setInputText] = useState(dynamicLoader ? value : "");
  const onChangeDebounced = useRef(debounce(timeout, dynamicLoader));

  useEffect(() => {
    if (options.length === 0 && typeof source === "function") {
      source().then((list) => setOptions(list));
    }

    if (Array.isArray(source) && options !== source) {
      setOptions(source);
    }
  }, [source]);

  useEffect(() => {
    if (dynamicLoader && inputText !== value) {
      onChangeDebounced.current(inputText);
    }
  }, [inputText]);

  const handleInputChange = (_, inputValue = "") => {
    if (!inputValue) onSelect("");
    setInputText(inputValue || "");
  };

  const handleChange = (_, value, reason) => {
    if (dynamicLoader) dynamicLoader("");
    onSelect(value || "", reason);
  };

  return (
    <Autocomplete
      {...rest}
      fullWidth
      freeSolo={allowInput}
      value={value}
      inputValue={inputText}
      options={options}
      getOptionLabel={(option) => option?.label ?? option}
      onInputChange={handleInputChange}
      onChange={handleChange}
      renderOption={(option) => (
        <ListItemText
          className="my-0"
          primary={option.label || option}
          secondary={option.secondary}
        />
      )}
      renderInput={(params) => (
        <TextField
          {...rest}
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          disabled={disabled}
        />
      )}
    />
  );
}

export default RafaySelect;
