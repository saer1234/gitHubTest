const express= require("express");
const ma= require("../controllers/customerController");
const route= express.Router();

route.get("/",ma.getCustomer);
route.get("/checkLogin/:email/:password",ma.getLogin);
route.post("/",ma.createCustomer);
route.put("/:id",ma.updateCustomer);
route.delete("/:id",ma.deleteCustomer);

module.exports=route;
