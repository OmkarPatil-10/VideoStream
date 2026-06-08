import mongoose from "mongoose"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message

    const dbstate = mongoose.connection.readyState
     /**
     * 0 = disconnected
     * 1 = connected
     * 2 = connecting
     * 3 = disconnecting
     */

     if (dbstate !== 1 ){
        throw new ApiError(503, "Database is not connected")
     }

    const healthData = {
        serverState : "OK",
        database: "connected",
        uptime: `${Math.floor(process.uptime())} seconds`,
        timestamp: new Date().toISOString()
    }

    return res.status(200).json(
        new ApiResponse(200, healthData, "System is alive")
    )
})

export {
    healthcheck
    }
    