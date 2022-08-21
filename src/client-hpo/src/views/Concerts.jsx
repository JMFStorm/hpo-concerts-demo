import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import { parsePgDateToString, sortSymphoniesByName } from "../utils/functions";
import { sortConcertsByDate } from "../utils/functions";
import AutocompleteFetch from "../components/AutocompleteFetch";
import LoadingIcon from "./LoadingIcon";
import Language from "../lang/Language.jsx";
import {
  fetchConcertsCombinationSearch,
  fetchAllComposersByKeyword,
  fetchAllConductorsByKeyword,
  fetchAllSoloistsByKeyword,
  fetchSymphoniesByComposerName,
} from "../api/request";
import ConcertsPageButtons from "./ConcertsPageButtons";
import DisplaySearchParams from "./DisplaySearchParams";

const Concerts = ({ yearRange }) => {
  const { lng } = Language();
  const navigate = useNavigate();

  const listRef = useRef(null);
  const [searchParamsQuery, setSearchParamsQuery] = useSearchParams({});
  const [concerts, setConcerts] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState(yearRange.min);
  const [selectedEndYear, setSelectedEndYear] = useState(yearRange.max);

  const [searchResultsCriteria, setSearchResultsCriteria] = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [yearsError, setYearsError] = useState(false);
  const [composerSymphonies, setComposerSymphonies] = useState([]);

  const [selectedConductor, setSelectedConductor] = useState("");
  const [selectedComposer, setSelectedComposer] = useState("");
  const [selectedSoloist, setSelectedSoloist] = useState("");
  const [selectedSymphony, setSelectedSymphony] = useState("");
  const [symphonyInput, setSymphonyInput] = useState("");

  const fetchConcertsRequest = async (
    conductor,
    composer,
    soloist,
    symphony,
    startYear,
    endYear,
    chunkIndex = 0,
    scrollResults = false
  ) => {
    setSearchResultsCriteria({ conductor, composer, soloist, symphony, startYear, endYear });
    setPageLoading(true);
    const { result, error } = await fetchConcertsCombinationSearch(
      conductor,
      composer,
      soloist,
      symphony,
      startYear,
      endYear,
      chunkIndex
    );
    setPageLoading(false);

    if (result) {
      setConcerts(result.results);
      setTotalResults(result.total);
      if (scrollResults) {
        console.log("Scroll results");
        listRef.current?.scrollIntoView();
      }
    }
  };

  const userSearchConcerts = useCallback(async () => {
    setYearsError(false);
    const searchParams = {
      conductor: selectedConductor?.trim() ?? "",
      composer: selectedComposer?.trim() ?? "",
      soloist: selectedSoloist?.trim() ?? "",
      symphony: selectedSymphony?.trim() ?? "",
      start: selectedYear,
      end: selectedEndYear,
      pageindex: 0,
    };
    if (selectedYear > selectedEndYear) {
      setYearsError(true);
      return;
    }
    setChunkIndex(0);
    setSearchParamsQuery(searchParams);
    await fetchConcertsRequest(
      searchParams.conductor,
      searchParams.composer,
      searchParams.soloist,
      searchParams.symphony,
      selectedYear,
      selectedEndYear,
      0,
      true
    );
  }, [
    setChunkIndex,
    setSearchParamsQuery,
    selectedComposer,
    selectedSoloist,
    selectedYear,
    selectedEndYear,
    selectedConductor,
    selectedSymphony,
  ]);

  // Search symphonies when composer is selected
  useEffect(() => {
    if (!selectedComposer) {
      setSelectedSymphony("");
      setComposerSymphonies([]);
    }
    const searchSymphonies = async () => {
      if (selectedComposer) {
        const { result, error } = await fetchSymphoniesByComposerName(selectedComposer);
        setComposerSymphonies(result);
      }
    };
    searchSymphonies();
  }, [selectedComposer]);

  useEffect(() => {
    const searchAtStart = async () => {
      const comp = searchParamsQuery.get("composer") ?? "";
      const cond = searchParamsQuery.get("conductor") ?? "";
      const solo = searchParamsQuery.get("soloist") ?? "";
      const symphony = searchParamsQuery.get("symphony") ?? "";
      const start = searchParamsQuery.get("start") ?? yearRange.min;
      const end = searchParamsQuery.get("end") ?? yearRange.max;
      const pageIndex = searchParamsQuery.get("pageindex") ?? "";

      setSelectedConductor(cond);
      setSelectedComposer(comp);
      setSelectedYear(start);
      setSelectedEndYear(end);
      setSelectedSoloist(solo);
      setSelectedSymphony(symphony);
      setChunkIndex(Number(pageIndex));

      if (comp || cond || solo || start !== yearRange.min) {
        await fetchConcertsRequest(cond, comp, solo, symphony, start, end, pageIndex);
      }
    };
    searchAtStart();
  }, []);

  const changeYearsHandle = useCallback(
    (event) => {
      setYearsError(false);
      setSelectedYear(Number(event.target.value));
    },
    [setSelectedYear, setYearsError]
  );

  const changeEndYearsHandle = useCallback(
    (event) => {
      setYearsError(false);
      setSelectedEndYear(Number(event.target.value));
    },
    [setSelectedEndYear, setYearsError]
  );

  const changeChunkIndex = useCallback(
    async (val) => {
      let next = chunkIndex + val;
      if (next < 0) {
        return;
      }
      setChunkIndex(next);
      searchParamsQuery.set("pageindex", next);
      setSearchParamsQuery(searchParamsQuery);
      await fetchConcertsRequest(
        selectedConductor,
        selectedComposer,
        selectedSoloist,
        selectedSymphony,
        selectedYear,
        selectedEndYear,
        next
      );
    },
    [
      selectedConductor,
      selectedYear,
      selectedEndYear,
      selectedComposer,
      selectedSoloist,
      selectedSymphony,
      chunkIndex,
      setChunkIndex,
      setSearchParamsQuery,
      searchParamsQuery,
    ]
  );

  const resetFilters = () => {
    setChunkIndex(0);
    setConcerts([]);
    setSelectedYear(yearRange.min);
    setSelectedEndYear(yearRange.max);
    setSelectedConductor("");
    setSelectedComposer("");
    setSelectedSoloist("");
    setSelectedSymphony("");
    setSearchParamsQuery({});
  };

  const yearsArray = useMemo(() => {
    const newYearsArray = [];
    for (let i = yearRange.min; i <= yearRange.max; i++) {
      newYearsArray.push(i);
    }
    return newYearsArray;
  }, [yearRange]);

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

  const prviousButtonDisabled = chunkIndex === 0 || pageLoading;
  const nextButtonDisabled = (0 < concerts.length && concerts.length < 100) || pageLoading || concerts.length === 0;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
      },
    },
  };

  const showPageButtons = chunkIndex !== 0 || (chunkIndex === 0 && concerts.length === 100);
  const symphoniesDisabled = !selectedComposer || composerSymphonies.length === 0;

  const listSymphonyResults = (results) => {
    return (
      results
        ?.sort(sortSymphoniesByName)
        .map((res) => ({ label: res.name, id: res.id }))
        .filter((current, index, self) => index === self.findIndex((x) => x.label === current.label)) ?? []
    );
  };

  return (
    <div className="page">
      <h2 style={{ textAlign: "center" }}>{lng("search_concerts")}</h2>
      <AutocompleteFetch
        name="composer"
        label={lng("search_composer")}
        value={selectedComposer}
        setValue={setSelectedComposer}
        asyncRequest={fetchAllComposersByKeyword}
      />
      <Autocomplete
        sx={{
          margin: "1rem auto",
        }}
        disabled={symphoniesDisabled}
        id={"autocomplete-symphonies"}
        options={listSymphonyResults(composerSymphonies)}
        renderInput={(params) => <TextField {...params} label={lng("search_composer_symphony")} color="secondary" />}
        value={selectedSymphony}
        onChange={(event, newValue) => {
          if (newValue) {
            setSelectedSymphony(newValue.label);
          }
        }}
        inputValue={symphonyInput}
        onInputChange={(event, newInputValue) => {
          setSymphonyInput(newInputValue);
          if (newInputValue === "") {
            setSelectedSymphony(newInputValue);
          }
        }}
        isOptionEqualToValue={(option, value) => {
          return true || option?.label === value || option?.label.includes(value);
        }}
      />
      <AutocompleteFetch
        name="conductor"
        label={lng("search_conductor")}
        value={selectedConductor}
        setValue={setSelectedConductor}
        asyncRequest={fetchAllConductorsByKeyword}
      />
      <AutocompleteFetch
        name="soloist"
        label={lng("search_soloist")}
        value={selectedSoloist}
        setValue={setSelectedSoloist}
        asyncRequest={fetchAllSoloistsByKeyword}
      />
      <div className="flex search-years-wrapper">
        <FormControl className="search-years" style={{ marginRight: "0.25rem" }}>
          <InputLabel color="secondary" id="start-year-select-label">
            {lng("from_year")}
          </InputLabel>
          <Select
            id="select-year"
            value={selectedYear}
            label={lng("from_year")}
            onChange={changeYearsHandle}
            MenuProps={MenuProps}
            color="secondary"
          >
            {yearsArray.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className="search-years" style={{ marginLeft: "0.25rem" }}>
          <InputLabel color="secondary" id="start-year-select-label">
            {lng("to_year")}
          </InputLabel>
          <Select
            id="select-year"
            value={selectedEndYear}
            label={lng("to_year")}
            onChange={changeEndYearsHandle}
            MenuProps={MenuProps}
            color="secondary"
          >
            {yearsArray.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {yearsError && (
        <Alert severity="error">{lng("invalid_years_range", { start: selectedYear, end: selectedEndYear })}</Alert>
      )}
      <div className={"search-buttons flex"}>
        <Button
          sx={{ margin: "0.25rem 0" }}
          className="search-buttons__button"
          color="secondary"
          variant="outlined"
          onClick={resetFilters}
        >
          {lng("empty_search")}
        </Button>
        <Button
          sx={{ margin: "0.25rem 0 0.25rem 0.5rem" }}
          className="search-buttons__button"
          color="secondary"
          variant="contained"
          onClick={userSearchConcerts}
        >
          {lng("search")}
        </Button>
      </div>

      <div ref={listRef} style={{ margin: "0rem auto auto auto", paddingTop: "1rem" }}>
        {concerts.length > 0 && (
          <DisplaySearchParams
            concerts={concerts}
            chunkIndex={chunkIndex}
            totalResults={totalResults}
            searchResultsCriteria={searchResultsCriteria}
          />
        )}
        {pageLoading && !showPageButtons && <LoadingIcon sizePixels={40} />}
        {showPageButtons && (
          <ConcertsPageButtons
            prevDisabled={prviousButtonDisabled}
            nextDisabled={nextButtonDisabled}
            pageButtonCallback={changeChunkIndex}
            searchCriteria={searchResultsCriteria}
            pageLoading={pageLoading}
          />
        )}
        <List>
          {concerts.sort(sortConcertsByDate).map((concert, index) => {
            let textValue = `${parsePgDateToString(concert.date)}`;
            if (concert.concert_tag?.name) {
              textValue = textValue.concat(`: ${concert.concert_tag?.name}`);
            }
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
        {concerts.length >= 15 && showPageButtons && (
          <ConcertsPageButtons
            prevDisabled={prviousButtonDisabled}
            nextDisabled={nextButtonDisabled}
            pageButtonCallback={changeChunkIndex}
            searchCriteria={searchResultsCriteria}
            pageLoading={pageLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Concerts;
