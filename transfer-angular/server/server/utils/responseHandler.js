const successResponse = (res,data,status=200)=>{
    res.status(status).json({success:true,data});
}
module.exports={successResponse};