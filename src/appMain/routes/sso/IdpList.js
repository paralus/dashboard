import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import T from "i18n-react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import RafaySnackbar from "components/RafaySnackbar";
import RafayInfoCard from "components/RafayInfoCard";
import DataTableToolbar from "components/RafayTable/DataTableToolbar";
import DataTable from "components/RafayTable/DataTable";
import { deleteIdentityProvider, getAllIdentityProviders } from "actions/IDPs";

const style = {
  helpText: {
    marginBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "20px",
    paddingTop: "20px",
    paddingBottom: "20px",
    fontStyle: "italic",
    color: "rgb(117, 117, 117)"
  },
  detailLink: {
    color: "teal",
    cursor: "pointer"
  }
};

class IdpList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      tableData: [],
      loading: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    const { getAllIdentityProviders } = this.props;
    getAllIdentityProviders(this.onGetListSuccess);
  }

  onGetListSuccess = response => {
    this.setState({
      tableData: response.data.items,
      loading: false
    });
  };

  handleCreateClick = _ => {
    const { history } = this.props;
    history.push("/main/sso/new");
  };

  handleEditClick = n => {
    const { history } = this.props;
    history.push({
      pathname: `/main/sso/update/${n.metadata.name}`,
      state: n
    });
  };

  onDeleteIdpSuccess = () => {
    const { getAllIdentityProviders } = this.props;
    getAllIdentityProviders(this.onGetListSuccess);
  };

  onDeleteIdpFailure = message => {
    this.setState({
      alertOpen: true,
      alertMessage: message,
      alertSeverity: "error"
    });
  };

  handleDeleteIdp = idpId => {
    const { deleteIdentityProvider } = this.props;
    deleteIdentityProvider(
      idpId,
      this.onDeleteIdpSuccess,
      this.onDeleteIdpFailure
    );
  };

  handleResponseErrorClose = () => {
    this.setState({ alertOpen: false, alertMessage: null });
  };

  parseRowData = data => {
    const confirmText = (
      <span>
        <span>Are you sure you want to delete IdP </span>
        <span style={{ fontWeight: 500, fontSize: "16px" }}>{data.metadata.name}</span>
        <span>?</span>
      </span>
    );
    return [
      {
        type: "regular",
        value: (
          <span
            onClick={() => this.handleEditClick(data)}
            style={style.detailLink}
          >
            {data.metadata.name}
          </span>
        )
      },
      {
        type: "regular",
        value: data.spec.providerName
      },
      {
        type: "regular",
        value: data.spec.callbackUrl
      },
      {
        type: "regular",
        value: data.spec.scopes.join()
      },
      {
        type: "buttons",
        buttons: [
          {
            type: "edit-icon",
            label: "Edit",
            handleClick: () => {
              this.handleEditClick(data);
            }
          },
          {
            type: "danger-icon",
            label: "Delete",
            confirmText,
            handleClick: () => {
              this.handleDeleteIdp(data.metadata.name);
            }
          }
        ]
      }
    ];
  };

  render() {
    const { tableData, alertOpen, alertMessage, alertSeverity } = this.state;
    const AddIdpsButton = (
      <Button
        variant="contained"
        className="jr-btn jr-btn-label left text-nowrap text-white ml-2 mt-2"
        onClick={this.handleCreateClick}
        style={{ marginRight: 8 }}
        color="primary"
        id="new_idp"
      >
        <i className="zmdi zmdi-plus zmdi-hc-fw " />
        <span>New Identity Provider</span>
      </Button>
    );

    const columnLabels = [
      {
        label: "Name"
      },
      {
        label: "Provider"
      },
      {
        label: "Callback URL"
      },
      {
        label: "Scopes"
      },
      {
        label: ""
      }
    ];

    return (
      <div className="app-wrapper">
        <div>
          <h1
            className="p-0"
            style={{ marginBottom: "20px", color: "#ff9800" }}
          >
            Identity Providers
          </h1>

          <p style={style.helpText} className="pt-0">
            Create identity provider (IdP) configurations for users in your
            organization to single sign on to the console
          </p>
          {/* {!tableData.length && (
            <RafayInfoCard
              title={<T.span text="idps.idp_list.no_idps.title" />}
              linkHelper={<T.span text="idps.idp_list.no_idps.helptext" />}
              link={AddIdpsButton}
            />
          )} */}
          <Paper>
            <DataTableToolbar button={AddIdpsButton} />
            <DataTable
              columnLabels={columnLabels}
              list={tableData || []}
              parseRowData={this.parseRowData}
              loading={this.state.loading}
            />
          </Paper>
          <RafaySnackbar
            open={alertOpen}
            message={alertMessage}
            severity={alertSeverity}
            closeCallback={this.handleResponseErrorClose}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ }) => {
  return {
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getAllIdentityProviders,
    deleteIdentityProvider
  })(IdpList)
);
