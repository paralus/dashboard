import React, { useState } from "react";
import ViewSwitcher from "./ViewSwitcher";
import List from "./List";
import Cards from "./Cards";

const Projects = () => {
  const [renderInTable, setRenderInTable] = useState(false);

  const Switcher = (
    <ViewSwitcher
      renderInTable={renderInTable}
      setRenderInTable={setRenderInTable}
    />
  );

  return (
    <div id="projects-wrapper">
      {renderInTable ? (
        <List viewSwitcher={Switcher} />
      ) : (
        <Cards viewSwitcher={Switcher} />
      )}
    </div>
  );
};

export default Projects;
