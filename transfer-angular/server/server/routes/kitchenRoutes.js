const express= require("express");
const {createKitchen,deleteKitchen,updateKitchen,getKitchen,getCustomerInKitchen}=require("../controllers/kicthenController")
const route = express.Router();


route.get("/",getKitchen);
route.get("/customer/:id",getCustomerInKitchen);
route.post("/",createKitchen);
route.put("/:id",updateKitchen);
route.delete("/:id",deleteKitchen);
module.exports=route;