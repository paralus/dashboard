// FIXME(Muhammad Kasim): Use the original numeraljs library instead, create custom formatters for it if have to.
/* eslint-disable no-underscore-dangle */
import * as R from "ramda";
import { fixExponential } from "utils";

const dateFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};
// TODO: Fallback to natural falsy values.

const FORMATS = ["a", "b", "B", "%"];
const BEFORE_POINT_REGEX = /^-?\d*/;
const AFTER_POINT_REGEX = /.\d*(e[+|-]\d)?$/;
const floater = (x) => parseFloat(x);
const readBeforePoint = R.pipe(
  (x) => Number(x).toFixed(20),
  R.match(BEFORE_POINT_REGEX),
  R.head,
  R.when((x) => R.equals("String", R.type(x)), floater),
  R.defaultTo(0),
);
const readAfterPoint = R.pipe(
  (x) => Number(x).toFixed(20),
  R.match(AFTER_POINT_REGEX),
  R.head,
  R.when((x) => R.equals("String", R.type(x)), floater),
  R.defaultTo(0),
);
const getLongDash = () => "—";
const equalsDash = R.equals(R.__, getLongDash());
const defaultToDash = R.pipe(
  parseFloat,
  R.when(Number.isNaN, R.always(getLongDash())),
);
const getPreciseRegex = (p) => new RegExp(`^-?[0-9]*.?0*[0-9]{0,${p}}`);
const getFixedRegex = (p) => new RegExp(`^-?[0-9]*.?[0-9]{0,${p}}`);
export const NAN_FALLBACK = {
  value: getLongDash(),
  unit: "",
};
const getPrecisionPoint = R.pipe(
  R.dec,
  R.max(0),
  R.repeat("0"),
  R.append("1"),
  R.concat(["0", "."]),
  R.join(""),
  floater,
);

const UNITS = {
  a: {
    "": 1,
    K: 1000 ** 1,
    M: 1000 ** 2,
    B: 1000 ** 3,
    T: 1000 ** 4,
    P: 1000 ** 5,
    E: 1000 ** 6,
  },
  b: {
    b: 1,
    Kb: 1000 ** 1,
    Mb: 1000 ** 2,
    Gb: 1000 ** 3,
    Tb: 1000 ** 4,
    Pb: 1000 ** 5,
    Eb: 1000 ** 6,
  },
  B: {
    B: 1,
    KB: 1000 ** 1,
    MB: 1000 ** 2,
    GB: 1000 ** 3,
    TB: 1000 ** 4,
    PB: 1000 ** 5,
    EB: 1000 ** 6,
  },
};

const CONVERTERS = {
  a(v) {
    const number = Math.max(
      0,
      Math.floor(Math.log(Math.abs(v)) / Math.log(1000)),
    );
    const unit = Object.keys(UNITS.a)[number];
    const denominator = UNITS.a[unit];
    const value = v / denominator;

    return { value, unit };
  },
  b(v) {
    const number = Math.max(
      0,
      Math.floor(Math.log(Math.abs(v * 8)) / Math.log(1000)),
    );
    const unit = Object.keys(UNITS.b)[number];
    const denominator = UNITS.b[unit];
    const value = (v * 8) / denominator;

    return { value, unit };
  },
  B(v) {
    const number = Math.max(
      0,
      Math.floor(Math.log(Math.abs(v)) / Math.log(1000)),
    );
    const unit = Object.keys(UNITS.B)[number];
    const denominator = UNITS.B[unit];
    const value = v / denominator;

    return { value, unit };
  },
  "%": (v) => {
    return {
      value: v * 100,
      unit: "%",
    };
  },
};
const PRE_CONVERTERS = {
  b: (x) => x * 8,
};
const getMatch = (regex, str) => {
  const _x = str.match(regex);
  return _x ? _x[0] : "";
};
const roundingFunction = R.curry((precision, isFixed, value) => {
  const beforePoint = readBeforePoint(value);
  const afterPoint = readAfterPoint(value);
  const precisionPoint = getPrecisionPoint(precision);
  let regex;

  if (isFixed) {
    regex = getFixedRegex(precision);
  } else if (beforePoint !== 0 && afterPoint < precisionPoint) {
    regex = getFixedRegex(precision);
  } else {
    regex = getPreciseRegex(precision);
  }

  const _x = value.toFixed(20).match(regex);
  return _x ? floater(_x[0]) : value;
});
const getPrefixFormatPostfix = (format) => {
  const prefixRegex = /^\([\s.A-Za-z/]*\)/;
  const postfixRegex = /\([\s.A-Za-z/]*\)$/;
  const _prefix = getMatch(prefixRegex, format);
  const _postfix = getMatch(postfixRegex, format);
  const _onlyFormat = format.replace(_prefix, "").replace(_postfix, "");

  return {
    _prefix: _prefix.replace(/[()]*/g, ""),
    _postfix: _postfix.replace(/[()]*/g, ""),
    _onlyFormat,
  };
};

