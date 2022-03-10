import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProviders, updateEdgeProvider } from "actions";
import useLocalStorage from "utils/useLocalStorage";
import {
  MenuItem,
  TextField,
  ListItemText,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Paper
} from "@material-ui/core";

const edgeProviderMap = {
  "aws-eks": 1,
  "aws-ec2": 1,
  "google-gcp": 2,
  "azure-aks": 3
};

const providerTypes = {
  1: "AWS",
  2: "GCP",
  3: "AZURE",
  4: "MINIO",
  "-": "-"
};

function CredentialsDetails({ edge, refreshEdge }) {
  const dispatch = useDispatch();
  const [provider, setProvider] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [changed, setChanged] = useState(false);
  const [cachedProject, _] = useLocalStorage("currentProject");
  const { list } = useSelector(state => state.settingsOps.providers);
  const isProvidersNull = !list?.results?.length;

  const handleSetProvider = id => {
    const provider = list.results.find(p => p.ID === id);
    setProvider(provider);
  };

  useEffect(() => {
    if (isProvidersNull) {
      dispatch(getProviders(cachedProject, 100, 0));
      return;
    }
    if (!changed) handleSetProvider(edge.provider_id);
  }, [edge, list]);

  if (isProvidersNull) return "-";

  const handleProviderChange = e => {
    if (!e.target.value) return;
    setChanged(true);
    handleSetProvider(e.target.value);
  };

  const closeDialog = () => {
    setIsEdit(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    const payload = { ...edge, provider_id: provider.ID };
    dispatch(updateEdgeProvider(payload, cachedProject));
    refreshEdge().then(() => {
      setIsSaving(false);
      closeDialog();
    });
  };

  const edgeProvider = edgeProviderMap[edge.cluster_type];
  const providerType = providerTypes[edgeProvider];
  const currentProvider = list.results.find(p => p.ID === edge.provider_id);

  const getCredentialTypeName = (num, provider) => {
    const credentials_type = [
      {
        label: "ACCESS_KEY",
        value: 0
      },
      {
        label: "ROLE",
        value: 1
      },
      {
        label: "SERVICE_PRINCIPAL",
        value: 2
      }
    ];
    if (provider === 2) {
      return "JSON Credential";
    }
    if (num === undefined) {
      return credentials_type[0].label;
    }
    for (let i = 0; i < credentials_type.length; i++) {
      if (credentials_type[i].value === num) {
        return credentials_type[i].label;
      }
    }
    return "";
  };
  const getMaskedValue = data => {
    const { AccessKey, RoleName, credential_type, provider } = data;
    const TYPE = getCredentialTypeName(credential_type, provider);
    if (TYPE === "ACCESS_KEY") return AccessKey;
    if (TYPE === "ROLE") return RoleName;
    return "-";
  };

  if (isSaving) return <b>Saving, Please Wait...!!</b>;

  if (!currentProvider) return "-";

  return (
    <div>
      <span>
        {`${currentProvider.name} [ Type: ${getCredentialTypeName(
          currentProvider.credential_type,
          currentProvider.provider
        )} ]`}
      </span>

      <Button
        variant="contained"
        size="small"
        color="primary"
        className="ml-4"
        onClick={() => setIsEdit(true)}
      >
        Edit
      </Button>
      <Dialog fullWidth maxWidth="sm" open={isEdit} onClose={closeDialog}>
        <DialogTitle style={{ borderBottom: "1px solid lightgray" }}>
          Edit Cloud Credential
        </DialogTitle>
        <DialogContent>
          <div>
            <p className="text-muted font-italic mt-3 mb-4">
              Select credential from the list below.
            </p>
            <div className="row">
              <div className="offset-md-3 col-md-6 p-0">
                <TextField
                  fullWidth
                  select
                  value={provider.ID}
                  onChange={handleProviderChange}
                >
                  {list.results
                    .filter(i => i.provider === edgeProvider)
                    .map(x => (
                      <MenuItem key={x.ID} value={x.ID}>
                        <ListItemText
                          className="my-0"
                          primary={x.name}
                          secondary={`${providerType} - ${getCredentialTypeName(
                            x.credential_type,
                            x.provider
                          )}`}
                        />
                      </MenuItem>
                    ))}
                </TextField>
              </div>
            </div>
            <div className="row">
              {provider && (
                <Paper elevation={3} className="offset-md-3 col-md-6 p-3 my-3">
                  <h3>Selected Credential</h3>
                  <div>
                    <div>
                      <span className="mr-2 font-weight-bold">Name :</span>
                      <span>{provider.name}</span>
                    </div>
                    <div>
                      <span className="mr-2 font-weight-bold">Provider :</span>
                      <span>{providerType}</span>
                    </div>
                    <div>
                      <span className="mr-2 font-weight-bold">Type :</span>
                      <span>
                        {getCredentialTypeName(
                          provider.credential_type,
                          provider.provider
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="mr-2 font-weight-bold">Detail :</span>
                      <span>{getMaskedValue(provider)}</span>
                    </div>
                  </div>
                </Paper>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ borderTop: "1px solid lightgray" }}>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CredentialsDetails;
