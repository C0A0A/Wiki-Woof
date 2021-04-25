const router = require('express').Router();
const {getSomeDogs, addBreed, findById} = require ("../controllers/dogs.js")

router.get("/", getSomeDogs);
router.get("/:id", findById);

router.post("/", addBreed);

//router.get("/dogs?name=")

module.exports = router;