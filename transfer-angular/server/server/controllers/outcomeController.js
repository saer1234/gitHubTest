const {successResponse} =require("../utils/responseHandler");
const {connection}= require("../db/connection");
const { response } = require("express");
const getOutcome= async(req,res,next)=>{
    const {id,date_in,date_out}= req.params;
   const [kitchen]=await connection.query("SELECT * FROM outcome INNER JOIN items ON outcome.item_id=items.item_id WHERE date_in BETWEEN ? AND ? AND kitchen_id=? ORDER BY date_in",[date_in,date_out,id]);
   successResponse(res,kitchen);
}
const createOutcome=async(req,res,next)=>{
    const data = req.body;
   if(data.length==0)
    {
        res.status(401).json({success:false,message:"Empty json try again"});
        return;
    }

        for(let x2 of data){
            const [rs1]=await connection.query("SELECT * FROM items WHERE item_id=?",[x2.item_id]);
            if(rs1.length==0)
                return res.status(404).json({success:false,message:"item cannot founded"});
            const [rs2]=await connection.query("SELECT * FROM kitchen WHERE kitchen_id=?",[x2.kitchen_id])
            if(rs2.length==0)
            return res.status(404).json({success:false,message:"kitchen cannot founded"});
        }
        for(let x of data)
        {
            const [select] = await connection.query("SELECT * FROM outcome WHERE outcome.item_id=? AND date_in=? AND outcome.kitchen_id=?",[x.item_id,x.date_in,x.kitchen_id]);
            if(select.length>0){
                const [result]= await connection.query("UPDATE outcome SET amount=? WHERE outcome.item_id=? AND date_in=? AND outcome.kitchen_id=?",[parseFloat(select[0].amount)+parseFloat(x.amount),x.item_id,x.date_in,x.kitchen_id]);
            }else{
                const [result]= await connection.query("INSERT INTO outcome(amount,date_in,item_id,kitchen_id) values(?,?,?,?)",[x.amount,x.date_in,x.item_id,x.kitchen_id]);
            }
        }
    successResponse(res,{message:"done"});
}
const updateOutcome=async(req,res,next)=>{
    const {id} = req.params;
    const data= req.body;
    if(!id){
        return res.status(400).json({success:false,message:"Empty id"});
    }
    const [kitchen]= await connection.query("SELECT * FROM outcome WHERE outcome_id=?",[id]);
    if(kitchen.length==0){
        return res.status(401).json({success:false,message:"income id not fouend"});
    } 
    const [result] = await connection.query("UPDATE outcome SET amount=?, date_in=? WHERE outcome_id=?",[data.amount,data.date_in,id]);
    if(result.affectedRows===0)
        return res.status(404).json({success:false,message:"YOu can't modify kitchen "});
        successResponse(res,kitchen);

}
const deleteOutcome=async(req,res,next)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({success:false,message:"Empty id or kitchen_name"});
    }
    const [kitchen]= await connection.query("SELECT * FROM outcome WHERE outcome.outcome_id=?",[id]);
    if(kitchen.length==0){
        return res.status(401).json({success:false,message:"id of in stock not founded"});
    } 
    const [result] = await connection.query("DELETE FROM outcome WHERE outcome_id=?",[id]);
    if(result.affectedRows===0)
        return res.status(404).json({success:false,message:"YOu can't modify outcome "});
        successResponse(res,kitchen);
}
const getTotalAmont= async(req,res,next)=>{
    const {date_in,date_out,id}= req.params;   
    if(!date_in || !date_out){
        res.status(400).json({success:false,message:"empty date"});
        return;
    }
    const [result] = await connection.query("SELECT * FROM outcome INNER JOIN items ON items.item_id=outcome.item_id WHERE  date_in BETWEEN ? AND ? AND kitchen_id=? ORDER BY date_in",[date_in,date_out,id]);
    const listItems= [];
    for(let x of result){
        if(listItems.filter(rq=>rq.item_name===x.item_name).length!=0){
            let amount =listItems.filter(rq=>rq.item_name===x.item_name)[0].amount;
            listItems.filter(rq=>rq.item_name===x.item_name)[0].amount=amount+x.amount;
        }else{
            listItems.push(x);
        }
    }
    
    successResponse(res,listItems);
}

module.exports={getTotalAmont,updateOutcome,deleteOutcome,getOutcome,createOutcome};