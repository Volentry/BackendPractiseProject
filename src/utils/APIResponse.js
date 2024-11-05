class APIResponce extends Response{
    constructor(statusCode,
        message="success",
        data){
            super()
            this.statusCode=statusCode,
            this.data=data,
            this.message=message
            ,this.success= statusCode<400

    }
}

export default APIResponce

// learn about all the files in utils briefly from chatgpt or DOCS