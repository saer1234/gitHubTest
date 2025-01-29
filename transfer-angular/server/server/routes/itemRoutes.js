const express = require("express");
const {getItem,createItem, updateItem, deleteItem}=require("../controllers/itemController");
const router = express.Router();
router.get("/",getItem);
router.post("/",createItem);
router.put("/:id",updateItem);
router.delete("/:id",deleteItem);

module.exports= router;