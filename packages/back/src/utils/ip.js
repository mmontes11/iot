import requestIp from "request-ip";

const _stripIPV6prefix = ip => ip.replace(/^.*:/, "");

const extractIPfromRequest = req => {
  const ip = requestIp.getClientIp(req);
  return _stripIPV6prefix(ip);
};

export default { extractIPfromRequest };
