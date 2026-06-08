import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getAllTweets = asyncHandler(async (req, res) => {
    console.log("getAllTweets endpoint hit");
    // Get all tweets from all users, newest first
    const tweets = await Tweet.find({})
                              .populate("owner", "username fullname avatar")
                              .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, tweets, "All tweets fetched successfully")
    )
})

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet :)
    const {tweetContent} = req.body
    
    // Check the user passes the content or not
    if(!tweetContent || !tweetContent.trim()){
        throw new ApiError(400, "Tweet Content is required")
    }

    // Create the tweet document
    const tweet = await Tweet.create({
        content : tweetContent.trim(), // trim() is used to remove the white spaces at start & end
        owner: req.user._id
    })

    // Check whether tweet document is created or not [not neccessary bcz ".create()" does the error part] [used for only safety check]
    if(!tweet){
        throw new ApiError(500, "Problem while creating tweet")
    }

    //return response
    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully")
    )

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets :)
    const {userId} = req.params

    // Check for the user
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    const user = await User.findById(userId)
    
    if(!user){
        throw new ApiError(404, "User not found")
    }

    // Get the tweet
    const userTweets = await Tweet.find({owner: userId})
                                 .populate("owner", "username fullname avatar")
                                 .sort({createdAt: -1}) //latest first

    if(userTweets.length == 0 ){
        throw new ApiError(404, "The user has no tweets")
    }

    // return res
    return res.status(200).json(
        new ApiResponse(200, userTweets, "Tweet fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet :)
    const {tweetId} = req.params
    const {tweetContent} = req.body

    // get the current tweet 
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet is unavailable")
    }

    // check for the tweet content
    if(!tweetContent || !tweetContent.trim() ){
        throw new ApiError(400, "Tweet content is required to update the tweet")
    }

    if (tweet.content === tweetContent.trim()) {
        throw new ApiError(400, "New content must be different from old content");
    }

    // update the tweet document
    const updatedTweet = await Tweet.findOneAndUpdate(
        { _id:tweetId, owner:req.user._id},
        { content: tweetContent.trim() },
        { new:true, runValidators: true}
    )

    if (!updatedTweet) {
        throw new ApiError(403, "You are not authorized to update this tweet")
    }

    // return res
    return res.status(200).json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet :)
    const {tweetId}= req.params

    //check for the tweet
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    // delete the tweet based on owner 
    const deletedTweet = await Tweet.findOneAndDelete({ _id:tweetId, owner: req.user._id })

    if(!deletedTweet){
        throw new ApiError(403, "You are not authorized to delete this tweet")
    }

    // return res
    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet deleted successfully")
    )
})

export {
    getAllTweets,
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}