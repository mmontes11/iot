import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import _ from "underscore";
import { UserModel } from "../../models/user";
import modelFactory from "../../helpers/modelFactory";
import config from "../../config";
import responseHandler from "../../helpers/responseHandler";

const _checkCredentials = async (username, password) => {
  const user = await UserModel.where({ username, password }).findOne();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return true;
};

const checkAuth = async (req, res) => {
  const { token, username, password } = req.body;
  if (!_.isUndefined(token)) {
    try {
      if (jwt.verify(token, config.jwtSecret)) {
        return res.sendStatus(httpStatus.OK);
      }
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } catch (err) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
  if (!_.isUndefined(username) && !_.isUndefined(password)) {
    try {
      if (await _checkCredentials(username, password)) {
        return res.sendStatus(httpStatus.OK);
      }
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } catch (err) {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
  return res.sendStatus(httpStatus.UNAUTHORIZED);
};

const createUserIfNotExists = async (req, res) => {
  const user = await UserModel.where({ username: req.body.username }).findOne();
  try {
    if (!_.isNull(user)) {
      res.sendStatus(httpStatus.CONFLICT);
    } else {
      const newUser = modelFactory.createUser(req.body);
      await newUser.save();
      res.sendStatus(httpStatus.CREATED);
    }
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

const getToken = async (req, res) => {
  const { username, password } = req.body;
  try {
    await _checkCredentials(username, password);
  } catch (err) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
  const token = jwt.sign({ username: req.body.username }, config.jwtSecret);
  return responseHandler.handleResponse(res, { token });
};

export default { checkAuth, createUserIfNotExists, getToken };
