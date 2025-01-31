const {connection}= require("../db/connection");
const axios=require("axios");
const { successResponse }=require("../utils/responseHandler")

const getDifference= async(req,res, next)=>{
 const {id,date_in,date_out} = req.params;
    if(!id||!date_in||!date_out){
        return res.status(400).json({success:false,message:"empty id ,date in , date out"});
    }
    const [request1,request2,request3]= await Promise.all([axios.get("https://sitesellinghub.com:4000/api/outcome/total/"+id+"/"+date_in+"/"+date_out),axios.get("https://sitesellinghub.com:4000/api/income/total/"+id+"/"+date_in+"/"+date_out),axios.get("https://sitesellinghub.com:4000/api/items/")]);
     const results= [];
    let x=0;
    for(let listItem of request3.data.data){
        let objects ={name:listItem.item_name};
        const t1=request2.data.data.filter(result=>result.item_id==listItem.item_id);
        const t2=request1.data.data.filter(result=>result.item_id==listItem.item_id);
        if(t1.length!=0)
            objects.income=parseFloat(t1[0].amount);
        else
            objects.income=0;
        if(t2.length!=0)
            objects.outcome=parseFloat(t2[0].amount);
        else
            objects.outcome=0;
        objects.difference=parseFloat(objects.income)-parseFloat(objects.outcome);
        results.push(objects);
    }
    successResponse(res,results);
}
const getTotalAmountDaily= async(req,res,next)=>{
    const {id,date_in,date_out} = req.params;
    if(!id||!date_in||!date_out){
        return res.status(400).json({success:false,message:"empty id ,date in , date out"});
    }
    const [request1,request2,request3]= await Promise.all([axios.get("https://sitesellinghub.com:4000/api/outcome/"+id+"/"+date_in+"/"+date_out),axios.get("https://sitesellinghub.com:4000/api/income/"+id+"/"+date_in+"/"+date_out),axios.get("https://sitesellinghub.com:4000/api/items/")]);
    const results= [];
    let x=0;
    for(let listItem of request3.data.data){
        let objects ={name:listItem.item_name};
            const incomeList= request2.data.data.filter(value=>value.item_name==listItem.item_name); 
            const outcomeList=request1.data.data.filter(value=>value.item_name==listItem.item_name);
            for(let income of incomeList){
                if(results.length!=0)
                   {
                    if(results.filter(value=>value.item_name==income.item_name).length!=0){
                        results[results.findIndex(value=>value.item_name==income.item_name)].income=Math.round((parseFloat(results[results.findIndex(value=>value.item_name==income.item_name)].income)+parseFloat(income.amount))*10000)/10000;
                        results[results.findIndex(value=>value.item_name==income.item_name)].amount=Math.round((parseFloat(results[results.findIndex(value=>value.item_name==income.item_name)].amount)+parseFloat(income.amount))*10000)/10000;
                    }
                }   
                   let o1=outcomeList.filter(value=>new Date(value.date_in)>=new Date(income.date_in));
                if(o1.length==0)
                {
                    if(results.filter(value=>value.item_name==income.item_name).length!=0){
                        results[results.findIndex(results.filter(value=>value.item_name==outcome.item_name)[0])].amount=Math.round((results[results.findIndex(results.filter(value=>value.item_name==outcome.item_name)[0])].amount+parseFloat(income.amount))*10000)/10000;
                    }else{
                        results.push({item_name:income.item_name,amount:parseFloat(income.amount),income:parseFloat(income.amount),outcome:0});
                    }
                }
                for(let outcome of o1){
                    let resultO=results.filter(value=>value.item_name==outcome.item_name);
                    if(resultO.length==0){
                        let diff= Math.round((parseFloat(income.amount)-parseFloat(outcome.amount))*10000)/10000;
                        if(diff<0){
                            diff=0;
                            outcome.amount=Math.round((parseFloat(outcome.amount)-parseFloat(income.amount))*10000)/10000;
                            let ob={item_name:outcome.item_name,amount:diff,income:parseFloat(income.amount),outcome:parseFloat(income.amount)};
                            results.push(ob);
                        }else{
                            let localOutcome=parseFloat(outcome.amount);
                            let ob={item_name:outcome.item_name,amount:diff,income:parseFloat(income.amount),outcome:localOutcome};
                            outcome.amount=0;
                            results.push(ob);
                        }
                    }else{
                        let diff= Math.round((parseFloat(resultO[0].amount)-parseFloat(outcome.amount))*10000)/10000;
                        if(diff<0){
                            diff=0;
                            let localOutCome=Math.round((parseFloat(resultO[0].outcome)+parseFloat(resultO[0].amount))*10000)/10000;
                            outcome.amount=Math.round((parseFloat(outcome.amount)-parseFloat(resultO[0].amount))*10000)/10000;
                            let ob={item_name:outcome.item_name,amount:diff,income:parseFloat(results[results.findIndex(value=>value.item_name==income.item_name)].income),outcome:localOutCome};
                            results[results.findIndex(value=>value.item_name==outcome.item_name)]=ob;    
                        }else{
                            let ob={item_name:outcome.item_name,amount:diff,income:parseFloat(results[results.findIndex(value=>value.item_name==income.item_name)].income),outcome:Math.round((parseFloat(resultO[0].outcome)+parseFloat(outcome.amount))*10000)/10000};
                            outcome.amount=0;
                            results[results.findIndex(value=>value.item_name==outcome.item_name)]=ob;   
                        }
                    }
                }
            }
        }
    successResponse(res,results);
}


module.exports={getTotalAmountDaily,getDifference};
