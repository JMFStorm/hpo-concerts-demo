import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import Language from "../lang/Language.jsx";
import { parsePgDateToString } from "../utils/functions";
import LoadingContent from "./LoadingContent";
import { sortConcertsByDate } from "../utils/functions";
import GetBackButton from "../components/GetBackButton";
import { fetchConcertsBySymphonyId, fetchSymphonyById } from "../api/request";

const ConcertsBySymphony = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { lng } = Language();

  const [concerts, setConcerts] = useState([]);
  const [symphonyName, setSymphonyName] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  let symphonyId = useMemo(() => params.symphonyid ?? undefined, [params.symphonyid]);

  useEffect(() => {
    const getConcerts = async () => {
      if (symphonyId) {
        let symphResult;
        let concertsResult;
        setPageLoading(true);

        await Promise.all([
          await fetchSymphonyById(symphonyId).then((x) => (symphResult = x)),
          await fetchConcertsBySymphonyId(symphonyId).then((x) => (concertsResult = x)),
        ]);
        setPageLoading(false);

        if (symphResult.result) {
          const arrs = symphResult.result.arrangers?.names;
          let displaySymphony = symphResult.result.name;
          if (arrs) {
            displaySymphony = displaySymphony.concat(` (${arrs})`);
          }
          setSymphonyName(displaySymphony.trim());
        }

        if (concertsResult.result) {
          setConcerts(concertsResult.result);
        }
      }
    };
    getConcerts();
  }, [symphonyId]);

  const setConductorsString = (concert) => {
    if (concert.conductor_unknown) {
      return `(${lng("conductor_unknown")})`;
    }
    let txt = "";
    if (concert.conductors.length > 0) {
      concert.conductors.forEach((cond, index) => {
        if (index === concert.conductors.length - 1 && index !== 0) {
          txt = txt.concat(" & ");
        } else if (index !== 0) {
          txt = txt.concat(", ");
        }
        txt = txt.concat(`${cond.name}`);
      });
    }
    return txt === "" ? `(${lng("no_conductor")})` : txt;
  };

  return (
    <div className="page">
      <GetBackButton />
      <div style={{ margin: "1rem auto auto auto" }}>
        <LoadingContent loading={pageLoading}>
          <div>{lng("concerts_by_symphony", { value: symphonyName })}</div>
          <div style={{ marginTop: "1rem" }}>
            <List>
              {concerts.sort(sortConcertsByDate).map((concert, index) => {
                const textValue = `${parsePgDateToString(concert.date)}: ${concert.concert_tag?.name}`;
                const conductorsText = setConductorsString(concert);
                return (
                  <div key={concert.id}>
                    {index !== 0 && <Divider sx={{ margin: 0 }} variant="middle" component="li" />}
                    <ListItem sx={{ paddingLeft: "0.25rem", paddingRight: "0.25rem" }}>
                      <ListItemText className="list-item--text" primary={textValue} secondary={conductorsText} />
                      <Button
                        className="list-item--button"
                        color="secondary"
                        onClick={() => navigate(`/concert/concertid/${concert.id}`)}
                        variant="outlined"
                      >
                        {lng("open")}
                      </Button>
                    </ListItem>
                  </div>
                );
              })}
            </List>
          </div>
        </LoadingContent>
      </div>
    </div>
  );
};

export default ConcertsBySymphony;
