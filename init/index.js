const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");

//connection
main().then(()=>{console.log("connection is established");
})
.catch((err)=>{console.log(err);
});
async function main(){
await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB=async () =>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj) => ({...obj,owner: "66b639425e3d857462b10856"}));
    await listing.insertMany(initdata.data);
    console.log("data is inserted");
}

initDB();