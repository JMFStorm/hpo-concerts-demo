import React, { useEffect, useReducer, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "../styles/app.css";
import { languageReducer } from "../lang/languageReducer";
import LanguageContext from "../lang/languageContext";

import { fetchConcertsYearRange } from "../api/request";
import Header from "./Header";
import Footer from "./Footer";
import HomePage from "./HomePage";
import Admin from "./Admin";
import Concerts from "./Concerts";
import Composers from "./Composers";
import Composer from "./Composer";
import ComposersByLetters from "./ComposersByLetters";
import ConcertsBySymphony from "./ConcertsBySymphony";
import Concert from "./Concert";

const App = () => {
  const [language, setLanguage] = useState(sessionStorage.getItem("lang") ?? "fi");
  const [appLanguage, dispatchLanguage] = useReducer(languageReducer, null);
  const [yearRange, setYearRange] = useState({ min: "", max: "" });

  useEffect(() => {
    dispatchLanguage({ type: "SET_LANGUAGE", payload: { language: language } });
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const fetchYears = async () => {
      const range = await fetchConcertsYearRange();
      if (range.result) {
        const min = Number(range.result.min.substring(0, 4));
        const max = Number(range.result.max.substring(0, 4));
        setYearRange({ min: min, max: max });
      }
    };
    fetchYears();
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#ffffff",
        light: "#ffffff",
        dark: "#ffffff",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#005859",
        light: "#597e80",
        dark: "#004040",
        contrastText: "#ffffff",
      },
    },
  });

  return (
    <main className="app-main">
      {appLanguage && (
        <LanguageContext.Provider value={appLanguage}>
          <ThemeProvider theme={theme}>
            <HashRouter>
              <Header language={language} setLanguage={setLanguage} />
              <div className="page-wrapper">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/composers" element={<Composers />} />
                  <Route path="/composers/startingletter/:letters" element={<ComposersByLetters />} />
                  <Route path="/composer/:composerid" element={<Composer />} />
                  <Route path="/concerts/symphonyid/:symphonyid" element={<ConcertsBySymphony />} />
                  <Route path="/concert/concertid/:concertid" element={<Concert />} />
                  {yearRange.min && yearRange.max && (
                    <Route path="/concerts" element={<Concerts yearRange={yearRange} />} />
                  )}
                </Routes>
              </div>
              <Footer />
            </HashRouter>
          </ThemeProvider>
        </LanguageContext.Provider>
      )}
    </main>
  );
};

export default App;
