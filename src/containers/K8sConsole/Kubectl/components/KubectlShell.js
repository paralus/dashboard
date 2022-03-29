import React, { useState, useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
import useLocalStorage from "utils/useLocalStorage";
import InfoCard from "./InfoCard";

const Shell = ({
  project,
  clusterName,
  namespace,
  reloadShell,
  command,
  isLogsOnly,
}) => {
  const container = useRef(null);
  const [fontSize] = useLocalStorage("kubectlFontSize", 12);
  // term.setOption('disableStdin', false);
  const term = new Terminal({
    fontSize,
    cursorBlink: true,
    disableStdin: !!isLogsOnly,
  });
  const [infoOpen, setInfoOpen] = useState(true);
  const [infoType, setInfoType] = useState("loading");

  const loc = window.location;
  let wsURL = `wss://${loc.host}`;
  wsURL = "ws://localhost:7009";
  if (isLogsOnly) {
    wsURL += `/v2/debug/getlogs/project/${project}/cluster/${clusterName}`;
  } else {
    wsURL += `/v2/debug/prompt/project/${project}/cluster/${clusterName}`;
  }
  useEffect(() => {
    console.log("Init Component");
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(container.current);
    fitAddon.fit();

    wsURL += `?rows=${term.rows}&cols=${term.cols}`;
    if (namespace) {
      wsURL += `&namespace=${namespace}`;
    }
    if (command) {
      wsURL += `&cargs=${command}`;
    }

    const socket = new WebSocket(wsURL, "binary");
    socket.onopen = (_) => {
      const attachAddon = new AttachAddon(socket);
      term.loadAddon(attachAddon);
      term.focus();
      container.current.focus();
      setInfoOpen(false);
      setInfoType("");
    };
    socket.onerror = (e) => {
      setInfoOpen(true);
      setInfoType("error");
      console.log("Connection Error", e);
    };
    return () => {
      console.log("Closing Connection");
      socket.close();
    };
  }, []);
  return (
    <>
      <div
        id="kubectl-shell"
        style={{ height: "calc(100% - 70px)" }}
        ref={container}
      />
      <InfoCard open={infoOpen} type={infoType} reloadShell={reloadShell} />
    </>
  );
};

const KubectlShell = ({
  project,
  clusterName,
  namespace,
  reload,
  command,
  isLogsOnly,
}) => {
  const [tmp, setTmp] = useState(false);
  const reloadShell = () => {
    setTmp(true);
    setTimeout(() => setTmp(false), 100);
  };
  useEffect(() => {
    if (reload > 0) {
      setTmp(true);
      setTimeout(() => setTmp(false), 100);
    }
  }, [reload]);
  if (tmp) return null;
  return (
    <Shell
      project={project}
      clusterName={clusterName}
      namespace={namespace}
      reloadShell={reloadShell}
      command={command}
      isLogsOnly={isLogsOnly}
    />
  );
};

export default KubectlShell;
