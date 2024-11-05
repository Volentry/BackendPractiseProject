import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY
    ,api_secret:process.env.CLOUD_API_SECRET

})

const uploadONCloudinary = async function (localFilePath) {

    try {
        if(!localFilePath)return null;
        //upload on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
  
        })


        console.log("file uploaded on cloudinary",response.url)
        return response
        
    } catch (error) {
        //to delete corrupted files
        fs.unlinkSync(localFilePath)
        return null
        
    }
}

export {uploadONCloudinary}