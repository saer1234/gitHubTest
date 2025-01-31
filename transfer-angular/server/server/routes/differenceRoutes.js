const express= require("express");
const {getTotalAmountDaily,getDifference}= require("../controllers/differenceController");
const route= express.Router();

route.get("/:id/:date_in/:date_out",getDifference);
route.get("/daily/:id/:date_in/:date_out",getTotalAmountDaily);
module.exports=route;
