import axios from 'axios'
import React, { useEffect, useState } from 'react'
import profile from '../assets/logo.jpg'

const Home = () => {

    const [videos, setVideos] = useState([])

    const apiUrl = import.meta.env.VITE_API_URL

    const getVideo = async () => {
        try {
            const res = await axios.get(
                `${apiUrl}/video/getAllVideo`
            )

            console.log(res.data)

            setVideos([...res.data.Video].reverse())

        } catch (error) {
            console.log("Error fetching videos:", error)
        }
    }

    useEffect(() => {
        getVideo()
    }, [])

    return (
        <div className="home">

            <div className="video-container">

                {videos.length > 0 ? (

                    videos.map((video) => (

                        <div className="video-card" key={video._id}>

                            {/* Thumbnail */}
                            <img
                                className="thumbnail"
                                src={video.thumbnailUrl}
                                alt={video.title}
                            />

                            <div className="video-details">

                                {/* Video Title */}
                                <p className="video-title">
                                    {video.title}
                                </p>

                                <p className='video-description'>
                                    {video.description.length > 50
                                        ? video.description.slice(0, 50) + '...'
                                        : video.description}
                                </p>

                                <div className="channel-info">
                                    {/* Profile Picture */}
                                    <img className="profile-pic"
                                        src={video.uploadedBy?.profilePicUrl || profile}
                                        alt="Profile"
                                    />


                                    {/* Channel Name */}
                                    <p className="channel-name">
                                        {video.uploadedBy?.channelName}
                                    </p>
                                </div>
                                

                                {/* Views */}
                                <div className="video-meta">
                                    <p className="views">
                                        {video.views || 0} views
                                    </p>

                                    <span>•</span>

                                    <p className="upload-date">
                                        {Date.now() - new Date(video.createdAt) < 24 * 60 * 60 * 1000
                                            ? `${Math.floor((Date.now() - new Date(video.createdAt)) / (60 * 60 * 1000))} hours ago`
                                            : `${Math.floor((Date.now() - new Date(video.createdAt)) / (24 * 60 * 60 * 1000))} days ago`}
                                    </p>
                                </div>

                            </div>

                        </div>

                    ))

                ) : (

                    <p>No videos available</p>

                )}

            </div>

        </div>
    )
}

export default Home