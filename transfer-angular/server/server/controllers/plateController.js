const {successResponse} =require("../utils/responseHandler");
const {connection}= require("../db/connection");
const axios=require("axios");
const getPlate= async(req,res,next)=>{
   const [kitchen]=await connection.query("SELECT * FROM plate INNER JOIN contain ON plate.plate_id=contain.plate_id  INNER JOIN items ON items.item_id=contain.item_id");
   successResponse(res,kitchen);
}
const getPlateo= async (req,res,next)=>{
    const [kitchen] = await connection.query("SELECT * FROM plate");
    successResponse(res,kitchen);
}
const createPlate=async(req,res,next)=>{
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
            const [rsl1]= await connection.query("SELECT * FROM plate WHERE plate_id=?",[x2.plate_id]);
            if(rsl1.length==0)
                return res.status(404).json({success:false,message:"plate not found"});
            }
        for(let x of data)
        {
            if(!x.hasOwnProperty("amount"))
                x.amount=0;
            const [select] = await connection.query("INSERT INTO contain(item_id,plate_id,amount) values (?,?,?)",[x.item_id,x.plate_id,x.amount]);
        }
    successResponse(res,{message:"done"});
}
const createPlateo=async (req,res,next)=>{
 const data = req.body;
 if(data.length==0){
    res.status(400).json({success:false,message:"empty plate"})
    return ;
 }
 const [result] = await connection.query("INSERT INTO plate(plate_name,date) values(?,?)",[data.plate_name,data.date]);
 if(result.affectedRows===0)
    return res.status(404).json({success:false,message:"can't not inserted form some reason!"});
successResponse(res,data);
}
const updatePlate=async(req,res,next)=>{
    const {id} = req.params;
    const data= req.body;
    if(!id){
        return res.status(400).json({success:false,message:"Empty id"});
    }
    const [result2]= await connection.query("SELECT * FROM items WHERE items.item_id=?",[data.item_id]);
    if(result2.length==0)
        return res.status(400).json({success:false,message:"item not found"});
    const [kitchen]= await connection.query("SELECT * FROM contain WHERE contain_id=?",[id]);
    if(kitchen.length==0){
        return res.status(401).json({success:false,message:"contain plate id not fouend"});
    } 
    const [result] = await connection.query("UPDATE contain SET amount=?, item_id=? WHERE contain_id=?",[data.amount,data.item_id,id]);
    if(result.affectedRows===0)
        return res.status(404).json({success:false,message:"YOu can't modify contain plate "});
        successResponse(res,kitchen);

}
const updatePlateo=async(req,res,next)=>{
    const {id} = req.params;
    const data= req.body;
    if(!id){
        return res.status(400).json({success:false,message:"Empty id"});
    }
    const [kitchen]= await connection.query("SELECT * FROM plate WHERE plate_id=?",[id]);
    if(kitchen.length==0){
        return res.status(401).json({success:false,message:"plate id not fouend"});
    } 
    const [result] = await connection.query("UPDATE plate SET plate_name=?, date=? WHERE plate_id=?",[data.plate_name,data.date,id]);
    if(result.affectedRows===0)
        return res.status(404).json({success:false,message:"YOu can't modify plate "});
        successResponse(res,kitchen);

}
const deletePlate=async(req,res,next)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({success:false,message:"Empty contain id"});
    }
    const [kitchen]= await connection.query("SELECT * FROM contain WHERE contain_id=?",[id]);
    if(kitchen.length==0){
        return res.status(401).json({success:false,message:"id not founded"});
    } 
    const [result] = await connection.query("DELETE FROM contain WHERE contain_id=?",[id]);
    if(result.affectedRows===0)
        return res.status(404).json({success:false,message:"YOu can't modify contain_id "});
        successResponse(res,kitchen);
}
const deletePlateo=async(req,res,next)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({success:false,message:"Empty plate id"});
    }
    const [kitchen]= await connection.query("SELECT * FROM plate WHERE plate_id=?",[id]);
    if(kitchen.length==0){
        return res.status(401).json({success:false,message:"id not founded"});
    } 
   try{
    const [result] = await connection.query("DELETE FROM plate WHERE plate_id=?",[id]);
    if(result.affectedRows===0)
        return res.status(404).json({success:false,message:"YOu can't modify plate_id "});
        successResponse(res,kitchen);
   }catch(error){
    return res.status(404).json({success:false,message:"Cannot Delete this item before clear this content of this plate"});
   }
}

