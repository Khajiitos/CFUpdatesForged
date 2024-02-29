import express = require('express');
const app = express();
import config from './config';

import updateRouter from './router/updates_route';

app.use((req, res, next) => {
  res.setHeader('X-Powered-By', "CFUpdatesForged/" + process.env.npm_package_version);
  next();
});

app.use(updateRouter);

app.use((req, res) => {
  res.status(400).json({
    statusCode: 400,
    message: "Unknown mod, bad request or wrong HTTP method"
  });
});

app.listen(config.port, () => {
  console.log("CF Updates Forged - running on port " + config.port);
});