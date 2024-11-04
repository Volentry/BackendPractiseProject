import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
// app.use() is usually used for middlewares and config operations
app.use(cors({
    origin:process.env.COURSE_ORIGIN,
    credentials:true
}))
//earlier we needed to use body-parser but now there is no need for json
app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({ //for url
    extended:true,
    limit:"16kb"
}))
app.use(express.static("public"))  //for images
app.use(cookieParser()) // for cookies

export {app}