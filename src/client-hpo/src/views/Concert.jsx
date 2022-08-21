import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import { parsePgDateToString, parsePgTimeToString } from "../utils/functions";
import LoadingContent from "./LoadingContent";
import Language from "../lang/Language";
import GetBackButton from "../components/GetBackButton";
import { fetchConcertById } from "../api/request";

const Concert = () => {
  const params = useParams();
  const { lng } = Language();
  const [concert, setConcert] = useState(undefined);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const getConcert = async () => {
      const concertId = params.concertid;
      if (concertId) {
        setPageLoading(true);
        const { result, error } = await fetchConcertById(concertId);
        setPageLoading(false);
        if (result) {
          console.log("result", result);
          setConcert(result);
        }
      }
    };
    getConcert();
  }, []);

  const clockText = (startingTime) => {
    let txt = "";
    if (startingTime) {
      txt = txt.concat(` ${lng("klo")} ${parsePgTimeToString(startingTime)}`);
    }
    return txt;
  };

  const conductorsText = useMemo(() => {
    if (concert?.conductor_unknown) {
      return `(${lng("conductor_unknown")})`;
    }
    if (concert?.conductors?.length === 1) {
      return lng("conductor");
    } else if (concert?.conductors?.length > 1) {
      return lng("conductors");
    }
    return "";
  }, [concert]);

  return (
    <div className="page">
      <GetBackButton />
      <LoadingContent loading={pageLoading}>
        {concert && (
          <div style={{ textAlign: "center" }}>
            <p className="bold">
              <span>{parsePgDateToString(concert.date)}</span>
              {concert.starting_time && <span>{clockText(concert.starting_time)}</span>}
            </p>
            <br />
            <p>
              <span>{concert.concert_tag?.name}</span>
              {concert.footnote && (
                <span>
                  {", "}
                  {concert.footnote}
                </span>
              )}
            </p>
            <p>{concert.location?.name}</p>
            <p>{concert.orchestra?.name}</p>
            <br />
            <p>{conductorsText}</p>
            <p className="bold">
              {concert.conductors?.map((x, index) => {
                let txt = "";
                if (index !== 0) {
                  txt = txt.concat(" / ");
                }
                txt = txt.concat(x.name);
                return <span key={x.name}>{txt}</span>;
              })}
            </p>
            <br />
            <div>
              {concert.performances.map((perf) => {
                return (
                  <div key={perf.id}>
                    <p className="bold">
                      {perf.symphony.composers?.map((comp, index) => {
                        let textValue = "";
                        if (index !== 0) {
                          textValue = textValue.concat(" / ");
                        }
                        textValue = textValue.concat(comp.name);
                        return <span key={comp.id}>{textValue}</span>;
                      })}
                    </p>
                    <p>
                      <span>{perf.symphony.name} </span>
                      {perf.is_encore && <span> ({lng("encore")})</span>}
                      {perf.symphony.arrangers && (
                        <span key={perf.symphony.arrangers.id}>({perf.symphony.arrangers.names})</span>
                      )}
                      {perf.premiere_tag && (
                        <span style={{ fontSize: "0.9rem" }} key={perf.premiere_tag.id}>
                          ({lng("premiere_tag." + perf.premiere_tag.name)})
                        </span>
                      )}
                    </p>
                    <p
                      style={{
                        margin: "auto",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      {perf.soloist_performances?.map((soloPerf, index) => {
                        let txt = "";
                        if (index === 0) {
                          txt = txt.concat(
                            perf.soloist_performances.length > 1 ? `${lng("soloists")}: ` : `${lng("soloist")}: `
                          );
                          txt = txt.concat(`${soloPerf.soloist.name} (${soloPerf.instrument.name})`);
                        } else if (index !== 0) {
                          txt = txt.concat(`${soloPerf.soloist.name} (${soloPerf.instrument.name})`);
                        }
                        if (index !== perf.soloist_performances.length - 1) {
                          txt = txt.concat(",");
                        }
                        return (
                          <span key={soloPerf.id} style={{ padding: "0.15rem" }}>
                            {txt}
                          </span>
                        );
                      })}
                    </p>
                    <br />
                  </div>
                );
              })}
            </div>
            <br />
            <div style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
              <p>{lng("additional_info")}:</p>
              <p>{concert.archive_info}</p>
            </div>
          </div>
        )}
      </LoadingContent>
    </div>
  );
};

export default Concert;
