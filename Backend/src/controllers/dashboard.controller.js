import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total videos, total video views,  total likes, total subscribers etc.
    const channelId = req.user._id

    // 1. Total Videos
    const totalVideos = await Video.countDocuments({owner:channelId})

    // 2. Total views 
    const viewsAgg = await Video.aggregate([
        {
            $match: {owner: new mongoose.Types.ObjectId(channelId)}
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views"}
            }
        }]
    )

    const totalViews = viewsAgg[0]?.totalViews || 0

    // 3. Total Likes
     const channelVideos = await Video.find(
        { owner: channelId },
        { _id: 1 }
    );

    const videoIds = channelVideos.map(video => video._id);

    const totalLikes = await Like.countDocuments({
        video: { $in: videoIds }
    });

    // 4. Total Subscribers
    const subscribers = await Subscription.countDocuments({channel : channelId})

    // Return res
    return res.status(200).json(
        new ApiResponse(200 , {totalVideos, totalViews, totalLikes, subscribers}, "Channel stats fetched successfully")
    )
    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelID = req.user._id
    const { page= 1, limit= 10} = req.query

     const pageNumber = parseInt(page, 10);   // Convert page string to integer (base 10)
    const limitNumber = parseInt(limit, 10);   // Convert limit string to integer (base 10)

    const videoAgg = Video.aggregate([
        {
            $match: {owner: new mongoose.Types.ObjectId(channelID)}
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project : {
                videoFile_publicID : 0,
                thumbnail_publicID: 0,
                description: 0,
            }
        }]
    )

    const videos = await Video.aggregatePaginate(videoAgg, {
        page,
        limit
    })

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    )

})

export {
    getChannelStats, 
    getChannelVideos
    }