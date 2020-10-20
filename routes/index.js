var express = require("express");
var router = express.Router();
var path = require("path");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/check", function (req, res, next) {
  res.header("Content-Security-Policy", "'default-src 'self';");
  // Content-Security-Policy: default-src 'self' *.mydomain.com
  const newpath = path.join(__dirname, "./temp.js");
  console.log("read js", newpath);
  res.sendfile(newpath);
});

router.get("/policyType1", function (req, res, next) {
  res.header("Content-Security-Policy", "default-src 'self';");
  // Content-Security-Policy: default-src 'self' *.mydomain.com
  const newpath = path.join(__dirname, "../public/policyType1.html");
  res.sendFile(newpath);
});

router.get("/reportPolicyType", function (req, res, next) {
  res.header(
    "Content-Security-Policy",
    "default-src 'self'; report-uri /report"
  );
  const newpath = path.join(__dirname, "../public/reportPolicyType.html");
  res.sendFile(newpath);
});

router.get("/reportOnly", (req, res, next) => {
  res.header(
    "Content-Security-Policy-Report-Only",
    "default-src 'self'; report-uri /report"
  );
  const newpath = path.join(__dirname, "../public/reportOnly.html");
  res.sendFile(newpath);
});

router.get("/framePageNoSetting", (req, res, next) => {
  res.header("Content-Security-Policy", "default-src 'self';");

  const newpath = path.join(__dirname, "../public/frame.html");
  res.sendFile(newpath);
});

router.get("/framePage", (req, res, next) => {
  res.header(
    "Content-Security-Policy",
    "default-src 'self'; child-src https://www.youtube.com;"
  );

  const newpath = path.join(__dirname, "../public/frame.html");
  res.sendFile(newpath);
});

router.get("/sslOnly", (req, res, next) => {
  res.header(
    "Content-Security-Policy",
    "default-src https:; script-src-elem https:; "
  );

  const newpath = path.join(__dirname, "../public/sslOnly.html");
  res.sendFile(newpath);
});

router.post("/report", (req, res, next) => {
  res.header("Content-Security-Policy", "default-src 'none';");

  console.log("report js");
  res.send("ok");
});

module.exports = router;
