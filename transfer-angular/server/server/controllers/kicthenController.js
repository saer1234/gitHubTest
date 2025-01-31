const {successResponse} =require("../utils/responseHandler");
const {connection}= require("../db/connection");
const { response } = require("express");
const getKitchen= async(req,res,next)=>{
   const [kitchen]=await connection.query("SELECT * FROM kitchen");
   successResponse(res,kitchen);
}
const createKitchen=async(req,res,next)=>{
    const data = req.body;
    if(!data.kitchen_name)
    {
        res.status(401).json({success:false,message:"Kitchen empty name"});
        return;
    }
    const [result]= await connection.query("INSERT INTO kitchen(kitchen_name,date) values (?,?)",[data.kitchen_name,data.date]);
    if(result.affectedRows===0){
        res.status(404).json({success:false,message:"kitchen cannot inserted"});
        return;
    }
    successResponse(res,data);
}
const updateKitchen=async(req,res,next)=>{
    const {id} = req.params;
    const data= req.body;
    if(!id || !data.kitchen_name){
        return res.status(400).json({success:false,message:"Empty id or kitchen_name"});
    }
    const [kitchen]= await connection.query("SELECT * FROM kitchen WHERE kitchen.kitchen_id=?",[id]);
    if(!kitchen){
        return res.status(401).json({success:false,message:"Kitchen not fouend"});
    } 
    const [result] = await connection.query("UPDATE kitchen SET kitchen_name=?, date=? WHERE kitchen_id=?",[data.kitchen_name,data.date,id]);
    if(result.affectedRows===0)
        return res.status(404).json({success:false,message:"YOu can't modify kitchen "});
        successResponse(res,kitchen);

}
const deleteKitchen=async(req,res,next)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({success:false,message:"Empty id or kitchen_name"});
    }
    const [kitchen]= await connection.query("SELECT * FROM kitchen WHERE kitchen.kitchen_id=?",[id]);
    if(kitchen.length==0){
        return res.status(401).json({success:false,message:"Kitchen not fouend"});
    } 
    const [result] = await connection.query("DELETE FROM kitchen WHERE kitchen_id=?",[id]);
    if(result.affectedRows===0)
        return res.status(404).json({success:false,message:"YOu can't modify kitchen "});
        successResponse(res,kitchen);
}
const getCustomerInKitchen=async (req,res,next)=>{
    const {id}= req.params;
    if(!id){
        return res.status(400).json({success:false,message:"Empty id"});
    }
    const [kitchen]= await connection.query("SELECT * FROM kitchen INNER JOIN customer on kitchen.kitchen_id=customer.kitchen_id WHERE kitchen.kitchen_id=?",[id]);
    successResponse(res,kitchen);
}
module.exports={getKitchen,createKitchen,updateKitchen,deleteKitchen,getCustomerInKitchen};