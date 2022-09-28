import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, Chip, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  chips: {
    flexDirection: "row",
    margin: "5px",
    maxWidth: 300,
  },
  chip: {
    margin: "2px",
  },
  listItem: {
    padding: theme.spacing(1, 1),
  },
  leftCard: {
    minWidth: 300,
    minHeight: 230,
    maxHeight: 500,
    padding: "20px",
  },
  selectWidth: { width: 300, whiteSpace: "break-spaces" },
}));

const NamespaceCard = ({
  selectedProject,
  selectedNamespaces,
  onNamespacesChange,
}) => {
  const classes = useStyles();
  const { id: projectId } = selectedProject;
  const [selectedNs, setSelectedNamespaces] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [fieldText, setFieldText] = useState("");
  const projectRef = useRef(projectId);

  const projectNamespaces = [];
  const thisProjectNamespaces = projectNamespaces?.[projectId]?.items;

  const getNamespaceLabel = (id, projectId) => {
    const namespace = thisProjectNamespaces?.find((x) => x.metadata.id === id);
    if (namespace) {
      return namespace?.metadata?.name;
    }

    return null;
  };

  const initialiseSelectedNamespaces = () => {
    const ns = [];
    selectedNamespaces.forEach((nsId) => {
      const namespace = namespaces?.find((ns) => ns?.id === nsId);
      let nsLabel = {};
      if (!namespace)
        nsLabel = {
          id: nsId,
          label: getNamespaceLabel(nsId, selectedProject.id),
        };
      ns.push(!namespace ? nsLabel : namespace);
    });

    const uniqueNamespaces = [
      ...new Map(
        [...selectedNs, ...ns].map((item) => [item.id, item])
      ).values(),
    ];
    setSelectedNamespaces(uniqueNamespaces);
  };

  const getNamespaceListByText = () => {
    setNamespaces([]);
  };

  useEffect(() => {
    getNamespaceListByText();
  }, [fieldText]);

  useEffect(() => {
    initialiseSelectedNamespaces();
  }, [thisProjectNamespaces, selectedNamespaces]);

  useEffect(() => {
    if (projectRef.current !== projectId) {
      setSelectedNamespaces([]);
      onNamespacesChange({ target: { value: [] } });
      projectRef.current = projectId;
    }
  }, [projectId]);

  function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }

  function checkValidNamespaceLength(str) {
    if (str.length >= 4 && str.length <= 64) return true;
    else return false;
  }

  function checkDuplicateInArray(str, arr) {
    if (arr.includes(str)) return true;
    else return false;
  }

  const NamespaceInput = (props) => {
    const [namespaceTags, setNamespaceTags] = useState(props.tags);
    const [namespaceError, setNamespaceError] = useState(false);
    const [namespaehelpertext, setNamespaehelpertext] = useState(
      "Provide namespace name(s), each followed by ENTER↵"
    );

    function CheckNamespaceValidation(str) {
      if (
        checkValidNamespaceLength(str) === true &&
        containsSpecialChars(str) === false &&
        checkDuplicateInArray(str, namespaceTags) === false
      ) {
        setNamespaceError(false);
        setNamespaehelpertext(
          "Provide namespace name(s), each followed by ENTER↵"
        );
        return true;
      } else {
        setNamespaceError(true);
        setNamespaehelpertext(
          "No special char. allowed & length between 4-64 characters."
        );
        return false;
      }
    }

    const removeNamespaceNew = (indexToRemove) => {
      let tempTags = namespaceTags;
      tempTags = tempTags.splice(indexToRemove, 1);
      setNamespaceTags(tempTags);
      onNamespacesChange({ target: { value: namespaceTags } });
    };

    const addNamespace = (event) => {
      if (CheckNamespaceValidation(event.target.value)) {
        const tempTags = namespaceTags;
        namespaceTags.push(event.target.value);
        setNamespaceTags(tempTags);
        event.target.value = "";
        onNamespacesChange({ target: { value: namespaceTags } });
      }
    };

    return (
      <div>
        <div className={classes.chips}>
          {namespaceTags.map((namespace, index) => (
            <Chip
              key={index}
              className={classes.chip}
              label={namespace}
              onDelete={() => removeNamespaceNew(index)}
            />
          ))}
        </div>
        <TextField
          label="Namespace"
          variant="standard"
          error={namespaceError}
          helperText={namespaehelpertext}
          onKeyUp={(event) =>
            event.key === "Enter" ? addNamespace(event) : null
          }
          fullWidth
        />
      </div>
    );
  };

  return (
    <Card className={classes.leftCard} elevation={0} variant="outlined">
      <Grid
        container
        direction="column"
        justify="space-evenly"
        alignItems="stretch"
      >
        <Grid item>
          <NamespaceInput tags={selectedNamespaces} />
        </Grid>
      </Grid>
    </Card>
  );
};

export default NamespaceCard;
