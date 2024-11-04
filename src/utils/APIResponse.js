class APIResponce extends response{
    constructor(statusCode,
        message="success",
        data){
            this.statusCode=statusCode,
            this.data=data,
            this.message=message
            ,this.success= statusCode<400

    }
}

// learn about all the files in utils briefly from chatgpt or DOCS