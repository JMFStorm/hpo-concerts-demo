import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LanguageIcon from "@mui/icons-material/Language";

import Language from "../lang/Language.jsx";

const getTabValue = (pathname) => {
  if (pathname === "/home") {
    return 0;
  } else if (pathname === "/composers") {
    return 1;
  } else if (pathname === "/concerts") {
    return 2;
  }
  return 0;
};

const Header = ({ language, setLanguage }) => {
  const { lng } = Language();
  const navigate = useNavigate();
  const location = useLocation();

  const [tabValue, setTabValue] = useState(getTabValue(location.pathname));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setNewLanguage = (lang) => {
    sessionStorage.setItem("lang", lang);
    setLanguage(lang);
    setAnchorEl(null);
  };

  return (
    <header className="header">
      <div className="header__top">
        <h1>{lng("header_1")}</h1>

        <Button
          sx={{ margin: "0 0 0 auto", padding: "0 0.5rem" }}
          id="lang-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <div style={{ display: "flex" }}>
            <LanguageIcon sx={{ margin: "auto 0.15rem 2px auto" }} />
            <div style={{ margin: "auto" }}>{language === "fi" ? "Suomi" : "English"}</div>
          </div>
        </Button>
      </div>
      <div className="flex">
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "lang-button",
          }}
        >
          <MenuItem onClick={() => setNewLanguage("fi")}>Suomi</MenuItem>
          <MenuItem onClick={() => setNewLanguage("en")}>English</MenuItem>
        </Menu>
      </div>

      <div className="flex header__tabs">
        <Tabs
          variant="scrollable"
          scrollButtons={true}
          allowScrollButtonsMobile
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
          sx={{
            margin: "auto",
            "& .MuiTab-root": {
              color: "rgba(255, 255, 255, 0.85)",
            },
          }}
        >
          <Tab onClick={() => navigate("/home")} label={lng("homepage")} />
          <Tab onClick={() => navigate("/composers")} label={lng("search_composer")} />
          <Tab onClick={() => navigate("/concerts")} label={lng("search_concerts")} />
        </Tabs>
      </div>
    </header>
  );
};

export default Header;
