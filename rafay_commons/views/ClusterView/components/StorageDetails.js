import React from "react";

export default function StorageDetails({ node }) {
  let device =
    node &&
    node.storage_devices_all &&
    node.storage_devices_all[node?.storage_device_loc];
  device = device?.substring(device.indexOf(",") + 1, device.length);
  return (
    <div className="col-md-4">
      <div className="row mb-2">
        {node.ipv4_interface && (
          <>
            <div className="col-sm-5">
              <span className="mr-4">Interface</span>
            </div>
            <div className="col-sm-7">
              <span>
                {`${Object.keys(node.ipv4_interface)} : ${Object.values(
                  node.ipv4_interface
                )}`}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="row mb-2">
        {node.storage_device_loc && (
          <>
            <div className="col-sm-5">
              <span className="mr-4">Storage Devices</span>
            </div>
            <div className="col-sm-7">
              <span>
                {node.storage_device_loc} {device}
              </span>
              {node?.additional_storage_devices?.map(device => (
                <div>{device}</div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
