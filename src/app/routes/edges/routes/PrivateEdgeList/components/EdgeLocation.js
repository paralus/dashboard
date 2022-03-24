import React from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps";

const wrapperStyles = {
  minWidth: 700,
  marginLeft: "inherit",
  maxWidth: 980,
};

const colourOptions = [
  {
    label: "READY",
    value: "READY",
    color: "#1cbcaa",
  },
  {
    label: "CREATED",
    value: "CREATED",
    color: "blue",
  },
  {
    label: "NOT_CREATED",
    value: "NOT_CREATED",
    color: "gray",
  },
  {
    label: "NOT_READY",
    value: "NOT_READY",
    color: "purple",
  },
  {
    label: "MAINTENANCE",
    value: "MAINTENANCE",
    color: "orange",
  },
  {
    label: "SUSPENDED",
    value: "SUSPENDED",
    color: "violet",
  },
  {
    label: "DELETED",
    value: "DELETED",
    color: "red",
  },
];

class EdgeLocation extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: "asc",
      orderBy: "name",
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 25,
      offset: 0,
      count: 5,
      open: false,
      isResponseError: false,
      edge: {},
      edges: [],
      organizations: [],
      edges_committed: [],
      isEdgeNotFound: false,
      edgeNotFoundErrorMessage: "",
      searchText: "",
      searchStatus: "&status=READY",
      showSpinner: true,
      renderMarkers: [],
      ids: {},
    };

    this.reader = null;
  }

  componentDidMount() {
    this.drawMarkers();
  }

  drawMarkers() {
    this.state.renderMarkers = [];
    console.log("this.state.edges", this.state.edges);

    let Color = "orange";
    if (this.props.edge.latitude !== "invalid") {
      if (this.props.edge.status) {
        const c = colourOptions.find(
          (x) => x.value === this.props.edge.status.toUpperCase()
        );
        if (c) {
          Color = c.color;
        }
      }
    }

    this.state.renderMarkers.push({
      coordinates: [
        parseFloat(this.props.edge.longitude),
        parseFloat(this.props.edge.latitude),
      ],
      color: Color,
      edge_id: this.props.edge.edge_id,
      display_name: this.props.edge.display_name,
      id: this.props.edge.id,
      city: this.props.edge.city,
      locale: this.props.edge.locale,
      status: this.props.edge.status,
      cores: this.props.edge.committed_cores
        ? `${this.props.edge.committed_cores}/${this.props.edge.total_cores}`
        : "N/A",
      memory: this.props.edge.committed_memory
        ? `${this.props.edge.committed_memory}/${this.props.edge.total_memory}`
        : "N/A",
    });

    this.setState({ ...this.state });
    console.log("drawMarkers", this.props.edge, this.state.renderMarkers);
  }

  render() {
    const { order, orderBy, selected, rowsPerPage, page } = this.state;

    const { match } = this.props;

    const roles = [];

    if (!this.state.edges) {
      return null;
    }

    return (
      <div style={wrapperStyles} id="map">
        <ComposableMap
          projectionConfig={{
            scale: 205,
            rotation: [-11, 0, 0],
          }}
          width={980}
          height={551}
          style={{
            width: "100%",
            height: "450px",
            marginLeft: "-50px",
          }}
        >
          <ZoomableGroup center={[0, 20]} disablePanning>
            <Geographies geography="/world-50m.json">
              {(geographies, projection) =>
                geographies.map(
                  (geography, i) =>
                    geography.id !== "ATA" && (
                      <Geography
                        key={i}
                        geography={geography}
                        projection={projection}
                        style={{
                          default: {
                            fill: "#ffffff", // #ECEFF1
                            stroke: "#d9dadb", // #d9dadb  #607D8B
                            strokeWidth: 1,
                            outline: "none",
                          },
                          hover: {
                            fill: "#ffffff", // CFD8DC
                            stroke: "#d9dadb", // 607D8B
                            strokeWidth: 0.75,
                            outline: "none",
                          },
                          pressed: {
                            fill: "#ffffff", // FF5722
                            stroke: "#d9dadb", // 607D8B
                            strokeWidth: 0.75,
                            outline: "none",
                          },
                        }}
                      />
                    )
                )
              }
            </Geographies>
            <Markers>
              {this.state.renderMarkers.map((marker, i) => (
                <Marker
                  key={i}
                  marker={marker}
                  style={{
                    default: { stroke: "black" },
                    hover: { stroke: "#FF5722" },
                    pressed: { stroke: "#FF5722" },
                  }}
                >
                  <svg
                    version="1.1"
                    id={`Popover-${marker.id}`}
                    xmlns="http://www.w3.org/2000/svg"
                    x="-16px"
                    y="-32px"
                    height="28px"
                    width="34px"
                    viewBox="0 0 54.757 54.757"
                    cursor="pointer"
                  >
                    <path
                      d="M40.94,5.617C37.318,1.995,32.502,0,27.38,0c-5.123,0-9.938,1.995-13.56,5.617c-6.703,6.702-7.536,19.312-1.804,26.952
                                                L27.38,54.757L42.721,32.6C48.476,24.929,47.643,12.319,40.94,5.617z M27.557,26c-3.859,0-7-3.141-7-7s3.141-7,7-7s7,3.141,7,7
                                                S31.416,26,27.557,26z"
                      fill={marker.color}
                      strokeWidth="1"
                    />
                  </svg>
                </Marker>
              ))}
            </Markers>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    );
  }
}

export default EdgeLocation;
