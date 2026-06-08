import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"

// TODO: check the like count
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video:)
    

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const existingVideoLike = await Like.findOneAndDelete({video: videoId, likedBy: req.user._id})

    if(!existingVideoLike){
        const videoLike = await Like.create({
            video: videoId,
            likedBy: req.user._id,
        })

        if(!videoLike){
            throw new ApiError(500, "Error while Liking the video")
        }

        const videoLikeCount = await Like.countDocuments({video: videoId})

        return res.status(201).json(
            new ApiResponse(201, {videoLike, videoLikeCount}, "Video liked successfully")
        )
    }

    const videoLikeCount = await Like.countDocuments({video: videoId})

    return res.status(200).json(
        new ApiResponse(200, videoLikeCount , "Video disliked successfully")
    )

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment :)

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid CommentId")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const existingCommentLike = await Like.findOneAndDelete({
        comment: commentId, likedBy: req.user._id
    })

    if (!existingCommentLike) {
        const commentLike = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        if (!commentLike) {
            throw new ApiError(500, "Error while liking the comment")
        }

        const commentLikeCount = await Like.countDocuments({comment: commentId})

        return res.status(201).json(
            new ApiResponse(201, {commentLike , commentLikeCount }, "Comment liked successfully")
        )
    }

    const commentLikeCount = await Like.countDocuments({comment: commentId})

    return res.status(200).json(
        new ApiResponse(200, commentLikeCount, "Comment disliked successfully")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet :)
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    const existingTweetLike = await Like.findOneAndDelete({
        tweet: tweetId, likedBy: req.user._id
    })

    if (!existingTweetLike) {
        const tweetLike = await Like.create({
            tweet: tweetId, likedBy: req.user._id
        })

        if(!tweetLike){
            throw new ApiError(500, "Error while liking the tweet")
        }

        const tweetLikeCount = await Like.countDocuments({tweet: tweetId})

        return res.status(201).json(
            new ApiResponse(201, { tweetLike, tweetLikeCount }, "Tweet liked successfully")
        )
    }

    const tweetLikeCount = await Like.countDocuments({tweet: tweetId})
    return res.status(200).json(
        new ApiResponse(200, tweetLikeCount, "Tweet disliked successfully")
    )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos :)
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                foreignField: "_id",
                localField: "video",
                as: "video"
            }
        },
        {
            $unwind: "$video"
        },
        {
            $sort: {
                createdAt: -1 //get the most recent like video
            }
        },
        {
            $project: {
                _id: 0,
                video: 1
            }
        }
    ])

    const videos = likedVideos.map( item => item.video)

    const message = videos.length ? "Liked videos fetched successfully" : "No liked videos yet";

    return res.status(200).json(
        new ApiResponse(200, videos, message)
    )


})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}