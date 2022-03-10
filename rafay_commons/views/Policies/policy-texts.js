import * as R from "ramda";

export const REQUIRED = "Required";
export const NOT_SMALLER = min => `Shouldn't be smaller than ${min}`;
export const NOT_GREATER = max => `Shouldn't be greater than ${max}`;
export const NO_WILDCARD = "Either select all (∗) or specific options.";
