const express = require("express");
const {getTotalAmont,deleteincome,updateincome,getIncome,createIncome}=require("../controllers/incomeController");
const router = express.Router();
router.get("/:id/:date_in/:date_out",getIncome);
router.get("/total/:id/:date_in/:date_out",getTotalAmont);
router.post("/",createIncome);
router.put("/:id",updateincome);
router.delete("/:id",deleteincome);

module.exports= router;