import { Router } from "express";

import {
  getAllSymphonies,
  getSymphoniesByComposerId,
  getSymphoniesByKeyword,
  getSymphonyById,
  getSymphoniesByComposerName,
} from "../managers/symphony";
import { httpError } from "../utils/httpError";

const controller = Router();

// Describe
// Get symphonies by composer id
controller.get("/", async (req, res, next) => {
  try {
    const response = await getAllSymphonies();
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Get symphony by id
controller.get("/searchid/:symphonyid", async (req, res, next) => {
  try {
    const symphonyId = req.params.symphonyid;
    const response = await getSymphonyById(symphonyId);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Get symphonies by composer id
controller.get("/composer/:composerid", async (req, res, next) => {
  try {
    const composerId = req.params.composerid;
    const response = await getSymphoniesByComposerId(composerId);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Get symphonies by composer name
controller.get("/composername/:composername", async (req, res, next) => {
  try {
    const composerName = req.params.composername;
    const response = await getSymphoniesByComposerName(composerName);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

// Describe
// Get symphonies by name kayword
controller.get("/search", async (req, res, next) => {
  try {
    let keyword = req.query.keyword as string;
    const response = await getSymphoniesByKeyword(keyword);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err));
  }
});

export default controller;
