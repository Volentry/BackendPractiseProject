
import { connectDB } from './db/index.js';
//approach 1
// require('dotenv').config({path:'./env'}) 


//approach 2(better)
import dotenv from 'dotenv'
dotenv.config({path:"./env"})





//Approach 2(Better)

connectDB()



//Aproach 1
// const app = express()

// (async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(e)=>{
//             console.log(e)
//             throw e;
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on : ${process.env.PORT}`)
//         })
//     }catch(e){
//        console.log(e)
//        throw e;
       
//     }
// })()