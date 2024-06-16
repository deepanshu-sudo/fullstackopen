import { useState } from 'react'
import { useDispatch } from 'react-redux'
import blogService from '../services/blogs'
import { createBlog } from '../reducers/blogReducer'
import { useNotification } from '../hooks'
import { Input } from './ui/input'
import { Button } from './ui/button'

const BlogForm = ({ blogFormRef }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const dispatch = useDispatch()
  const notify = useNotification()

  const handleChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()
    blogService
      .create(newBlog)
      .then(returnedBlog => {
        dispatch(createBlog(returnedBlog))
        notify(`a new blog ${newBlog.title} by ${newBlog.author} successfully added`, 'info')
        setNewBlog({ title: '', author: '', url: '' })
      })
      .catch((error) => notify(error.response.data.error, 'error'))

  }

  return (
    <>
      <h3 className='text-lg pt-5'>Create Blog</h3>
      <form onSubmit={handleSubmit}>
        <div className='mb-1'>
          <Input type='text' value={newBlog.title} name='title' onChange={handleChange} placeholder='title' />
        </div>
        <div className='mb-1'>
           <Input type='text' value={newBlog.author} name='author' onChange={handleChange} placeholder='author' />
        </div>
        <div className='mb-1'>
           <Input type='text' value={newBlog.url} name='url' onChange={handleChange} placeholder='url' />
        </div>
        <Button type="submit" className='inline-block mt-2'>create</Button>
      </form>
    </>
  )
}

export default BlogForm