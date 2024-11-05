import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadONCloudinary } from "../utils/cloudinary.js";
import APIResponce from "../utils/APIResponse.js";
import multer from 'multer'
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
       const user =  await User.findById(userId)
       
       const accessToken = user.accessTokenGeneration()
       const refreshToken = user.refreshTokenGeneration()
       user.refToken = refreshToken
       await user.save({validateBeforeSave:false})
       return {accessToken,refreshToken}
    } catch (error) {
        throw new APIError(500,"Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
  //get user details from frontend
  //validation - not empty
  //check if user is already registered
  //check for images,avatar
  //upload on cloudinary

  //create user object for db
  //remove pass word and refresh token field from response
  //check for user creation
  //return response or error
  const {username,email,password,fullName} = req.body;
 
  if(fullName==""){
    throw new APIError(400,"Fullname is required")
  }else if(username==""){
    throw new APIError(400,"userName is required")
  } else if(password==""){
    throw new APIError(400,"password is required")
  }else if(email==""){
    throw new APIError(400,"email is required")
  }
  const existed = await User.findOne({
    $or:[{email},{username}]
  })

  if(existed) {
    throw new APIError(409,"user already exists")   //409 is status code if user already exists
  }

 
 
  const avatarLocalPath = req.files?.avatar?.[0].path
 
  const coverImageLocalPath = req.files?.coverImage?.[0].path

  if(!avatarLocalPath){
    throw new APIError(400,"avatar is req")
  }

  const avatar = await uploadONCloudinary(avatarLocalPath)
  const coverImage  = await uploadONCloudinary(avatarLocalPath)

  if(!avatar){
    throw new APIError(400,"avatar failed to upload")
  }

  const user = await User.create({
    fullName,
    avatar:avatar.url,
    email,
    username:username.toLowerCase(),
    coverImage:coverImage?coverImage.url:null,
    password
  })
  

  const checkIfUserCreated =await User.findById(user._id).select(
    "-password -refToken"
  )
  if(!checkIfUserCreated){
    throw new APIError(400,"Something went wrong while registering the user")
  }

  return res.status(201).json(
    new APIResponce(200,"User created successfully",checkIfUserCreated)
  )


 
})


const  loginUser = asyncHandler(async (req,res)=>{
    //req from a user , req.body will contain password and username/email
    //if any of this field is empty a error will be thrown
    //check if the email and password matches to any one stored in userSchema
    //access and request tokens
    // if not tell user register
    //response with user details

    const {email,username,password} = req.body
      
    if(!username&&!email){
        throw new APIError(400,"email or username is required")
    }

    const user = await User.findOne({
email
  })

    if(!user){
        throw new APIError(404,"user was not found")

    }
    
    // the custom metthods are only found in our user not in mongoose schema
  
    const passwordCheck =    await user.isPasswordCorrect(password);
    if(!passwordCheck){
        throw new APIError(404,"password is not valid")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refToken")

     const  options={
        httpOnly:true,
        secure:true
     }

     return res.status(200).cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
        new APIResponce(200,{
            user:loggedInUser,accessToken,refreshToken
        },"user loggen in successfully")
     )
})

const logOutUser = asyncHandler(async(req,res)=>{
      
       const userID = req.user._id
       const user  = await User.findByIdAndUpdate(userID,{
        $set:{
          refToken:undefined
        }
       },{
        new:true
       })


       const  options={
        httpOnly:true,
        secure:true
     }


     return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options) .json(new APIResponce(200, {}, "User logged Out"))

})

const refreshAccessToken = asyncHandler(async (req,res)=>{
  const incomingRefreshToken = req.cookie.refreshToken||req.body.refToken

  if(!incomingRefreshToken){
        throw new APIError(401,"unauthorized request")
  }
  try {
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user =await User.findById(decodedToken?._id)
  
    if(!user){
      throw new APIError(404,"invalid token")
    }
  
    if(incomingRefreshToken!==user?.refToken){
      throw new APIError(401,"refresh token is expired or used")
    }
  
    const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    const options = {
      httpOnly:true,
      secure:true
    }
  
    return res.status(200).cookie("accessToken",accessToken,options).cookie("newrefreshToken",newrefreshToken,options)
    .json(new APIResponce(200,{accessToken,refreshToken:newrefreshToken},"Access Token Refreshed"))
  } catch (error) {
    throw new APIError(401,"unexpected error occurred")
  }

})

export {registerUser,loginUser,logOutUser,refreshAccessToken};
