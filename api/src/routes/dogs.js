const router = require('express').Router();
const {getSomeDogs, addBreed, findById, getDataBaseDogs} = require ("../controllers/dogs.js");
const upload = require('../middlewares/upload.js');

router.get("/", getSomeDogs);
router.get("/dbdogs", getDataBaseDogs);
router.get("/:id", findById);

router.post("/", upload.single("image"), addBreed);

module.exports = router;

