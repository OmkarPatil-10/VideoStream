import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        callback(null, origin);
    },
    credentials: true,
}))

app.use(express.json({limit: "16kb"})) // to limit json data 
app.use(express.urlencoded({ extended: true, limit:"16kb" })) // use for... understand the urlencoder to express
// extended ->> object inside object
app.use(express.static("public")) // to access the public assest
app.use(cookieParser())


//routes import 
import userRouter from './routes/user.route.js'
import videoRouter from './routes/video.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import dashboardRouter from "./routes/dashboard.routes.js"
import healthCheckRouter from "./routes/healthcheck.routes.js"


//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter )
app.use("/api/v1/tweets", tweetRouter )
app.use("/api/v1/subscriptions", subscriptionRouter )
app.use("/api/v1/comments", commentRouter )
app.use("/api/v1/likes", likeRouter )
app.use("/api/v1/playlists", playlistRouter )
app.use("/api/v1/dashboard", dashboardRouter )
app.use("/api/v1/healthcheck", healthCheckRouter )


// https://localhost:8000/api/v1/users/register
export { app } 