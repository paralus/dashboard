import React, { useEffect } from "react";
import { useField, FieldArray } from "formik";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  makeStyles,
  Button,
  MenuItem,
  Box,
  InputLabel,
  Input,
  Select,
  FormHelperText,
  IconButton
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import { longEm } from "../utils/helpers";

// TODO: Add error and helper text supports to all fields.
// TODO: Multi-items need better auto-width support, it's fixed right now

const useStyles = makeStyles(theme => ({
  multiItem: {
    display: "flex",
    flexDirection: "row",
    marginBottom: theme.spacing(1.5),
    "& > *": {
      marginRight: theme.spacing(1),
      "&:last-child": {
        marginRight: "unset"
      }
    }
  },
  minMaxSep: {
    margin: theme.spacing(0, 1)
  },
  multiItemTextField: {
    flex: 1,
    "& input::placeholder": {
      fontSize: 16
    }
  },
  multiItemTextFieldLarge: {
    flex: 1,
    "&::placeholder": {
      fontSize: 16
    }
  },
  actionBtn: {
    letterSpacing: "normal",
    textTransform: "none"
  },
  selectForMinMax: {
    marginBottom: theme.spacing(1)
  },
  multiItemArrow: {
    marginTop: 12,
    opacity: 0.5
  },
  multiItemClose: {
    marginTop: 12,
    height: 24
  }
}));

