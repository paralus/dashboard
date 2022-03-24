import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import IdleTimer from "react-idle-timer";
import { userLogout, getOrganization } from "actions/index";

const AutoLogout = () => {
  const dispatch = useDispatch();

  const [idleLogoutTime, setIdleLogoutTime] = useState(null);

  const { idleLogoutTimeProp } = useSelector((state) => {
    return {
      idleLogoutTimeProp:
        state.settings?.organization?.detail?.spec?.settings?.idleLogoutTime,
    };
  });

  useEffect(() => {
    if (idleLogoutTimeProp) setIdleLogoutTime(idleLogoutTimeProp);
  }, []);

  const handleOnIdle = () => {
    dispatch(userLogout(true));
  };

  if (!idleLogoutTime) {
    return null;
  }

  return (
    <IdleTimer
      timeout={idleLogoutTime * 1000 * 60}
      onIdle={handleOnIdle}
      crossTab={{
        emitOnAllTabs: true,
      }}
      stopOnIdle={true}
    />
  );
};

export default AutoLogout;
