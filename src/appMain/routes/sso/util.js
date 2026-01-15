// TODO: Need to add to utils after the branch gets merged

export function downloadCertificate(text, name, type) {
  const file = new Blob([text], { type });
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", URL.createObjectURL(file));
  downloadAnchorNode.setAttribute(
    "download",
    `${name.toLocaleLowerCase().replace(/\s/g, "-")}-certificate.pem`,
  );
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