export function FTextField({ name, ...rest }) {
  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}
      {...rest}
      variant="standard"
      error={!!(meta.touched && meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
}

// TODO: Error and Helper texts not wired up correctly
export function FCheckboxField({ name, label, size, ...rest }) {
  const [field, meta] = useField(name);

  return (
    <FormControlLabel
      {...rest}
      label={label}
      control={
        <Checkbox
          {...field}
          disableRipple
          variant="outlined"
          color="primary"
          checked={field.value}
          name={name}
          size={size}
          error={!!(meta.touched && meta.error)}
          helperText={meta.touched && meta.error}
        />
      }
    />
  );
}

export function FMinMaxField({
  name,
  disabled,
  minLabel = "Min",
  maxLabel = "Max",
  min = 0,
  max,
  defaultMin = 0,
  defaultMax = 10
}) {
  const classes = useStyles();
  const [field] = useField(name);
  const values = field.value || [];

  return (
    <FieldArray name={name}>
      {({ push, remove }) => {
        return (
          <Box>
            {values.map((pair, idx) => {
              return (
                <FormControl
                  className={classes.multiItem}
                  key={`${name}.${idx}`}
                >
                  <FTextField
                    size="small"
                    type="number"
                    autoComplete="off"
                    label={minLabel}
                    name={`${name}.${idx}.min`}
                    className={classes.multiItemTextField}
                    disabled={disabled}
                    InputProps={{ inputProps: { min, max } }}
                  />
                  <ArrowRightIcon className={classes.multiItemArrow} />
                  <FTextField
                    size="small"
                    type="number"
                    autoComplete="off"
                    label={maxLabel}
                    name={`${name}.${idx}.max`}
                    className={classes.multiItemTextField}
                    disabled={disabled}
                    InputProps={{ inputProps: { min, max } }}
                  />
                  {!disabled && (
                    <IconButton
                      onMouseUp={() => remove(idx)}
                      size="small"
                      className={classes.multiItemClose}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </FormControl>
              );
            })}
            {(!disabled || (disabled && !values.length)) && (
              <Button
                disabled={disabled}
                onClick={() => push({ min: defaultMin, max: defaultMax })}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            )}
          </Box>
        );
      }}
    </FieldArray>
  );
}

export function FSelectField({
  name,
  label,
  options,
  fullWidth,
  disabled,
  required,
  ...rest
}) {
  const [field, meta] = useField(name);

  return (
    <FormControl
      fullWidth={fullWidth}
      error={!!(meta.touched && meta.error)}
      disabled={disabled}
      required={required}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select {...field} {...rest} input={<Input />} disabled={disabled}>
        {options.map(option => {
          const isObject = typeof option === "object";
          const value = isObject ? option.value : option;
          const label = isObject ? option.label : option;
          const disabled = isObject ? option.disabled : false;
          return (
            <MenuItem key={value} value={value} disabled={disabled}>
              {label}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText>{meta.touched && meta.error}</FormHelperText>
    </FormControl>
  );
}

export function FAutocompleteField({
  name,
  label,
  options,
  fullWidth,
  disabled,
  ...rest
}) {
  const [field, meta, helpers] = useField(name);

  return (
    <FormControl
      fullWidth={fullWidth}
      error={!!(meta.touched && meta.error)}
      disabled={disabled}
    >
      <Autocomplete
        {...field}
        autoComplete
        disabled={disabled}
        disableCloseOnSelect={Array.isArray(field.value)}
        onChange={(_, value) => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        options={options}
        getOptionLabel={longEm}
        renderInput={params => <TextField {...params} label={label} />}
        {...rest}
      />
      <FormHelperText>{meta.touched && meta.error}</FormHelperText>
    </FormControl>
  );
}

function FSelectMinMaxFieldItem({
  push,
  remove,
  value,
  rangeName,
  classes,
  name,
  disabled,
  minLabel,
  maxLabel,
  min = 0,
  max,
  defaultMin,
  defaultMax
}) {
  const values = value[rangeName] || [];

  useEffect(() => {
    if (!values.length) {
      push({ min: defaultMin, max: defaultMax });
    }
  }, []);

  return (
    <React.Fragment>
      {values.map((pair, idx) => {
        return (
          <FormControl
            className={classes.multiItem}
            key={`${name}.${rangeName}.${idx}`}
            disabled={disabled}
          >
            <FTextField
              size="small"
              type="number"
              autoComplete="off"
              label={minLabel}
              name={`${name}.${rangeName}.${idx}.min`}
              className={classes.multiItemTextField}
              disabled={disabled}
              InputProps={{ inputProps: { min, max } }}
            />
            <ArrowRightIcon className={classes.multiItemArrow} />
            <FTextField
              size="small"
              type="number"
              autoComplete="off"
              label={maxLabel}
              name={`${name}.${rangeName}.${idx}.max`}
              className={classes.multiItemTextField}
              disabled={disabled}
              InputProps={{ inputProps: { min, max } }}
            />
            {!disabled && (
              <IconButton
                size="small"
                onMouseUp={() => remove(idx)}
                className={classes.multiItemClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </FormControl>
        );
      })}
      {(!disabled || (disabled && !values.length)) && (
        <Button
          disabled={disabled}
          startIcon={<AddIcon />}
          onClick={() => push({ min: defaultMin, max: defaultMax })}
        >
          Add
        </Button>
      )}
    </React.Fragment>
  );
}

export function FSelectMinMaxField({
  name,
  selectProps, // must contain name
  rangeName,
  showRangeWhen,
  disabled,
  minLabel = "Min",
  maxLabel = "Max",
  min = 0,
  max,
  defaultMin = 0,
  defaultMax = 10
}) {
  const classes = useStyles();
  const [field] = useField(name);
  const value = field.value || {};

  return (
    <Box>
      <FSelectField
        {...selectProps}
        name={`${name}.${selectProps.name}`}
        className={classes.selectForMinMax}
        disabled={disabled}
      />
      {showRangeWhen(field.value) && (
        <FieldArray name={`${name}.${rangeName}`}>
          {({ push, remove }) => {
            return (
              <FSelectMinMaxFieldItem
                push={push}
                remove={remove}
                name={name}
                value={value}
                classes={classes}
                rangeName={rangeName}
                min={min}
                max={max}
                defaultMin={defaultMin}
                defaultMax={defaultMax}
                minLabel={minLabel}
                maxLabel={maxLabel}
                disabled={disabled}
              />
            );
          }}
        </FieldArray>
      )}
    </Box>
  );
}

export function FMultiTextField({
  name,
  itemName,
  disabled,
  defaultLabel,
  defaultPlaceholder
}) {
  const classes = useStyles();
  const [field] = useField(name);
  const values = field.value || [];

  return (
    <FieldArray name={name}>
      {({ push, remove }) => {
        return (
          <Box>
            {values.map((value, idx) => {
              return (
                <FormControl
                  className={classes.multiItem}
                  key={`${name}.${idx}`}
                  disabled={disabled}
                >
                  <FTextField
                    size="small"
                    autoComplete="off"
                    label={defaultLabel}
                    placeholder={defaultPlaceholder}
                    name={`${name}.${idx}${itemName ? `.${itemName}` : ""}`}
                    className={classes.multiItemTextField}
                    disabled={disabled}
                  />
                  {!disabled && (
                    <IconButton onMouseUp={() => remove(idx)} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </FormControl>
              );
            })}
            {(!disabled || (disabled && !values.length)) && (
              <Button
                disabled={disabled}
                onClick={() => push("")}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            )}
          </Box>
        );
      }}
    </FieldArray>
  );
}

export function FSelectTextField({
  name,
  selectProps, // must contain name
  showWhen,
  disabled,
  fields = [] // each object must contain name
}) {
  const classes = useStyles();
  const [field] = useField(name);

  return (
    <Box>
      <FSelectField
        {...selectProps}
        fullWidth
        name={`${name}.${selectProps.name}`}
        className={classes.selectForMinMax}
        disabled={disabled}
      />
      {showWhen(field.value) &&
        fields.map(field => {
          return (
            <FormControl
              fullWidth
              className={classes.multiItem}
              key={field.name}
              disabled={disabled}
            >
              <FTextField
                fullWidth
                size="small"
                autoComplete="off"
                label={field.label}
                name={`${name}.${field.name}`}
                className={classes.multiItemTextField}
                disabled={disabled}
              />
            </FormControl>
          );
        })}
    </Box>
  );
}
