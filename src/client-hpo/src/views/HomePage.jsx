import React from "react";
import Link from "@mui/material/Link";

import Language from "../lang/Language.jsx";

const HomePage = () => {
  const { lng } = Language();

  return (
    <div className="page">
      <div style={{ marginBottom: "1rem" }}>
        <h2>{lng("home_1_h")}</h2>
        <p>{lng("home_1_p1")}</p>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <h3>{lng("home_2_h")}</h3>
        <p>{lng("home_2_p1")}</p>
        <p>{lng("home_2_p2")}</p>
        <p>{lng("home_2_p3")}</p>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <h3>{lng("home_3_h")}</h3>
        <p>Robert Kajanus 1882–1932</p>
        <p>Georg Schnéevoigt 1914–1916, 1932–1941</p>
        <p>Armas Järnefelt 1941–1945</p>
        <p>Martti Similä 1945–1951</p>
        <p>Tauno Hannikainen 1951–1965</p>
        <p>Jorma Panula 1965–1972</p>
        <p>Paavo Berglund 1975–1979</p>
        <p>Ulf Söderblom 1978–1979</p>
        <p>Okko Kamu 1981–1988</p>
        <p>Sergiu Comissiona 1990–1993</p>
        <p>Sergiu Comissiona 1990–1993</p>
        <p>John Storgårds 2008–2015</p>
        <p>Susanna Mälkki 2016–2023</p>
        <p>Jukka-Pekka Saraste 2023–</p>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <h3>{lng("home_4_h")}</h3>
        <p>James DePreist 1993–1996</p>
        <p>János Fürst 1993–1995</p>
        <p>John Storgårds 2003–2008</p>
        <p>Olari Elts 2011–2014</p>
        <p>Pekka Kuusisto 2023–</p>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <h3>{lng("home_5_h")}</h3>
        <p>{lng("home_5_p1")}</p>
        <p>{lng("home_5_p2")}</p>
        <p>{lng("home_5_p3")}</p>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <p>{lng("home_6_p1")}</p>
        <p>HELSINKI REGION INFOSHARE</p>
        <Link color="secondary" href="https://hri.fi/data/dataset/helsingin-kaupunginorkesterin-konsertit">
          https://hri.fi/data/dataset/helsingin-kaupunginorkesterin-konsertit
        </Link>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <h3>{lng("home_7_p1")}</h3>
        <Link color="secondary" href="https://hpo-history.herokuapp.com/">
          https://hpo-history.herokuapp.com/
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
