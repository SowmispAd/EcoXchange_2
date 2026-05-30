const express = require("express");
let swaggerUi;
try {
  swaggerUi = require("swagger-ui-express");
} catch (_e) {
  swaggerUi = null;
}

const { swaggerSpec } = require("../config/swagger");

const docsRouter = express.Router();

if (swaggerUi) {
  docsRouter.get("/", swaggerUi.setup(swaggerSpec));
} else {
  docsRouter.get("/", (_req, res) => {
    res.status(501).json({
      success: false,
      message: "Swagger UI is not enabled (missing dependency)",
    });
  });
}

module.exports = { docsRouter };
