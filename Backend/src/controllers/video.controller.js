import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"
import { Like } from "../models/like.model.js"
import { Subscription } from "../models/subscription.model.js"


const getAllVideos = asyncHandler(async (req, res) => {
    // Extract query parameters from the request. Set default values: page=1, limit=10 if not provided
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    // Convert page and limit to numbers (they come as strings from URL)
    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)

    // Validate page number - must be 1 or greater
    if (pageNumber < 1 || isNaN(pageNumber)) {
        throw new ApiError(400, 'Invalid page number')
    }

    // Validate limit - must be between 1 and 100
    if (limitNumber < 1 || limitNumber > 100 || isNaN(limitNumber)) {
        throw new ApiError(400, 'Limit must be between 1 and 100')
    }

    // Calculate how many videos to skip for pagination. Example: page 2 with limit 10 means skip first 10 videos
    const skip = (pageNumber - 1) * limitNumber

    const matchCondition = {}   // Build the filter conditions for MongoDB query

    // If userId is provided, filter videos by that user
    if (userId) {
        validateMongoId(userId, 'User ID')
        matchCondition.owner = new mongoose.Types.ObjectId(userId)   // Convert userId string to MongoDB ObjectId format
    }

    // If search query is provided, search in title OR description
    if (query) {
        matchCondition.$or = [
            // $regex searches for the text in the query variable. It looks for that text anywhere in the title field (beginning, middle, or end). 'i' makes it case-insensitive
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
        ]
    }

    matchCondition.isPublished = true   // Only show published videos (not drafts)

    const sortOptions = {}   // Build sorting options

    // If sortBy is provided, sort by the specified field
    if (sortBy) {
        sortOptions[sortBy] = sortType === 'asc' ? 1 : -1   // 'asc' = ascending (1), anything else = descending (-1)
    } else {
        sortOptions.createdAt = -1   // Default: sort by creation date, newest first
    }

    // MongoDB aggregation pipeline to fetch videos
    const videos = await Video.aggregate([
        {
            $match: matchCondition   // Step 1: Filter videos based on our conditions
        },
        {
            $sort: sortOptions   // Step 2: Sort the filtered videos
        },
        {
            $skip: skip   // Step 3: Skip videos for pagination (like OFFSET in SQL)
        },
        {
            $limit: limitNumber   // Step 4: Limit the number of results (like LIMIT in SQL)
        },
        {
            $lookup: {   // Step 5: Join with users collection to get owner details
                from: 'users',   // Collection to join with
                foreignField: '_id',   // Field in users collection
                localField: 'owner',   // Field in videos collection
                as: 'owner',   // Name for the joined data
                pipeline: [   // sub pipeline
                    {
                        $project: {   // Only include specific user fields (not password, etc.)
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind: '$owner'   // Step 6: Convert owner from array to single object. $lookup returns an array, but we only have one owner per video
        }
    ])

    // If no videos found, return empty response with pagination info
    if (!videos || videos.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                {
                    videos: [],
                    pagination: {
                        totalVideos: 0,
                        totalPages: 0,
                        currentPage: pageNumber,
                        limit: limitNumber,
                        hasNextPage: false,
                        hasPrevPage: false
                    }
                },
                'No videos found'
            ))
    }

    const totalVideos = await Video.countDocuments(matchCondition)   // Count total videos matching our filters (for pagination)
    const totalPages = Math.ceil(totalVideos / limitNumber)   // Calculate total pages needed. Example: 25 videos with limit 10 = 3 pages

    // Send successful response with videos and pagination info
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                videos: videos,
                pagination: {
                    totalVideos,   // Total count of videos
                    totalPages,   // Total number of pages
                    currentPage: pageNumber,   // Current page number
                    limit: limitNumber,   // Videos per page
                    hasNextPage: pageNumber < totalPages,   // Is there a next page?
                    hasPrevPage: pageNumber > 1   // Is there a previous page?
                }
            },
            'Videos fetched successfully'
        ))
})


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video :)

    // 1. Check for the VideoFile & thumbnail and then upload
    const videoFileLocalPath = req.files?.videoFile[0].path
    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video is required")
    }

    const thumbnailLocalPath = req.files?.thumbnail[0].path
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Video thumbnail is required")
    }

    //2. Upload videoFile & thumbnail on cloudinary
    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) {
        throw new ApiError(400, "Video is required (cloudinary)")
    }

    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail is required (cloudinary)")
    }

    //3. Check for the video-> title & description
    if (!title) {
        throw new ApiError(400, "Video title is required")
    }

    if (!description) {
        throw new ApiError(400, "Video description is required")
    }

    //4. Get the duration of video
    const durationInSecond = videoFile.duration

    const formatDuration = (second) => {
        const hour = Math.floor(second / 3600)
        const min = Math.floor((second % 3600) / 60)
        const sec = Math.floor(second % 60)

        return hour > 0
            ? `${hour}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
            : `${min}:${sec.toString().padStart(2, "0")}`
    }

    const duration = formatDuration(durationInSecond)


    // 5. Create a video object - entry in db
    const video = await Video.create({
        videoFile: videoFile.url,
        videoFile_publicID: videoFile.public_id, // used for deletion on  cloudinary
        thumbnail: thumbnail.url,
        thumbnail_publicID: thumbnail.public_id,
        title: title,
        description: description,
        duration: duration,
        owner: req.user._id
    })

    if (!video) {
        throw new ApiError(400, "Error while uploading video")
    }

    // 6. Return response
    return res.status(201).json(
        new ApiResponse(201, video, "Video published successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id
    console.log("USER:", req.user);

    //TODO: get video by id :)
    //TODO: increase the view of video :)
    //TODO: add the video to user watchhistory :)

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoId")
    }

    // Get the video and increment the views
    const video = await Video.findOneAndUpdate(
        { _id: videoId, isPublished: true },
        { $inc: { views: 1 } },
        { new: true }
    ).populate("owner", "username avatar fullname")

    console.log(video);
    if (!video) {
        throw new ApiError(400, "Video is unavailable")
    }


    if (req.user) {

        // Remove video if already exists
        await User.findByIdAndUpdate(
            userId,
            {
                $pull: { watchHistory: video._id }
            }
        )

        // Add video to front
        await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    watchHistory: {
                        $each: [video._id],
                        $position: 0
                    }
                }
            }
        )
    }


    // Check if the current user has liked the video
    const isLiked = req.user ? await Like.exists({ video: videoId, likedBy: req.user._id }) : false;
    
    // Check if the current user has subscribed to the owner of this video
    const isSubscribed = req.user && video.owner ? await Subscription.exists({ subscriber: req.user._id, channel: video.owner._id }) : false;

    const videoData = {
        ...video.toObject(),
        isLiked: !!isLiked,
        isSubscribed: !!isSubscribed
    };

    return res.status(200).json(
        new ApiResponse(200, videoData, "Video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailLocalPath = req.file?.path
    //TODO: update video details like title, description, thumbnail

    // 1. Check for the video is present or not
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoId")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video is unavailable")
    }

    //2. check the neccessary information
    if (!title && !description && !thumbnailLocalPath) {
        throw new ApiError(400, "At least one field is required")
    }

    //3. Update the title and description

    const updateFields = {}   // this will hold an updated information which are passed by user // dynamic => can hold 1Data(title) OR 3Data(title, description, thumbnail)

    if (title) updateFields.title = title.trim()
    if (description) updateFields.description = description.trim()

    //4. Update the thumbnail
    if (thumbnailLocalPath) {
        const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if (!newThumbnail.url || !newThumbnail.public_id) {
            throw new ApiError(500, "Error while updating thumbnail")
        }

        updateFields.thumbnail = newThumbnail.url
        updateFields.thumbnail_publicID = newThumbnail.public_id
    }

    //5. Update all information
    const updatedVideo = await Video.findOneAndUpdate(
        {  // Allow only owner of the video to update
            _id: videoId, owner: req.user._id
        },
        {
            $set: updateFields
        },
        {
            new: true,
            runValidators: true
        }
    )

    if (!updatedVideo) {
        throw new ApiError(403, "Video not found or you are not allowed to update this video")
    }

    // Delete old thumbnail
    if (thumbnailLocalPath && video.thumbnail_publicID) {
        deleteFromCloudinary(video.thumbnail_publicID)
    }


    //5. Return response 
    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invlaid videoId")
    }

    // check owner of the video and delete
    const video = await Video.findOneAndDelete({
        _id: videoId,
        owner: req.user?._id
    })

    if (!video) {
        throw new ApiError(403, "You are not allowed to delete this video")
    }

    // Delete thumbnail and videoFile from cloudinary
    if (video.thumbnail_publicID) {
        deleteFromCloudinary(video.thumbnail_publicID)
    }
    if (video.videoFile_publicID) {
        deleteFromCloudinary(video.videoFile_publicID)
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    // Check for the owner 
    const video = await Video.findOne({
        _id: videoId,
        owner: req.user?._id
    })

    if (!video) {
        throw new ApiError(403, "You are not allowed to change the status of this video")
    }

    // Toggle the status
    video.isPublished = !video.isPublished

    // Save the video status
    await video.save({ validateBeforeSave: false })

    // return response
    return res.status(200).json(
        new ApiResponse(200, video.isPublished, `Video is successfully ${video.isPublished ? "Published" : "Unpublished"}`)
    )

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}