// EXPORTS
/**
 * For formatting and manipulating numbers.
 * @param  {number|string} value - Value to convert
 * @param  {string} format - Format string containing precision, conversion type, pre-and-postfix
 * @param  {boolean} fixed - Enables fixed conversion, default mode is precise conversion
 * @param  {string} unit - Fix unit for conversion
 * @param  {boolean} stringy - Whether to return a string or object
 * @returns {object|string} Returns an object if stringy is false.
 */
export const numeral = R.curry((value, format, fixed, unit, stringy) => {
  const _value = defaultToDash(value);
  const { _prefix, _postfix, _onlyFormat } = getPrefixFormatPostfix(format);
  const _format = _onlyFormat.slice(-1);
  const _space = _onlyFormat.includes(" ");

  if (equalsDash(_value) || !FORMATS.includes(_format) || !format) {
    return stringy ? getLongDash() : NAN_FALLBACK;
  }

  const regex = new RegExp(`\\s?${_format}`);
  const ghost = _onlyFormat.replace(regex, "");
  const precision = ghost.includes(".")
    ? ghost.split(".").slice(-1)[0].trim().length
    : 0;
  const converterFn = CONVERTERS[_format];
  const preConverter = PRE_CONVERTERS[_format];
  const applyRoundingFunction = R.evolve({
    value: roundingFunction(precision, fixed),
  });
  const addPrefixPostfix = R.evolve({
    unit: R.pipe(R.concat(_prefix), R.concat(R.__, _postfix)),
  });
  let converted = {};
  let numeralString = "";

  if (unit && UNITS[_format]) {
    converted = applyRoundingFunction({
      value:
        (preConverter ? preConverter(_value) : _value) / UNITS[_format][unit],
      unit,
    });
  } else {
    converted = applyRoundingFunction(converterFn(_value));
  }

  converted = addPrefixPostfix(converted);

  if (stringy) {
    numeralString = [converted.value, converted.unit].join(
      _space && converted.unit ? " " : "",
    );
  }

  return stringy ? numeralString : converted;
});

/**
 * Formats the value according to the format; or converts the value in the provided unit before
 * formatting.
 * @param  {number|string} value - Value to convert
 * @param  {string} format - Format string containing precision, conversion type, pre-and-postfix
 * @param  {boolean} fixed - Enables fixed conversion, default mode is precise conversion
 * @param  {string} unit - Fix unit for conversion
 * @returns {object} Returns an object where the keys are value and unit.
 */
export function converter(value, format = "0.0 a", fixed = false, unit = "") {
  return numeral(value, format, fixed, unit, false);
}

/**
 * Formats the value according to the format; or converts the value in the provided unit before
 * formatting.
 * @param  {number|string} value - Value to convert
 * @param  {string} format - Format string containing precision, conversion type, pre-and-postfix
 * @param  {boolean} fixed - Enables fixed conversion, default mode is precise conversion
 * @param  {string} unit - Fix unit for conversion
 * @returns {object} Returns a string conforming with the provided format.
 */

export function formatter(value, format = "0.0 a", fixed = false, unit = "") {
  return numeral(fixExponential(Number(value)), format, fixed, unit, true);
}

export function dateFormatter(date, standard) {
  return new Intl.DateTimeFormat(standard, dateFormatOptions).format(
    new Date(date),
  );
}
