// src/handlers/http.ts
import serverless from "serverless-http";
import express from "express";
var app = express();
app.use(express.json());
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});
var run = serverless(app);
export {
  run
};
//# sourceMappingURL=http.js.map
