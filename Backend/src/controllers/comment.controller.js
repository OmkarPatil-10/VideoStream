import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    // Validate video ID
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const options = {
        page: Number(page),
        limit: Number(limit),
        sort: { createdAt: -1 }
    }

    const commentsAggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        }
    ])

    const comments = await Comment.aggregatePaginate(
        commentsAggregate,
        options
    )

    return res.status(200).json(
        new ApiResponse(200, comments, "Video comments fetched successfully")
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { commentContent } = req.body
    const { videoId } = req.params

    // Get the video 
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    // Check the comment content is empty or not 
    if( !commentContent || !commentContent.trim() ){
        throw new ApiError(400, "Comment content is required")
    }

    // Create a comment document
    const comment = await Comment.create(
        {
            content: commentContent.trim(),
            video: videoId,
            owner: req.user._id
        }
    )

    if (!comment) {
        throw new ApiError(500, "Error while creating comment")
    }

    // return res
    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
     const { commentId } = req.params
     const { commentContent } = req.body

    // Get the comment 
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    // Check the comment 
    if(!commentContent || !commentContent.trim() ){
        throw new ApiError(400, "Comment content is required")
    }

    if(comment.content === commentContent){
        throw new ApiError(400, "New content must be different from old content")
    }

    // Update the comment 
    const updatedComment = await Comment.findOneAndUpdate(
        {
            _id: commentId, owner: req.user._id
        },
        {
            content: commentContent.trim()
        },
        {
            new: true, runValidators: true
        }
    )

    if (!updatedComment) {
        throw new ApiError(403, "Error while updating comment or you are not allowed to update the comment")
    }

    // return res
    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    )

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    // check the comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment Id")
    }

    // delete the comment 
    const deletedComment = await Comment.findOneAndDelete(
        {
            _id: commentId, owner: req.user._id
        }
    )

    if (!deletedComment) {
        throw new ApiError(403, "You are not allowed to delete this comment")
    }

    // return res
    return res.status(200).json(
        new ApiResponse(200, {}, "Comment delete successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }