import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import AutocompleteFetch from "../components/AutocompleteFetch";
import { fetchAllComposersByKeyword } from "../api/request";
import Language from "../lang/Language.jsx";

const alphabeticals = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "å",
  "ä",
  "ö",
];

const Composers = () => {
  const navigate = useNavigate();
  const { lng } = Language();

  const [selectedComposer, setSelectedComposer] = useState(null);

  return (
    <div className="page">
      <div className="search-composer">
        <h2>{lng("search_composer_by_name")}</h2>
        <AutocompleteFetch
          name="composer"
          label={lng("search_composer")}
          value={selectedComposer}
          setValue={setSelectedComposer}
          asyncRequest={fetchAllComposersByKeyword}
          customOnChange={(event, newValue) => {
            navigate(`/composer/${newValue.id}`);
          }}
        />
      </div>
      <div className="letters">
        <h2>{lng("search_composer_by_starting_letter")}</h2>
        <div className="letters__container">
          {alphabeticals.map((x) => {
            let lettersStr = [x];
            if (x.toLowerCase() === "s") {
              lettersStr.push("š");
            }
            if (x.toLowerCase() === "z") {
              lettersStr.push("ž");
            }
            return (
              <div key={x} className="letter">
                <Link
                  style={{ textDecoration: "none", color: "#005859", textTransform: "uppercase" }}
                  to={`/composers/startingletter/${lettersStr}`}
                >
                  {x}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Composers;
