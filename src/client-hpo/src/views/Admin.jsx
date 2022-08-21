import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";

import LoadingIcon from "./LoadingIcon";
import { parseCsv } from "../utils/csvParse";
import { uploadCsvData, validateCsvData, loginUser } from "../api/request";
import { serverUrl } from "../config";
import UploadValidateErrors from "./UploadValidateErrors";
import Language from "../lang/Language.jsx";

const Admin = () => {
  const navigate = useNavigate();
  const { lng } = Language();

  const [fileData, setFileData] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [loginPassword, setLoginPassword] = useState("");
  const [userToken, setUserToken] = useState(undefined);
  const [loginError, setLoginError] = useState(false);
  const [seedMessages, setSeedMessages] = useState({
    default: "",
    total: "",
    result: "",
  });
  const [seedWarnings, setSeedWarnings] = useState([]);
  const [seedInProgress, setSeedInProgress] = useState(false);
  const [validateInProgress, setValidateInProgress] = useState(false);
  const [canUpload, setCanUpload] = useState(false);
  const [seedProgress, setSeedProgress] = useState(0);

  // Sockets
  useEffect(() => {
    if (userToken) {
      const socket = io(serverUrl);
      socket.on("connect_message", (message) => {});
      socket.on("db_seed", (seedData) => {
        console.log("Message:", seedData);
        if (seedData.type === "warning") {
          setSeedWarnings((prev) => prev.concat(seedData.message));
        } else {
          setSeedMessages((prev) => ({ ...prev, [seedData.type]: seedData.message }));
        }
        setSeedInProgress(!seedData.data?.completed ?? false);
        const progressPercent = seedData.data?.progressPercent;
        if (progressPercent) {
          setSeedProgress(progressPercent);
        }
      });
    }
  }, [userToken]);

  const submitLogin = async () => {
    setLoginError(false);
    const { result, error } = await loginUser(loginPassword);
    setLoginPassword("");
    if (error) {
      setLoginError(true);
    }
    if (result) {
      setUserToken(result.token);
    }
  };

  if (!userToken) {
    return (
      <div className="page admin-login">
        <div className="admin-login__logins">
          <label>{lng("login")}</label>
          <input
            name="password"
            type="password"
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.target.value)}
          />
        </div>
        <button onClick={submitLogin}>{lng("login")}</button>
        {loginError && <div>{lng("login_failed")}</div>}
      </div>
    );
  }

  const parseCallback = async (results) => {
    if (results.errors) {
      results.errors.forEach((err) => {
        if (results.data && err.row === results.data.length - 1) {
          // Slice last row off
          results.data = results.data.slice(0, results.data.length - 1);
        }
      });
    }
    if (results.data) {
      setFileData(results.data);
      setSeedWarnings([]);
      setUploadErrors([]);
      setValidateInProgress(true);
      const { result, error } = await validateCsvData(results.data, userToken);
      setValidateInProgress(false);
      if (error) {
        setCanUpload(false);
        setUploadErrors(error.errors);
      } else {
        setCanUpload(true);
      }
    }
  };

  const onFileChange = (event) => {
    const inputFile = event.target.files[0];
    setUploadErrors([]);
    setSeedMessages({
      default: "",
      total: "",
      result: "",
    });
    if (inputFile.type === "text/csv") {
      setValidateInProgress(true);
      parseCsv(inputFile, parseCallback);
    } else {
      setCanUpload(false);
      setValidateInProgress(false);
    }
  };

  const onFileUpload = async () => {
    setUploadErrors([]);
    setSeedMessages({
      default: "",
      total: "",
      result: "",
    });
    setSeedProgress(0);
    setSeedInProgress(true);
    setSeedWarnings([]);
    const { error } = await uploadCsvData(fileData, userToken);
    if (error) {
      setUploadErrors(error.errors);
    }
  };

  const uploadDisabled = !canUpload || seedInProgress;

  const sizePixels = 50;
  const borderWidth = sizePixels / 4;

  return (
    <div className="page">
      <button
        className="logout"
        onClick={() => {
          setUserToken(undefined);
          navigate("/admin");
        }}
      >
        {lng("logout")}
      </button>
      <div>
        <input
          style={{ marginRight: "0.5rem" }}
          disabled={seedInProgress}
          type="file"
          accept=".csv"
          onChange={(e) => onFileChange(e)}
        />
        <button style={{ marginTop: "0.25rem" }} disabled={uploadDisabled} className="upload" onClick={onFileUpload}>
          {lng("upload")}
        </button>
      </div>

      <div style={{ margin: "1rem 0" }}>
        {(seedInProgress || validateInProgress) && (
          <div
            style={{
              margin: "0",
              width: sizePixels,
              height: sizePixels,
              border: `${borderWidth}px solid #f3f3f3`,
              borderTop: `${borderWidth}px solid #005859`,
            }}
            className="loader"
          ></div>
        )}
        {seedInProgress && (
          <LinearProgress sx={{ margin: "1rem 0" }} color="secondary" variant="determinate" value={seedProgress} />
        )}
      </div>

      {/*<LoadingIcon sx={{ marginLeft: "auto" }} sizePixels={50} />*/}

      <div style={{ marginTop: "1rem" }}>
        <div>{seedMessages.default}</div>
        <div>{seedMessages.total}</div>
        <div>{seedMessages.result}</div>
        {seedWarnings.length > 0 && (
          <div>
            <h3>{lng("symphony_name_conflicts")}:</h3>
            <ul style={{ listStyleType: "none" }}>
              {seedWarnings
                .filter((current, index, self) => index === self.findIndex((x) => x === current))
                .map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
      <UploadValidateErrors uploadErrors={uploadErrors} />
    </div>
  );
};

export default Admin;
