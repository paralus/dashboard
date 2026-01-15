import * as Yup from "yup";

export const LABEL_REGEX = new RegExp(
  "^[A-Za-z0-9]([A-Za-z0-9\\._-]*[A-Za-z0-9])?$"
);

const labelSchema = {
  key: Yup.string()
    .test(
      "is-paralus.dev/",
      "prefix can't be paralus.dev/",
      (value) => !value?.startsWith("paralus.dev/")
    )
    .test("required-key", "required", (value) => !!value)
    .test("validate-key", "invalid key", (value) => {
      if (!value) return false;

      //  split the prefix/name by '/' and test against regex seperately
      const [prefix, ...name] = value?.split("/");
      const noPrefix = prefix && !name.length;
      //  if no prefix ? test key against regex : test key and prefix
      return noPrefix
        ? LABEL_REGEX.test(prefix)
        : LABEL_REGEX.test(prefix) && LABEL_REGEX.test(name.join());
    })
    .test(
      "validate-prefix-length",
      "prefix exceeds 253 characters",
      (value) => {
        if (!value) return false;

        const [prefix, ...name] = value?.split("/");
        const prefixExists = prefix && name.length;
        //  if prefix Exists ? length shouldn't exceed 253 characters : skip
        return prefixExists ? prefix.length <= 253 : true;
      }
    )
    .test("validate-key-length", "key exceeds 63 character", (value) => {
      if (!value) return false;

      const [prefix, ...name] = value?.split("/");
      const noPrefix = prefix && !name.length;
      //  if no prefix ? length of name shouldn't exceed 63 characters : skip
      return noPrefix ? prefix.length <= 63 : true;
    }),
  value: Yup.string()
    .max(63, "exceeds 63 charaters")
    .matches(LABEL_REGEX, "Invalid value")
    .nullable(),
};

const effectSchema = {
  effect: Yup.string().default("PreferNoSchedule").required("Required"),
};

const makeSchemaList = (key, schema) => {
  return Yup.object().shape({
    [key]: Yup.array().of(Yup.object().shape(schema)),
  });
};

export const LABELS_SCHEMA = makeSchemaList("labels", labelSchema);

export const TAINTS_SCHEMA = makeSchemaList("taints", {
  ...labelSchema,
  ...effectSchema,
});

const TAGS_REGEX = /^[\d\w\s+\-=\.:\/@]+$/;

const tagsSchema = {
  key: Yup.string()
    .required("Required")
    .max(128, "exceeds 128 charaters")
    .matches(TAGS_REGEX, "invalid symbol used"),
  value: Yup.string()
    .required("Required")
    .max(256, "exceeds 256 charaters")
    .matches(TAGS_REGEX, "invalid symbol used"),
};

export const TAGS_SCHEMA = makeSchemaList("labels", tagsSchema);
