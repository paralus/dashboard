import React, { useState } from "react";
import { useSelector } from "react-redux";
import ViewSwitcher from "./ViewSwitcher";
import List from "./List";
import Cards from "./Cards";
import InfoCardComponent from "components/InfoCardComponent";
import NewProject from "appMain/routes/home/Projects/Cards/components/NewProject";

const Projects = () => {
  const [renderInTable, setRenderInTable] = useState(false);

  const projectsList = useSelector((state) => state.Projects?.projectsList);
  const hasProjects =
    Array.isArray(projectsList?.items) && projectsList.items.length > 0;

  const Switcher = (
    <ViewSwitcher
      renderInTable={renderInTable}
      setRenderInTable={setRenderInTable}
    />
  );

  // Empty state handled HERE
  if (!hasProjects) {
    return (
      <div id="projects-wrapper">
        <InfoCardComponent
          title={<span>No Projects Available</span>}
          linkHelper={
            <span>
              There are no projects available. Create one to get started.
            </span>
          }
        />
        <div style={{ marginTop: "24px" }}>
          <NewProject />
        </div>
      </div>
    );
  }

  // Normal state
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
