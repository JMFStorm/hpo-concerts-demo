import english from "./en.json";
import finnish from "./fi.json";

const getLanguageText = (language) => {
  if (language === "fi") {
    return finnish;
  } else if (language === "en") {
    return english;
  }
  return finnish;
};

export const languageReducer = (state, action) => {
  switch (action.type) {
    case "SET_LANGUAGE":
      const languageContent = getLanguageText(action.payload.language);
      return { languageContent };
    default:
      return state;
  }
};
