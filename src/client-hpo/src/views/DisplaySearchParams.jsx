import React, { useMemo } from "react";

import Language from "../lang/Language.jsx";

const DisplaySearchParams = ({ totalResults, searchResultsCriteria, concerts, chunkIndex }) => {
  const { lng } = Language();

  const { startYear, endYear, conductor, composer, soloist, symphony } = searchResultsCriteria;

  const hasCond = conductor?.length > 0;
  const hasComp = composer?.length > 0;
  const hasSolo = soloist?.length > 0;
  const hasSymph = symphony?.length > 0;

  const criteriaText = useMemo(() => {
    const addDeli = (string) => {
      if (string.length > 0) {
        return string.concat(", ");
      }
      return string;
    };

    let txt = "";
    txt = addDeli(txt);
    txt = txt.concat(`${lng("years_range")}: ${startYear} - ${endYear}`);

    if (hasCond) {
      txt = addDeli(txt);
      txt = txt.concat(`${lng("conductor")}: ${conductor}`);
    }
    if (hasComp) {
      txt = addDeli(txt);
      txt = txt.concat(`${lng("composer")}: ${composer}`);
    }
    if (hasSolo) {
      txt = addDeli(txt);
      txt = txt.concat(`${lng("soloist")}: ${soloist}`);
    }
    if (hasSymph) {
      txt = addDeli(txt);
      txt = txt.concat(`${lng("symphony")}: ${symphony}`);
    }
    return txt;
  }, [searchResultsCriteria]);

  const resultsPageString = useMemo(() => {
    const chunkSize = 100;
    const results = concerts.length;
    if (concerts.length < chunkSize && chunkIndex === 0) {
      return String(results);
    }
    const start = chunkSize * chunkIndex + 1;
    const tail = results < 100 ? results : chunkSize;
    const end = chunkSize * chunkIndex + tail;
    if (start > end) {
      return "0";
    }
    return `${start} ... ${end}`;
  }, [concerts, chunkIndex]);

  const searchResultsCountText = `${lng("displaying_from")}: ${resultsPageString}`;

  return (
    <>
      {searchResultsCriteria && (
        <div style={{ marginBottom: "1rem", textAlign: "center", color: "rgba(0, 0, 0, 0.85)" }}>
          <p>{lng("results_by_criteria")}:</p>
          <p>{criteriaText}</p>
          <div style={{ marginTop: "0.5rem" }}>
            {totalResults && (
              <p>
                {lng("results_2")}: {totalResults}
              </p>
            )}
            {totalResults >= 100 && <p>{searchResultsCountText}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default DisplaySearchParams;
