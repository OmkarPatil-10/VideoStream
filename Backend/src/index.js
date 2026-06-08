// require('dotenv').config({path: './env'});

import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})

import connectDB from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 3000

console.log("RUNNING FILE:", import.meta.url);


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port: ${PORT}`);
            app.on("error", (error) => {
                console.log("ERROR: ", error);

            })
        })
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed!!!", error);

    })

/*
//1st apporach 
import express from "express"
const app = express()

//IFFE function 
;( async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error", (error) => {
            console.log("ERROR:", error);
            throw error
       })
    } catch (error) {
        console.error("Error", error)
        throw error
    }
}
)()
*/ 