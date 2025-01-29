const {successResponse} =require("../utils/responseHandler");
const {connection}= require("../db/connection");
const { response } = require("express");
const getCustomer= async(req,res,next)=>{
   const [kitchen]=await connection.query("SELECT * FROM customer");
   successResponse(res,kitchen);
}
const getLogin= async(req,res,next)=>{
    const{email,password}=req.params;
    const[result] = await connection.query("SELECT * FROM customer WHERE email=? and password=?",[email,password]);
    if(result.length==0)
        return res.status(400).json({success:false,message:"Customer not found"});
    else
        successResponse(res,result);
}
const createCustomer=async(req,res,next)=>{
    const data = req.body;
    if(!data.email|| !data.password)
    {
        res.status(401).json({success:false,message:"customer or password empty name and "});
        return;
    }
    const [customer]= await connection.query("SELECT * FROM customer WHERE customer.email=?",[data.email]);
    if(customer.length!=0){
        res.status(401).json({success:false,message:"Choose another email"});
        return ;
    }

    const [result]= await connection.query("INSERT INTO `customer`(`password`, `email`, `addres`, `phone_number`, `kitchen_id`) VALUES (?,?,?,?,?)",[data.password,data.email,data.addres,data.phone_number,data.kitchen_id]);
    if(result.affectedRows===0){
        res.status(404).json({success:false,message:"Customer cannot inserted"});
        return;
    }
    successResponse(res,data);
}
const updateCustomer=async(req,res,next)=>{
    const {id} = req.params;
    const data= req.body;
    if(!id || !data.kitchen_id){
        return res.status(400).json({success:false,message:"Empty id or kitchen_id"});
    }
    const [customer]= await connection.query("SELECT * FROM customer WHERE customer_id=?",[id]);
    if(customer.length==0){
        return res.status(401).json({success:false,message:"customer not founed"});
    } 
    const [customers] = await connection.query("SELECT * FROM customer WHERE email=? AND customer_id!=?",[data.email,id]);
    if(customers.length!=0){
        res.status(401).json({success:false,message:"Email founed try another way!"});
        return 0;
    }
    const [result] = await connection.query("UPDATE customer SET email=?, password=? , kitchen_id=?, phone_number=?,addres=? WHERE customer_id=?",[data.email,data.password,data.kitchen_id,data.phone_number,data.addres,id]);
    if(result.affectedRows===0)
        return res.status(404).json({success:false,message:"YOu can't modify customer "});
        successResponse(res,customer);

}
const deleteCustomer=async(req,res,next)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({success:false,message:"Empty id"});
    }
    const [kitchen]= await connection.query("SELECT * FROM customer WHERE customer_id=?",[id]);
    if(kitchen.length==0){
        return res.status(401).json({success:false,message:"customer not founed"});
    } 
    const [result] = await connection.query("DELETE FROM customer WHERE customer_id=?",[id]);
    if(result.affectedRows===0)
        return res.status(404).json({success:false,message:"YOu can't modify customer"});
        successResponse(res,kitchen);
}

module.exports={getCustomer,createCustomer,updateCustomer,deleteCustomer,getLogin};