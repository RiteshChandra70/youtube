import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import profile from '../assets/logo.jpg'
import loader from '../assets/loader.gif'

const Profile = () => {
  const { userId } = useParams()

  const [channel, setChannel] = useState({})
  const [videos, setVideos] = useState([])
  const [page, setPage] = useState(1)

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalVideos: 0
  })

  const [loading, setLoading] = useState(true)
  const [videosLoading, setVideosLoading] = useState(true)
  const [error, setError] = useState('')

  const apiUrl = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  // Check whether this is my profile or another channel
  const isMyProfile = !userId

  // Load the correct channel profile
  useEffect(() => {
    let cancelled = false

    const getProfile = async () => {
      setLoading(true)
      setError('')
      setChannel({})

      try {
        let response

        if (userId) {
          // Public profile of the channel that was clicked
          response = await axios.get(
            `${apiUrl}/user/profile/${userId}`
          )
        } else {
          // My own profile
          if (!token) {
            setError('Please login first.')
            return
          }

          response = await axios.get(
            `${apiUrl}/user/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        }

        console.log('Profile response:', response.data)

        if (!cancelled) {
          setChannel(response.data.user || {})
        }
      } catch (err) {
        console.error(
          'Profile error:',
          err.response?.data || err.message
        )

        if (!cancelled) {
          setError(
            err.response?.data?.error ||
            err.response?.data?.message ||
            'Unable to load profile.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    getProfile()

    return () => {
      cancelled = true
    }
  }, [apiUrl, userId])

  // Reset pagination when switching channels
  useEffect(() => {
    setPage(1)
  }, [userId])

  // Load videos belonging to the selected channel
  useEffect(() => {
    let cancelled = false

    const getChannelVideos = async () => {
      setVideosLoading(true)
      setVideos([])
      setPagination({
        currentPage: page,
        totalPages: 0,
        totalVideos: 0
      })

      try {
        let response

        if (userId) {
          // Videos from the selected channel
          response = await axios.get(
            `${apiUrl}/video/user/${userId}?page=${page}`
          )
        } else {
          // My own uploaded videos
          if (!token) {
            return
          }

          response = await axios.get(
            `${apiUrl}/video/my-videos?page=${page}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        }
        console.log('Channel videos response:', response.data)

        if (!cancelled) {
          setVideos(response.data.videos || [])
          setPagination(
            response.data.pagination || {
              currentPage: page,
              totalPages: 0,
              totalVideos: 0
            }
          )
        }
      } catch (err) {
        console.error(
          'Channel videos error:',
          err.response?.data || err.message
        )

        if (!cancelled) {
          setVideos([])
        }
      } finally {
        if (!cancelled) {
          setVideosLoading(false)
        }
      }
    }

    getChannelVideos()

    return () => {
      cancelled = true
    }
  }, [apiUrl, userId, page])

  const formatViews = (views = 0) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    }

    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    }

    return `${views} views`
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <img className="loader" src={loader} alt="Loading profile..." />
      </div>
    )
  }

  if (error && !channel._id) {
    return (
      <div className="profile-wrapper">
        <div className="profile-error">{error}</div>
      </div>
    )
  }

  return (
    <div className="profile-wrapper">
      {error && (
        <div className="profile-error">
          {error}
        </div>
      )}

      {/* Channel cover */}
      <section className="channel-cover">
        {channel.coverPicUrl ? (
          <img
            className="channel-cover-image"
            src={channel.coverPicUrl}
            alt="Channel cover"
          />
        ) : (
          <div className="channel-cover-placeholder">
            <span>{channel.channelName || 'Channel'}</span>
          </div>
        )}

        {isMyProfile && (
          <div className="cover-edit-area">
            <button
              type="button"
              className="cover-edit-btn"
              onClick={() =>
                alert('Cover photo upload API abhi connect nahi hai.')
              }
            >
              Edit Cover
            </button>
          </div>
        )}

        <div className="channel-details">
          <div className="channel-profile-image">
            <img
              className="channel-profile"
              src={channel.profilePicUrl || profile}
              alt="Channel profile"
            />

            {isMyProfile && (
              <button
                type="button"
                className="profile-photo-edit"
                title="Edit profile photo"
                onClick={() =>
                  alert('Profile photo upload API abhi connect nahi hai.')
                }
              >
                ✎
              </button>
            )}
          </div>

          <div className="channel-info">
            <h2>{channel.channelName || 'Channel Name'}</h2>

            <p className="channel-subscribers">
              {channel.subscribersCount ??
                channel.subscribers?.length ??
                0}{' '}
              subscribers
            </p>

            <p className="channel-description">
              {channel.description || 'Welcome to my channel!'}
            </p>
          </div>

          {isMyProfile && (
            <button
              type="button"
              className="edit-profile-btn"
              onClick={() =>
                alert('Profile edit page/API abhi connect nahi hai.')
              }
            >
              Edit Profile
            </button>
          )}
        </div>
      </section>

      {/* Selected channel's videos */}
      <section className="my-videos-section">
        <div className="my-videos-heading">
          <div>
            <h2>
              {isMyProfile
                ? 'My Videos'
                : `${channel.channelName || 'Channel'} Videos`}
            </h2>

            <p>
              {pagination.totalVideos || 0} uploaded videos
            </p>
          </div>
        </div>

        {videosLoading ? (
          <div className="videos-message">
            <img src={loader} alt="Loading videos..." />
            <p>Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="videos-empty">
            <h3>No videos found</h3>
            <p>
              {isMyProfile
                ? 'Your uploaded videos will appear here.'
                : 'This channel has not uploaded any videos yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="my-videos-grid">
              {videos.map((video) => (
                <article
                  className="my-video-card"
                  key={video._id}
                >
                  <div
                    className="my-video-thumbnail"
                    onClick={() => navigate(`/video/${video._id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Enter' ||
                        event.key === ' '
                      ) {
                        event.preventDefault()
                        navigate(`/video/${video._id}`)
                      }
                    }}
                  >
                    <img
                      src={video.thumbnailUrl || profile}
                      alt={video.title || 'Video thumbnail'}
                    />
                  </div>

                  <div className="my-video-info">
                    <h3 title={video.title}>
                      {video.title || 'Untitled video'}
                    </h3>

                    <p>{formatViews(video.views || 0)}</p>

                    <p className="my-video-category">
                      {video.category || 'Uncategorized'}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="profile-pagination">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage(currentPage => currentPage - 1)
                  }
                >
                  ← Previous
                </button>

                <span>
                  Page {page} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setPage(currentPage => currentPage + 1)
                  }
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default Profile
