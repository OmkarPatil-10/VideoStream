import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist :)

// 1. Check for name & description
    if (!name || !description) {
        throw new ApiError(400, "Both name and description are required")        
    }

// 2. Create playlist
    const playlist = await Playlist.create(
        {
            name: name.trim(),
            description: description.trim(),
            owner: req.user._id
        }
    )

    if (!playlist) {
        throw new ApiError(500, "Error while creating a playlist")
    }

// 3. Return response 
    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists :)

// 1. Check for the user
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404, "User not found")
    }

// 2. Get the playlist
    const userPlaylists = await Playlist.find({owner: userId}).sort({createdAt:-1})
    // get the user playlist. if playlist is not there then it will return an empty array []

//3. Return response
    return res.status(200).json(
        new ApiResponse(200, userPlaylists, "Playlist fetched successfully")
    )

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id :)

// 1. check the playlist id
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }

// 2. Get the playlist
    const playlist = await Playlist.findById(playlistId)
                                   .populate({
                                        path: "videos",
                                        select: "title thumbnail duration views owner",
                                        populate : {
                                            path: "owner",
                                            select: "fullname avatar"
                                        }
                                   }) 
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

// 3. Return response
    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    )

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: add video to playlist :)

// 1. Validate playlistID & videoID
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId")
    }

// 2. Check the playlist exist or not
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

// 3. Check the playlist owner
    if(!playlist.owner.equals(req.user._id)){
        throw new ApiError(403, "You are not allowed to modify this playlist")
    }

// 4. Add video to playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: videoId }},
        { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(500, "Error while adding video to a playlist")
    }

// 5. Return res
    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

// 1. Validate IDs
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId");
    }

// 2. Find playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

// 3. Ownership check
    if (!playlist.owner.equals(req.user._id)) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

// 4. Remove video
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true }
    ).populate({
        path: "videos",
        select: "thumbnail title duration owner",
        populate: {
            path: "owner",
            select: "fullname avatar"
        }
    });

// 5. Response
    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist :)

// 1. Check the playlistID
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistID")
    }

//2. Check playlist and owner to delete the playlist
    const deletedPlaylist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: req.user._id
    })

    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found or unauthorized")
    }

// 3. return res
    return res.status(200).json(
        new ApiResponse(200, {}, "Playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist :)

// 1. Check the playlistID
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistID")
    }

// 2. Check for atleast one data to update
    if (!name && !description) {
        throw new ApiError(400, "At least one field is required")
    }

    const updateFields = {}

    if(name) updateFields.name = name
    if(description) updateFields.description = description

//3. Update the data if owner of playlist doing it

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {_id: playlistId, owner: req.user._id},
        { $set: updateFields },
        { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(403, "You are not allowed to update this playlist")
    }

//4. Return res
    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}