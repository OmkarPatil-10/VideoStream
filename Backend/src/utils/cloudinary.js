import {v2 as cloudinary} from "cloudinary";
import fs from "fs"; //used to handle file system

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET ,
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        
        //upload the file on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //file has been uploaded successfully
        // console.log("File is uploaded on cloudinary ", response.url);

        fs.unlinkSync(localFilePath)
        
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return

        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error("Cloudinary delete failed:", error.message) //uses the console.error instead of throw error bcz Failure shouldn’t impact the main database operation,
    }
}


export {uploadOnCloudinary, deleteFromCloudinary}