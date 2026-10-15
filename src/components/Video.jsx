import React, { useEffect, useState } from 'react'
import axios from 'axios'
import profile from '../assets/logo.jpg'
import { jwtDecode } from 'jwt-decode'
import { useParams, useNavigate } from 'react-router-dom'

const Video = () => {
  const [video, setVideo] = useState({})
  const [comment, setComment] = useState('')
  const [commentList, setCommentList] = useState([])
  const [commentLoading, setCommentLoading] = useState(false)
  const [isSubscribed, setSubscribed] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedComment, setEditedComment] = useState('')

  const { id } = useParams()
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('token')

  let loggedUserId = null

  try {
    if (token) {
      const decoded = jwtDecode(token)
      loggedUserId = decoded._id || decoded.id || decoded.userId
    }
  } catch (err) {
    console.log('Invalid token')
  }

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  useEffect(() => {
    getVideo()
    getComment()
  }, [id])

  const getVideo = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/video/getVideo/${id}`
      )

      const videoData = response.data.Video
      setVideo(videoData)

      const ownerId = String(
        videoData.uploadedBy?._id || videoData.uploadedBy || ''
      )
      const currentUserId = String(loggedUserId || '')

      setIsOwner(
        Boolean(currentUserId && ownerId === currentUserId)
      )

      setIsLiked(
        Boolean(
          currentUserId &&
          videoData.likeUsers?.some(
            userId => String(userId?._id || userId) === currentUserId
          )
        )
      )

      setIsDisliked(
        Boolean(
          currentUserId &&
          videoData.dislikeUsers?.some(
            userId => String(userId?._id || userId) === currentUserId
          )
        )
      )

      if (loggedUserId && videoData.uploadedBy?._id) {
        try {
          const userResponse = await axios.get(
            `${apiUrl}/user/profile`,
            authHeaders()
          )

          const currentUser = userResponse.data.user
          const subscribedTo = currentUser?.subscribedTo || []

          setSubscribed(
            subscribedTo.some(
              user => String(user?._id || user) ===
                String(videoData.uploadedBy._id)
            )
          )
        } catch (err) {
          console.log(
            'Subscription status error:',
            err.response?.data || err.message
          )
        }
      } else {
        setSubscribed(false)
      }
    } catch (err) {
      console.log(
        'Error fetching video:',
        err.response?.data || err.message
      )
    }
  }

  const getComment = async () => {
    try {
      const commentRes = await axios.get(
        `${apiUrl}/comment/video/${id}`,
        authHeaders()
      )

      setCommentList(
        [...(commentRes.data.comments || [])].reverse()
      )
    } catch (err) {
      console.log(
        'Get Comment Error:',
        err.response?.data || err.message
      )
    }
  }

  const addComment = async () => {
    if (!token) {
      swal('Login Required', 'Please login to comment.', 'warning')
      return
    }

    if (!comment.trim()) {
      swal('Oops!', 'Please write a comment.', 'warning')
      return
    }

    try {
      setCommentLoading(true)

      await axios.post(
        `${apiUrl}/comment/addComment/${video._id}`,
        { comment: comment.trim() },
        authHeaders()
      )

      setComment('')
      await getComment()
      swal('Success!', 'New comment added!', 'success')
    } catch (err) {
      console.log(
        'Add Comment Error:',
        err.response?.data || err.message
      )
      swal('Oops!', 'Failed to add comment.', 'error')
    } finally {
      setCommentLoading(false)
    }
  }

  const Subscribe = async (channelId) => {
    if (!token) {
      swal('Login Required', 'Please login to subscribe.', 'warning')
      return
    }

    if (!channelId) return

    try {
      const action = isSubscribed ? 'unsubscribe' : 'subscribe'

      await axios.put(
        `${apiUrl}/user/${action}/${channelId}`,
        {},
        authHeaders()
      )

      setSubscribed(prev => !prev)
    } catch (err) {
      console.log(
        'Subscribe Error:',
        err.response?.data || err.message
      )
      swal('Oops!', 'Could not update subscription.', 'error')
    }
  }

  const Like = async () => {
    if (!token) {
      swal('Login Required', 'Please login to like videos.', 'warning')
      return
    }

    try {
      const res = await axios.put(
        `${apiUrl}/video/like/${video._id}`,
        {},
        authHeaders()
      )

      if (res.data.video) {
        const updatedVideo = res.data.video
        setVideo(prev => ({ ...prev, ...updatedVideo }))

        const currentUserId = String(loggedUserId || '')

        setIsLiked(
          updatedVideo.likeUsers?.some(
            userId => String(userId?._id || userId) === currentUserId
          ) || false
        )

        setIsDisliked(
          updatedVideo.dislikeUsers?.some(
            userId => String(userId?._id || userId) === currentUserId
          ) || false
        )
      } else {
        await getVideo()
      }
    } catch (err) {
      console.log('Like Error:', err.response?.data || err.message)
    }
  }

  const Dislike = async () => {
    if (!token) {
      swal('Login Required', 'Please login to dislike videos.', 'warning')
      return
    }

    try {
      const res = await axios.put(
        `${apiUrl}/video/dislike/${video._id}`,
        {},
        authHeaders()
      )

      if (res.data.video) {
        const updatedVideo = res.data.video
        setVideo(prev => ({ ...prev, ...updatedVideo }))

        const currentUserId = String(loggedUserId || '')

        setIsLiked(
          updatedVideo.likeUsers?.some(
            userId => String(userId?._id || userId) === currentUserId
          ) || false
        )

        setIsDisliked(
          updatedVideo.dislikeUsers?.some(
            userId => String(userId?._id || userId) === currentUserId
          ) || false
        )
      } else {
        await getVideo()
      }
    } catch (err) {
      console.log('Dislike Error:', err.response?.data || err.message)
    }
  }

  const LikeComment = async (commentId) => {
    if (!token) {
      swal('Login Required', 'Please login to like comments.', 'warning')
      return
    }

    try {
      const res = await axios.put(
        `${apiUrl}/comment/likeUnlike/${commentId}`,
        {},
        authHeaders()
      )

      const updatedComment = res.data.comment

      if (updatedComment) {
        setCommentList(prev =>
          prev.map(item =>
            item._id === commentId
              ? {
                  ...item,
                  ...updatedComment
                }
              : item
          )
        )
      } else {
        await getComment()
      }
    } catch (err) {
      console.log(
        'Comment Like Error:',
        err.response?.data || err.message
      )
    }
  }

  const DislikeComment = async (commentId) => {
    if (!token) {
      swal('Login Required', 'Please login to dislike comments.', 'warning')
      return
    }

    try {
      const res = await axios.put(
        `${apiUrl}/comment/dislikeUndislike/${commentId}`,
        {},
        authHeaders()
      )

      const updatedComment = res.data.comment

      if (updatedComment) {
        setCommentList(prev =>
          prev.map(item =>
            item._id === commentId
              ? {
                  ...item,
                  ...updatedComment
                }
              : item
          )
        )
      } else {
        await getComment()
      }
    } catch (err) {
      console.log(
        'Comment Dislike Error:',
        err.response?.data || err.message
      )
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const willDelete = await swal({
        title: 'Are you sure?',
        text: 'Do you really want to delete this comment?',
        icon: 'warning',
        buttons: ['Cancel', 'Yes, Delete'],
        dangerMode: true
      })

      if (!willDelete) return

      await axios.delete(
        `${apiUrl}/comment/${commentId}`,
        authHeaders()
      )

      setCommentList(prev =>
        prev.filter(item => item._id !== commentId)
      )

      swal('Deleted!', 'Comment deleted successfully.', 'success')
    } catch (err) {
      console.log(
        'Delete Comment Error:',
        err.response?.data || err.message
      )

      swal(
        'Oops!',
        err.response?.data?.message || 'Failed to delete comment.',
        'error'
      )
    }
  }

  const handleEditComment = (commentItem) => {
    setEditingCommentId(commentItem._id)
    setEditedComment(commentItem.comment || '')
  }

  const saveEditedComment = async (commentId) => {
    if (!editedComment.trim()) {
      swal('Oops!', 'Comment cannot be empty.', 'warning')
      return
    }

    try {
      await axios.put(
        `${apiUrl}/comment/${commentId}`,
        { comment: editedComment.trim() },
        authHeaders()
      )

      setCommentList(prev =>
        prev.map(item =>
          item._id === commentId
            ? { ...item, comment: editedComment.trim() }
            : item
        )
      )

      setEditingCommentId(null)
      setEditedComment('')

      swal('Success!', 'Comment updated successfully.', 'success')
    } catch (err) {
      console.log(
        'Edit Comment Error:',
        err.response?.data || err.message
      )

      swal(
        'Oops!',
        err.response?.data?.message || 'Failed to update comment.',
        'error'
      )
    }
  }

  const openChannelProfile = () => {
    const creatorId =
      video.uploadedBy?._id || video.uploadedBy

    if (creatorId) {
      navigate(`/profile/${creatorId}`)
    }
  }

  return (
    <div className="video-page">
      <div className="video-left">
        <div className="video-player">
          <video
            className="video"
            controls
            src={video.videoUrl}
          />

          <div>
            <p className="video-title">{video.title}</p>

            <div className="video-data">
              <p>{video.views || 0} views</p>
              <span>•</span>
              <span>{video.likeUsers?.length || 0} likes</span>
              <span>•</span>
              <p>
                {video.createdAt &&
                  new Date(video.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
              </p>
            </div>
          </div>

          <div className="video-channel-info">
            <img
              className="profile-pic clickable-profile"
              src={video.uploadedBy?.profilePicUrl || profile}
              alt="Channel Profile"
              title="View channel profile"
              onClick={openChannelProfile}
            />

            <div className="video-channel-details">
              <p
                className="channel-name clickable-profile"
                onClick={openChannelProfile}
                title="View channel profile"
              >
                {video.uploadedBy?.channelName || 'Channel'}
              </p>

              <p className="subscriber-count">
                {video.uploadedBy?.subscribers?.length || 0} subscribers
              </p>
            </div>

            {!isOwner && (
              <div className="video-actions">
                <button
                  onClick={Like}
                  className={isLiked ? 'like-btn liked' : 'like-btn'}
                  type="button"
                  title={isLiked ? 'Unlike' : 'Like'}
                  aria-label={isLiked ? 'Unlike video' : 'Like video'}
                >
                  <i
                    className={
                      isLiked
                        ? 'fa-solid fa-thumbs-up'
                        : 'fa-regular fa-thumbs-up'
                    }
                  />
                </button>

                <button
                  onClick={Dislike}
                  className={isDisliked ? 'like-btn disliked' : 'like-btn'}
                  type="button"
                  title={isDisliked ? 'Remove dislike' : 'Dislike'}
                  aria-label={isDisliked ? 'Remove dislike' : 'Dislike video'}
                >
                  <i
                    className={
                      isDisliked
                        ? 'fa-solid fa-thumbs-down'
                        : 'fa-regular fa-thumbs-down'
                    }
                  />
                </button>

                <button
                  onClick={() =>
                    Subscribe(
                      video.uploadedBy?._id || video.uploadedBy
                    )
                  }
                  className={
                    isSubscribed ? 'unsubscribe-btn' : 'subscribe-btn'
                  }
                  type="button"
                >
                  {!isSubscribed && (
                    <i className="fa-regular fa-bell" />
                  )}
                  {' '}
                  {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </button>
              </div>
            )}
          </div>

          <div
            className="video-description"
            dangerouslySetInnerHTML={{
              __html: video.description || ''
            }}
          />
        </div>

        <hr />

        <div className="comment-wrapper">
          <input
            onChange={e => setComment(e.target.value)}
            value={comment}
            className="comment-box"
            type="text"
            placeholder="Write comment"
          />

          <button
            onClick={addComment}
            className="comment-btn"
            type="button"
            disabled={commentLoading}
          >
            {commentLoading && (
              <i className="fa-solid fa-spinner fa-spin-pulse" />
            )}
            {' '}Comment
          </button>
        </div>

        <div className="comments-container">
          <h3>Comments</h3>

          <div className="commentList-wrapper">
            {commentList.map(commentItem => {
              const commentOwnerId = String(
                commentItem.commentBy?._id ||
                commentItem.commentBy ||
                ''
              )

              const currentUserId = String(loggedUserId || '')

              const isCommentOwner = Boolean(
                currentUserId && commentOwnerId === currentUserId
              )

              const videoOwnerId = String(
                video.uploadedBy?._id || video.uploadedBy || ''
              )

              const canDelete = Boolean(
                isCommentOwner ||
                (currentUserId && videoOwnerId === currentUserId)
              )

              return (
                <div className="comment-card" key={commentItem._id}>
                  <div className="comment-user-info">
                    <img
                      className="user-profile"
                      src={
                        commentItem.commentBy?.profilePicUrl || profile
                      }
                      alt="Profile"
                    />

                    <p>
                      {commentItem.commentBy?.channelName || 'User'}
                    </p>

                    <h4>
                      {commentItem.createdAt &&
                        new Date(
                          commentItem.createdAt
                        ).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                    </h4>
                  </div>

                  {editingCommentId === commentItem._id ? (
                    <div className="comment-wrapper">
                      <input
                        className="comment-box"
                        type="text"
                        placeholder="Edit your comment..."
                        value={editedComment}
                        onChange={e => setEditedComment(e.target.value)}
                        autoFocus
                      />

                      <button
                        className="comment-btn save-edit-btn"
                        type="button"
                        onClick={() =>
                          saveEditedComment(commentItem._id)
                        }
                      >
                        Save
                      </button>

                      <button
                        className="comment-btn"
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null)
                          setEditedComment('')
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="commentText">
                      {commentItem.comment}
                    </p>
                  )}

                  <div className="comment-actions">
                    <button
                      type="button"
                      onClick={() => LikeComment(commentItem._id)}
                      className={`comment-action-btn ${
                        commentItem.isLike ? 'liked' : ''
                      }`}
                      title={commentItem.isLike ? 'Unlike' : 'Like'}
                      aria-label="Like comment"
                    >
                      <i
                        className={
                          commentItem.isLike
                            ? 'fa-solid fa-thumbs-up'
                            : 'fa-regular fa-thumbs-up'
                        }
                      />
                      <span>{commentItem.likeCount || 0}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => DislikeComment(commentItem._id)}
                      className={`comment-action-btn ${
                        commentItem.isDislike ? 'disliked' : ''
                      }`}
                      title={
                        commentItem.isDislike
                          ? 'Remove dislike'
                          : 'Dislike'
                      }
                      aria-label="Dislike comment"
                    >
                      <i
                        className={
                          commentItem.isDislike
                            ? 'fa-solid fa-thumbs-down'
                            : 'fa-regular fa-thumbs-down'
                        }
                      />
                      <span>{commentItem.dislikeCount || 0}</span>
                    </button>

                    {isCommentOwner && (
                      <button
                        type="button"
                        className="comment-action-btn"
                        onClick={() => handleEditComment(commentItem)}
                        title="Edit comment"
                        aria-label="Edit comment"
                      >
                        <i className="fa-regular fa-pen-to-square" />
                      </button>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        className="comment-action-btn delete-comment"
                        onClick={() =>
                          handleDeleteComment(commentItem._id)
                        }
                        title="Delete comment"
                        aria-label="Delete comment"
                      >
                        <i className="fa-solid fa-trash-can" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {!commentList.length && (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>

      <div className="video-right">
        Extra videos here...
      </div>
    </div>
  )
}

export default Video
