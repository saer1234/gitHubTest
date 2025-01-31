const express = require("express");
const cors = require("cors");
const {PORT}= require("./config");
const {errorResponse}= require("./middlewares/errorHandler");
const {route} = require("./routes/itemRoutes");
app = express();
app.use(cors());
app.use(express.json());
//route
app.use("/api/items",route);
//error
app.use(errorResponse);

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
});