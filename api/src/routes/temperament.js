const router = require('express').Router();
const {getAllTemperaments, addTemperament} = require ("../controllers/temperament.js");

router.get("/", getAllTemperaments);
router.post("/", addTemperament)

module.exports = router;