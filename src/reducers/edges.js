const initialState = {
  edges: {},
  edgeScope: null,
  orgEdges: [],
};

const EdgesData = (state = initialState, action) => {
  switch (action.type) {
    case "get_edges_success":
      return {
        ...state,
        edges: {
          list: action.payload.data,
        },
      };
    case "get_edges_error":
      return {
        ...state,
        edges: action.payload?.data,
      };
    case "get_metros_success":
      return {
        ...state,
        metros: action.payload.data.results,
      };
    case "get_org_edges_success":
      return {
        ...state,
        orgEdges: action.payload,
      };
    default:
      return state;
  }
};

export default EdgesData;
