import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";

import { parsePgDateToString, sortSymphoniesByName } from "../utils/functions";
import LoadingContent from "./LoadingContent";
import GetBackButton from "../components/GetBackButton";
import { fetchPremieresByComposer, fetchSymphoniesByComposerId, fetchComposerById } from "../api/request";
import Language from "../lang/Language.jsx";

const Composer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { lng } = Language();

  const [premieres, setPremieres] = useState([]);
  const [symphonies, setSymphonies] = useState([]);
  const [composer, setComposer] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const composerId = useMemo(() => params.composerid ?? undefined, [params.composerid]);

  useEffect(() => {
    const fetchByComposer = async () => {
      let symphs = [];
      let prems = [];
      let comp = null;

      setPageLoading(true);
      await Promise.all([
        await fetchSymphoniesByComposerId(composerId).then((res) => (symphs = res.result)),
        await fetchPremieresByComposer(composerId).then((res) => (prems = res.result)),
        await fetchComposerById(composerId).then((res) => (comp = res.result)),
      ]);
      setPageLoading(false);

      setSymphonies(symphs ?? []);
      setPremieres(prems ?? []);
      setComposer(comp);
    };
    fetchByComposer();
  }, [composerId]);

  const concertsString = (value) => {
    let txt = `(${value.concerts.length}`;
    if (value.concerts.length > 1) {
      txt = txt.concat(` ${lng("some_concerts")}`);
    } else {
      txt = txt.concat(` ${lng("concert")}`);
    }
    txt = txt.concat(")");
    return txt;
  };

  const changeTab = (event, newValue) => {
    setTabValue(newValue);
    setSearchInput("");
  };

  const premieresTabDisabled = premieres.length === 0;
  const symphoniesLabel = lng("symhponies_tab", { value: symphonies.length });
  const premieresLabel = lng("premieres_tab", { value: premieres.length });

  const changeSearchHandle = (event) => {
    setSearchInput(() => event.target.value);
  };

  return (
    <div className="page">
      <GetBackButton />
      <div style={{ margin: "auto" }}>
        <LoadingContent loading={pageLoading}>
          <div style={{ marginTop: "1rem" }}>
            <div>
              {lng("composer")}: {composer?.name}
            </div>
          </div>
          <Tabs
            sx={{ marginTop: "2rem" }}
            indicatorColor="secondary"
            textColor="secondary"
            value={tabValue}
            onChange={changeTab}
          >
            <Tab label={symphoniesLabel} />
            <Tab label={premieresLabel} disabled={premieresTabDisabled} />
          </Tabs>
          {tabValue === 0 && (
            <>
              <div style={{ marginTop: "1rem" }}>
                <TextField
                  sx={{ width: "100%", maxWidth: 300 }}
                  label={lng("filter_name_search")}
                  variant="standard"
                  color="secondary"
                  onChange={(event) => changeSearchHandle(event)}
                />
              </div>
              <List>
                {symphonies
                  .filter((symph) => symph.name.toLowerCase().includes(searchInput.toLowerCase()))
                  .sort(sortSymphoniesByName)
                  .map((symph, index) => {
                    let textValue = `${symph.name}`;
                    if (symph.arrangers) {
                      textValue = textValue.concat(` (${symph.arrangers.names})`);
                    }
                    const concertsText = concertsString(symph);
                    const firstConcert = symph.concerts[0];
                    const buttonElement =
                      symph.concerts?.length === 1 ? (
                        <Button
                          color="secondary"
                          onClick={() => navigate(`/concert/concertid/${firstConcert.id}`)}
                          variant="outlined"
                        >
                          {lng("open")}
                        </Button>
                      ) : (
                        <Button
                          color="secondary"
                          onClick={() => navigate(`/concerts/symphonyid/${symph.id}`)}
                          variant="outlined"
                        >
                          {lng("search")} ({symph.concerts?.length})
                        </Button>
                      );
                    return (
                      <div key={symph.id}>
                        {index !== 0 && <Divider sx={{ margin: 0 }} variant="middle" component="li" />}
                        <ListItem sx={{ paddingLeft: "0.25rem", paddingRight: "0.25rem" }}>
                          <ListItemText className="list-item--text" primary={textValue} secondary={concertsText} />
                          {buttonElement}
                        </ListItem>
                      </div>
                    );
                  })}
              </List>
            </>
          )}
          {tabValue === 1 && (
            <>
              <div style={{ marginTop: "1rem" }}>
                <TextField
                  sx={{ width: "100%", maxWidth: 300 }}
                  label={lng("filter_name_search")}
                  variant="standard"
                  color="secondary"
                  onChange={(event) => changeSearchHandle(event)}
                />
              </div>
              <List>
                {premieres
                  .filter((prem) => prem.symphony.name.toLowerCase().includes(searchInput.toLowerCase()))
                  .map((prem, index) => {
                    const textValue = `${parsePgDateToString(prem.concert?.date)}: ${prem.symphony?.name}`;
                    const premiereText = `(${lng("premiere_tag." + prem.premiere_tag?.name)})`;
                    return (
                      <div key={prem.id}>
                        {index !== 0 && <Divider sx={{ margin: 0 }} variant="middle" component="li" />}
                        <ListItem sx={{ paddingLeft: "0.25rem", paddingRight: "0.25rem" }}>
                          <ListItemText className="list-item--text" primary={textValue} secondary={premiereText} />
                          <Button
                            className="list-item--button"
                            color="secondary"
                            onClick={() => navigate(`/concert/concertid/${prem.concert?.id}`)}
                            variant="outlined"
                          >
                            {lng("open")}
                          </Button>
                        </ListItem>
                      </div>
                    );
                  })}
              </List>
            </>
          )}
        </LoadingContent>
      </div>
    </div>
  );
};

export default Composer;
