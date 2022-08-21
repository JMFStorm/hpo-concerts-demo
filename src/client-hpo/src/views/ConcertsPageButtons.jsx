import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";

import LoadingIcon from "./LoadingIcon";
import Language from "../lang/Language.jsx";

const ConcertsPageButtons = ({ pageLoading, prevDisabled, nextDisabled, pageButtonCallback }) => {
  const { lng } = Language();

  return (
    <>
      <Grid container sx={{ display: "flex" }}>
        <Button
          className="arrow-button"
          sx={{ marginRight: "auto", paddingLeft: 0 }}
          color="secondary"
          disabled={prevDisabled}
          onClick={() => pageButtonCallback(-1)}
        >
          <div style={{ padding: "0.5rem", paddingLeft: 0, display: "flex" }}>
            <ArrowBackIcon sx={{ margin: "0 0.5rem 0 0" }} />
            <span className="arrow-button--text">{lng("prev_100")}</span>
          </div>
        </Button>
        {pageLoading && <LoadingIcon sizePixels={40} />}
        <Button
          className="arrow-button"
          sx={{ marginLeft: "auto", paddingRight: 0 }}
          color="secondary"
          disabled={nextDisabled}
          onClick={() => pageButtonCallback(1)}
        >
          <div style={{ padding: "0.5rem", paddingRight: 0, display: "flex" }}>
            <span className="arrow-button--text">{lng("next_100")}</span>
            <ArrowForward sx={{ margin: "0  0 0 0.5rem" }} />
          </div>
        </Button>
      </Grid>
    </>
  );
};

export default ConcertsPageButtons;
