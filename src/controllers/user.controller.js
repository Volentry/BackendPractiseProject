import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadONCloudinary } from "../utils/cloudinary.js";
import APIResponce from "../utils/APIResponse.js";
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
  const existed =User.findOne({
    $or:[{email},{username}]
  })

  if(existed) {
    throw new APIError(409,"user already exists")   //409 is status code if user already exists
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path

  if(!avatarLocalPath){
    throw new APIError(400,"avatar is req")
  }

  const avatar = await uploadONCloudinary(avatarLocalPath)
  const coverImage  = await uploadONCloudinary(avatarLocalPath)

  if(avatar){
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
  if(checkIfUserCreated){
    throw new APIError(400,"Something went wrong while registering the user")
  }

  return res.status(201).json(
    new APIResponce(200,"User created successfully",checkIfUserCreated)
  )


 
})

export default registerUser