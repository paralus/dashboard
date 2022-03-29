import React, { useState, useEffect } from "react";
import { getProjectList } from "actions/index";
import { Paper } from "@material-ui/core";
import { useSelector } from "react-redux";
import SearchBoxV2 from "components/SearchBoxV2";
import ProjectCard from "./components/ProjectCard";
import NewProject from "./components/NewProject";

const Cards = ({ viewSwitcher }) => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const UserSession = useSelector((state) => state.UserSession);
  const Organization = useSelector((state) => state.settings.organization);

  const getProjects = (_) => {
    getProjectList(100, 0).then((res) => {
      setData(res?.data?.items);
      setLoading(false);
    });
  };

  useEffect((_) => {
    getProjects(100, 0);
  }, []);

  const sortedData = data.sort((a, b) => {
    return a.metadata.name.localeCompare(b.metadata.name, undefined, {
      sensitivity: "base",
    });
  });

  const filteredData =
    searchText.length > 0
      ? sortedData.filter((d) => d.metadata.name.includes(searchText))
      : sortedData;

  return (
    <div id="project-cards-wrapper">
      {sortedData.length > 5 && (
        <Paper
          id="search"
          className="my-2 mx-1 d-flex flex-row justify-content-between p-2"
        >
          <div className="col-md-4 p-0">
            <SearchBoxV2
              placeholder="Search ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div>{viewSwitcher}</div>
        </Paper>
      )}
      <div className="row">
        {!loading && UserSession.visibleAdmin && (
          <NewProject refreshProjects={getProjects} />
        )}
        {filteredData.map((n, index) => (
          <ProjectCard key={index} data={n} refreshProjects={getProjects} />
        ))}
      </div>
    </div>
  );
};

export default Cards;
