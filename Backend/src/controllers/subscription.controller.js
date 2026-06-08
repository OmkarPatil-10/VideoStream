import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscriberId = req.user._id
    // TODO: toggle subscription :)

    // Check for the channel
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invlaid Channel Id")
    }

    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(404, "Channel not found")
    }

    // Check the req.user is not subscribing his own channel
    if (channelId.toString() === subscriberId.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    // Toggle subscription
    const existingSubscription = await Subscription.findOneAndDelete({ channel: channelId, subscriber: req.user._id})

    if (existingSubscription) {
       return res.status(200).json(
        new ApiResponse(200, {}, "Channel unsubscribed")
       )
    }

    const subscription = await Subscription.create(
        {
            subscriber: req.user._id,
            channel: channelId
        }
    )

    if(!subscription){
        throw new ApiError(500, "Error while subscribing")
    }

    return res.status(201).json(
        new ApiResponse(201, subscription, "Channel subscribed")
    )
    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    // Get the channel 
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invlaid channel id")
    }

    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(404, "Channel not found")
    }

    // Get the subscriber list
    const subscribers = await Subscription.find({channel: channelId})
                                         .populate("subscriber" , "avatar username fullname")
                                         .sort({createdAt: -1}) //get the latest susbscriber 

    // if(subscribers.length === 0){
    //     throw new ApiError(404, "No subscribers yet")
    // }

    // return res
    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    // Get the user(channel)
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }

    const subscriber = await User.findById(subscriberId)
    if (!subscriber) {
        throw new ApiError(404, "No user found")
    }

    // Get the user subscribed channel list 
    const subscribedChannels = await Subscription.find({subscriber: subscriberId})
                                        .populate("channel", "avatar username fullname")
    
    // if(subscribedChannels.length === 0){
    //     throw new ApiError(404, "No subscribed channel yet")
    // }

    // return res
    return res.status(200).json(
        new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully")
    )
})                  

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}