const outAmontPlate= async(req,res,next)=>{
    const data= req.body;
    if(data.length===0){
        res.status(400).json({success:false,message:"empty data"});
        return;
    }
        const [mr]= await connection.query("SELECT * FROM token WHERE token=?",data[0].token);
        if(mr.length!=0)
            return res.status(401).json({success:false,message:"duplicated"});
        else
            connection.query("INSERT INTO token(token) values(?)",data[0].token);
    for(let x of data){
        const [result] = await connection.query("SELECT * FROM plate WHERE plate_id=?",[x.plate_id]);
        if(result.length===0)
            return res.status(404).json({success:false,message:"plate id not found"});
        
        const [result2] = await connection.query("SELECT * FROM kitchen WHERE kitchen_id=?",[x.kitchen_id]);
        if(result2.length===0)
            return res.status(404).json({success:false,message:"kitchen id not found"});
    }

   // const date = new Date();
   // const y =date.getFullYear();
  //  const month= String(date.getMonth()+1).padStart(2,'0');
   // const day =String(date.getDate()).padStart(2,'0');
    //const current_date = `${y}-${month}-${day}`;
        for(let x of data){
            const[ table]= await connection.query("SELECT * FROM plate INNER JOIN contain ON plate.plate_id=contain.plate_id INNER JOIN items ON items.item_id=contain.item_id WHERE plate.plate_id=?",[x.plate_id]);
            for(let plate of table){
                let amount =plate.amount*x.number;
               axios.post("http://localhost:4000/api/outcome",[{amount:amount,date_in:x.date,item_id:plate.item_id,kitchen_id:x.kitchen_id}]);
            }
         const [retu] = await connection.query("SELECT * FROM plate_out WHERE plate_out.plate_id=? AND date=?",[x.plate_id,x.date]);
         if(retu.length==0)
           {
            const [result2] = await connection.query("INSERT INTO plate_out(plate_id,kitchen_id,number,date) values (?,?,?,?)",[x.plate_id,x.kitchen_id,x.number,x.date]);
           }else{
            const [result2] = await connection.query("UPDATE plate_out SET plate_id=?,kitchen_id=?,number=?,date=?   WHERE plate_out=?",[x.plate_id,x.kitchen_id,parseFloat(x.number)+parseFloat(retu[0].number),x.date,retu[0].plate_out]);
         
           }
        }
    successResponse(res,{data:"success out plate"});
}
const readPlayOut =  async (req,res,next)=>{
    const {id,date_in,date_out}= req.params;
    if(!id || !date_in || !date_out){
        return res.status(400).json({success:false,message:"emypty id date range"});
    }
    const [ result ]  = await  connection.query("SELECT * , plate_out.date as date_out FROM  plate_out INNER JOIN plate ON plate_out.plate_id=plate.plate_id WHERE kitchen_id=? AND plate_out.date  BETWEEN ? AND ? ORDER BY  plate_out.date",[id,date_in,date_out])
    successResponse(res,result);
}
const readToken= async (req,res,next)=>{
    const {token}=req.params;
    const [result]= await connection.query("SELECT * FROM token where token=?",[token]);
    if(result.length==0){
        return successResponse(res,{success:true,message:"not found"});
    }
    successResponse(res,{success:false,message:"founded"})
}
module.exports={readToken,readPlayOut,updatePlateo,deletePlateo,outAmontPlate,updatePlate,deletePlate,getPlateo,getPlate,createPlate,createPlateo};