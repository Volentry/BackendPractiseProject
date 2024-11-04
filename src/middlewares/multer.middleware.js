import multer from 'multer'

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/temp")   // null indicates no error
    },filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})

export const upload = multer({
    storage:storage
})