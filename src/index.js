
import { connectDB } from './db/index.js';
//approach 1
// require('dotenv').config({path:'./env'}) 


//approach 2(better)
import dotenv from 'dotenv'
import { app } from './app.js';
dotenv.config({path:"./.env"})





//Approach 2(Better)

connectDB()
.then(()=>{
    app.on("error",(err)=>{
        console.log(err)
        throw err
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server listening: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log(`MONGODB CONNECTION FAILED:${err}`)
})



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