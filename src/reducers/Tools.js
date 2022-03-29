const initialData = {
  cliConfigData: null,
};

const Tools = (state = initialData, action) => {
  switch (action.type) {
    case "get_cli_config_data":
      return {
        ...state,
        cliConfigData: action.payload.data,
      };
    default:
      return state;
  }
};

export default Tools;
