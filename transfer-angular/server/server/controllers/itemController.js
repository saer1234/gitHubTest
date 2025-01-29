const {successResponse}= require("../utils/responseHandler");
const {connection} =require("../db/connection");
const getItem= async (req,res,next)=>{
    const [items]= await connection.query("SELECT * FROM items");
    successResponse(res,items);
}
const createItem=async (req,res,next)=>{
    const data = req.body;
    if(!data.item_name){
        res.status(400).json({success:false,message:"Empty name try again"});
        return;
    }
    const [result] = await connection.query("INSERT INTO items(item_name,unit,date) values(?,?,?)",[data.item_name,data.unit,data.date]);
    successResponse(res,result.insertId,201)
}
const updateItem= async (req,res,next)=>{
    const data= req.body;
    const {id}= req.params;
    if(!data.item_name || !id){
        res.status(400).json({success:false,message:"Error id not found"});
        return;
    }

        const [result]= await connection.query("UPDATE items SET item_name=? , unit=?, date=? WHERE item_id=?",[data.item_name,data.unit,data.date,id]);
        if(result.affectedRows===0)
        {
            res.status(404).json({success:false,message:"Item not Found"});
            return;
        }
        successResponse(res,{id});

   
  
}

const deleteItem= async(req,res,next)=>{
    const {id} = req.params;
    if(!id){
        res.status(400).json({success:false,message:"Item_id empty"});
        return;
    }
    const [items] = await connection.query("SELECT * FROM items WHERE items.item_id=?",[id]);
    if(!items){
        res.status(404).json({success:false,message:"item_id not found"});
        return;  
    }
    try{
        const [result] = await connection.query("DELETE FROM items WHERE items.item_id=?",[id]);
        if(result.affectedRows===0){
            res.status(404).json({success:false,message:"item_id not found"});
            return;
        }
        successResponse(res,items);
    }catch(error){
        res.status(400).json({success:false,message:"you can't delete this item"})
    }
}
module.exports= {getItem,createItem,updateItem,deleteItem};