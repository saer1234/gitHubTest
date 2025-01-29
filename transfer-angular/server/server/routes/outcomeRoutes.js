const express = require("express");
const {getTotalAmont,deleteOutcome,updateOutcome,getOutcome,createOutcome}=require("../controllers/outcomeController");
const router = express.Router();
router.get("/:id/:date_in/:date_out",getOutcome);
router.get("/total/:id/:date_in/:date_out",getTotalAmont);
router.post("/",createOutcome);
router.put("/:id",updateOutcome);
router.delete("/:id",deleteOutcome);

module.exports= router;