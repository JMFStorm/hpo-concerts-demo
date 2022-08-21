import React from "react";

import Language from "../lang/Language.jsx";

const Footer = () => {
  const { lng } = Language();

  return (
    <footer className="footer">
      <p className="footer__email">
        <span>{lng("for_info")}: </span>
        <span>anu.fagerstrom@saunalahti.fi</span>
      </p>
      <p className="footer__copyright">&copy; Janne Fagerström</p>
    </footer>
  );
};

export default Footer;
