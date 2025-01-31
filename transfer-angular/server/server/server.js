const express = require("express");
const cors = require("cors");
//const fs = require("fs")
//const https= require("https");
const {port,name} = require("./config");
const itemRoutes= require("./routes/itemRoutes");
const kitchenRoutes= require("./routes/kitchenRoutes");
const customerRoutes= require("./routes/customerRoutes");
const incomeRoutes= require("./routes/incomeRoutes");
const outcomeRoutes= require("./routes/outcomeRoutes");
const plateRoutes= require("./routes/plateRoutes");
const differenceRoutes= require("./routes/differenceRoutes");
const errorHandler= require("./midleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/items",itemRoutes);
app.use("/api/kitchens",kitchenRoutes);
app.use("/api/customers",customerRoutes);
app.use("/api/income",incomeRoutes);
app.use("/api/outcome",outcomeRoutes);
app.use("/api/plate",plateRoutes);
app.use("/api/difference",differenceRoutes);
app.use(errorHandler);
/*
const sslOption={
    key:   fs.readFileSync("mykey.key"),
    cert:   fs.readFileSync("mycert.crt")
}
https.createServer(sslOption,app).listen(port,()=>{
    console.log(`server running on port ${port}`);
})
*/
app.listen(port,()=>{
    console.log(`server running on port ${port}`);
});

