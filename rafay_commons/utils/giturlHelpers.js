const SUPPORTED_RESOURCES = ["gitlab", "github"];

const getProtocols = input => {
  const index = input.indexOf("://");
  const splits = input
    .substring(0, index)
    .split("+")
    .filter(Boolean);
  return splits || [];
};

const isSsh = input => {
  if (Array.isArray(input)) {
    return input.indexOf("ssh") !== -1 || input.indexOf("rsync") !== -1;
  }

  if (typeof input !== "string") {
    return false;
  }

  const prots = getProtocols(input);
  input = input.substring(input.indexOf("://") + 3);
  if (isSsh(prots)) {
    return true;
  }
  const urlPortPattern = new RegExp(".([a-zA-Z\\d]+):(\\d+)/");
  return (
    !input.match(urlPortPattern) && input.indexOf("@") < input.indexOf(":")
  );
};

const getResource = url => {
  const protocol = getProtocols(url)[0];
  if (!protocol?.trim() && !isSsh(url)) return null;

  const protocolIndex = url.indexOf("://");
  if (protocolIndex !== -1) {
    url = url.substring(protocolIndex + 3);
  }
  const parts = url.split(/\/|\\/);
  let splits = [];
  let resource = parts.shift();

  // user@domain
  splits = resource.split("@");
  if (splits.length === 2) {
    resource = splits[1];
  }

  // domain.com:port
  splits = resource.split(":");
  if (splits.length === 2) {
    resource = splits[0];
  }

  return resource;
};

const isGitUrl = str => {
  const regex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\/?|\#[-\d\w._]+?)$/;
  const resource = getResource(str);
  const resourceSupported = SUPPORTED_RESOURCES.reduce(
    (prev, current) => resource.includes(prev) || resource.includes(current),
    false
  );
  return regex.test(str) && resourceSupported;
};

export const openWindowGitUrl = (
  endpoint,
  branch,
  errorCallBack,
  path = null
) => {
  if (!endpoint?.length)
    return errorCallBack("Endpoint is not set for repository.");
  if (!isGitUrl(endpoint))
    return errorCallBack("The Selected action is not applicable.");

  endpoint = endpoint.split(".git")[0];
  if (isSsh(endpoint)) {
    const ownerUrl = endpoint.split("@")[1];
    const provider = ownerUrl.split(":")[0];
    const owner = ownerUrl.split(":")[1];
    endpoint = `${provider}/${owner}`;
  } else if (endpoint.includes("https")) {
    endpoint = endpoint.split("https://")[1];
  }

  let url = `https://${endpoint}`;
  if (branch?.trim()) {
    url += path && path?.trim() ? `/blob/${branch}/${path}` : `/tree/${branch}`;
  }
  window.open(url, "_blank");
};
