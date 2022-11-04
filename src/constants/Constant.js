export const Config = {
  autoCloseMobileNav: true,
};

export const INDIGO = "indigo";
export const CYAN = "cyan";
export const AMBER = "amber";
export const DEEP_ORANGE = "deep-orange";
export const PINK = "pink";
export const BLUE = "blue";
export const DEEP_PURPLE = "deep-purple";
export const GREEN = "green";

export const DARK_INDIGO = "dark-indigo";
export const DARK_CYAN = "dark-cyan";
export const DARK_AMBER = "dark-amber";
export const DARK_DEEP_ORANGE = "dark-deep-orange";
export const DARK_PINK = "dark-pink";
export const DARK_BLUE = "dark-blue";
export const DARK_DEEP_PURPLE = "dark-deep-purple";
export const DARK_GREEN = "dark-green";

export const TEAL = "teal";
export const DARK_TEAL = "dark-teal";

export const COLUMN_HEADER_CONFIG = [
  {
    id: "",
    disablePadding: false,
    label: "",
    rule: (e) => true,
  },
  {
    id: "username",
    disablePadding: false,
    label: "Username",
    rule: (e) => true,
  },
  {
    id: "role__name",
    disableSorting: true,
    disablePadding: false,
    label: "Projects",
    rule: (e) => true,
  },
  {
    id: "mfa",
    disablePadding: false,
    disableSorting: true,
    label: "MFA",
    rule: (e) => e.isTotpEnabled,
  },
  {
    id: "user_type",
    disablePadding: false,
    disableSorting: true,
    label: "Type",
    rule: (e) => true,
  },
  {
    id: "last_login",
    disablePadding: false,
    label: "Last Access",
    rule: (e) => true,
  },
  {
    id: "options",
    disablePadding: false,
    disableSorting: true,
    label: "",
    rule: (e) => true,
  },
];

export const MFA_LABELS = ["Enrolled", "Not Enrolled"];

export const USER_TYPE_LABELS = ["API + CONSOLE", "API"];

export const STATUS_INDICATOR_LABEL = {
  true: "ACTIVE",
  false: "INACTIVE",
};

export const IDP_USER_COLUMN_HEADER_CONFIG = [
  {
    id: "",
    disablePadding: false,
    label: "",
  },
  {
    id: "username",
    disablePadding: false,
    label: "Username",
  },
  {
    id: "role__name",
    disableSorting: true,
    disablePadding: false,
    label: "Projects",
  },
  {
    id: "last_login",
    disablePadding: false,
    label: "Last Access",
    rule: (e) => true,
  },
  {
    id: "options",
    disablePadding: false,
    disableSorting: true,
    label: "",
  },
];

export const GROUP_COLUMN_HEADER_CONFIG = [
  {
    id: "",
    disablePadding: false,
    label: "",
  },
  {
    id: "name",
    disablePadding: false,
    disableSorting: true,
    label: "Name",
  },
  {
    id: "roles",
    disablePadding: false,
    disableSorting: true,
    label: "Projects",
  },
  {
    id: "date",
    disablePadding: false,
    disableSorting: true,
    label: "Created At",
  },
  {
    id: "options",
    disablePadding: false,
    label: "",
  },
];

export const ROLE_COLUMN_HEADER_CONFIG = [
  {
    id: "",
    disablePadding: false,
    label: "",
  },
  {
    id: "name",
    disablePadding: false,
    disableSorting: true,
    label: "Name",
  },
  {
    id: "roles",
    disablePadding: false,
    disableSorting: true,
    label: "Permissions",
  },
  {
    id: "options",
    disablePadding: false,
    label: "",
  },
];

export const CRON_EXPRESSION_CONFIG = [
  {
    name: "CronExpressionMinute",
    placeholder: "Minute",
    order: 0,
  },
  {
    name: "CronExpressionHour",
    placeholder: "Hour",
    order: 1,
  },
  {
    name: "CronExpressionDay",
    placeholder: "Day",
    order: 2,
  },
  {
    name: "CronExpressionMonth",
    placeholder: "Month",
    order: 3,
  },
  {
    name: "CronExpressionWeek",
    placeholder: "Week",
    order: 4,
  },
];
