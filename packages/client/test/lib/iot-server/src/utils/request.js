import jwt from "jsonwebtoken";

const extractUserNameFromRequest = req => {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    const token = req.headers.authorization.split(" ")[1];
    return jwt.decode(token).username;
  }
  return undefined;
};

export default { extractUserNameFromRequest };
