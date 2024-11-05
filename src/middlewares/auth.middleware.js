import { APIError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    
    if(!token){
     throw new APIError(401,"unauthorized request")
 
    }
 
  const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
  const user = await User.findById(decodedToken._id).select("-password -refToken")
  console.log(user)
 
  if(!user){
    throw new APIError(404,"invalid access token")

  }
 


  req.user=user
  next()
   } catch (error) {

    throw new APIError(404," unexpected error occured")
    
   }
})