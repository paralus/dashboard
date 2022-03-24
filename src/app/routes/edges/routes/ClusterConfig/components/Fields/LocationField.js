import { getMetros } from "actions/index";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

const LocationField = (props) => {
  const metroList = useSelector((state) => state.settings.metroList);
  const dispatch = useDispatch();
  useEffect((_) => {
    dispatch(getMetros());
  }, []);
  if (!metroList) return null;
  const locationList = metroList.map((option) => {
    return {
      label: `${option.name} (${option.city}, ${option.state}, ${option.country})`,
      value: option.name,
    };
  });

  const defaultLocationValue = () => {
    if (props.edge?.spec.Metro?.name?.length > 0) {
      return locationList.find((e) => {
        if (e.value === props.edge.spec.Metro.name) {
          return e;
        }
        return null;
      });
    }
    return null;
  };

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const groupBadgeStyles = {
    backgroundColor: "#EBECF0",
    borderRadius: "2em",
    color: "#172B4D",
    display: "inline-block",
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: "1",
    minWidth: 1,
    padding: "0.16666666666667em 0.5em",
    textAlign: "center",
  };
  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span style={{ color: "teal" }}>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );
  let customLocations = [];
  let defaultLocations = [];
  // if (['ADMIN', 'OPERATIONS'].includes(props.userRole)) {
  customLocations = locationList.filter((l) => l.organization_id);
  defaultLocations = locationList.filter((l) => !l.organization_id);
  // }
  const groupedOptions = [
    {
      label: "CUSTOM LOCATIONS",
      options: customLocations,
    },
    {
      label: "DEFAULT LOCATIONS",
      options: defaultLocations,
    },
  ];
  const selectElement = (
    <Select
      placeholder="Search locations ..."
      options={groupedOptions}
      formatGroupLabel={formatGroupLabel}
      defaultValue={defaultLocationValue()}
      menuPlacement="auto"
      isClearable
      maxMenuHeight={200}
      onChange={props.handleEdgeChange("metro")}
    />
  );
  return (
    <>
      <div className="row" style={{ marginTop: "10px" }}>
        <div className="col-sm-4 text-muted" style={{ marginTop: "10px" }}>
          <span>Location</span>
        </div>
        <div className="col-sm-8">{selectElement}</div>
      </div>
      {props.metroNotConfigured && (
        <div className="col-md-12 text-danger mt-3">*Location is required.</div>
      )}
    </>
  );
};

export default LocationField;
