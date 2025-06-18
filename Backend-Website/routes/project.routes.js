// routes/project.routes.js
const express = require("express");
const router = express.Router();

// --- IMPORTANT: Ensure this path points to your updated controller file --- 
const {
  generateProject,
  downloadZip,
  helloWorld,
  getTableNamesController,
  getTableNamesWithoutParams,
  getTableNamesWithQuery
} = require("../controllers/project.controller.js");

// Existing routes
router.post("/api/generate-project", generateProject);
router.get("/zip-download/:id/:token", downloadZip);
router.get("/hello", helloWorld);

// --- Routes for Table Names --- 
router.post("/api/tablenames", getTableNamesController); // Route POST avec paramètres dans le body
router.get("/api/tablenames", getTableNamesWithoutParams); // Route GET sans paramètres (utilise la session)
router.get("/api/tablenames/query", getTableNamesWithQuery); // Route GET avec query params

module.exports = router;
