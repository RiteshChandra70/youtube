import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import loader from '../assets/loader.gif'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const AddVideo = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('education')
  const [tags, setTags] = useState('')
  const [video, setVideo] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [thumbnailName, setThumbnailName] = useState('')
  const [videoName, setVideoName] = useState('')
  const [isLoading, setLoading] = useState(false)

  const api = import.meta.env.VITE_API_URL
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    try {
      e.preventDefault()
      // console.log(title,description,category,tags.split(',')) 
      setLoading(true)
      const videoTag = tags.split(',')
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('tags', JSON.stringify(videoTag))
      formData.append('category', category)
      formData.append('video', video)
      formData.append('thumbnail', thumbnail)
      console.log(formData)

      const uploadedVideoRes = await axios.post(`${api}/video/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log(uploadedVideoRes)
      setLoading(false)
      swal("Uploaded!", "Video Uploaded!", "Success");
      navigate('/')
    }

    catch (err) {
      console.log(err)
      setLoading(false)
      swal("Error!", "Something is Wrong!", "Error");
    }

  }

  const thumbnailHandler = (e) => {
    setThumbnail(e.target.files[0])
    setThumbnailUrl(URL.createObjectURL(e.target.files[0]))
    setThumbnailName(e.target.files[0].name)
    console.log(thumbnailUrl, thumbnailName, thumbnail)
  }

  const videoHandler = (e) => {
    setVideo(e.target.files[0])
    setVideoName(e.target.files[0].name)
    console.log(video)
  }

  return (
    <div className='form-wrapper'>
      {isLoading ? <img className='loader' src={loader} />
        :
        <form className='add-video-form' onSubmit={submitHandler}>
          <p className='add-video-heading'>Upload Video</p>
          <div className="add-video-file-group">

            <input
              id="videoInput"
              type="file"
              accept="video/*"
              onChange={videoHandler}
              hidden
            />

            <p className="add-video-file-name">
              {videoName || "No video selected"}
            </p>

            <button
              className="add-video-file-btn"
              type="button"
              onClick={() => document.getElementById("videoInput").click()}
            >
              <i className="fa-solid fa-upload"></i> Choose Video
            </button>

          </div>
          <input className='add-video-input' onChange={(e) => { setTitle(e.target.value) }} value={title} type="text" name="title" placeholder='Title' />
          <div className="video-description-editor">
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              placeholder="Write description..."
            />
          </div>
          <select className='add-video-input' onChange={(e) => { setCategory(e.target.value) }} value={category}>
            <option value="education">Education</option>
            <option value="technology">Technology</option>
            <option value="sports">Sports</option>
            <option value="science and technology">Science and Technology</option>
            <option value="other">Other</option>
          </select>
          <textarea className='add-video-input' onChange={(e) => { setTags(e.target.value) }} name='tags' placeholder='tags'></textarea>

          <input type="file" className='add-video-file-input' onChange={thumbnailHandler} />
          <button className='add-video-submit-btn' type='submit'>Upload Video</button>
        </form>
      }
    </div>
  )
}

export default AddVideo