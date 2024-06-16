import { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import { increaseLikes, deleteBlogState, addComment } from '../reducers/blogReducer'
import { useNotification } from '../hooks'
import { ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

function prependHttp(url) {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}


const Blog = ({ blog, currentUser }) => {
  const dispatch = useDispatch()
  const notify = useNotification()
  const navigate = useNavigate()
  const [comment, setComment] = useState('')

  const handleCommentChange = (event) => setComment(event.target.value)

  const handleCommentSubmit = (event) => {
    event.preventDefault()
    blogService
      .addComment(blog.id, { content: comment })
      .then(() => {
        dispatch(addComment({ id: blog.id, comment: { content: comment } }))
        notify(`added a comment "${comment}" on the blog : ${blog.title}`, 'info')
        setComment('')
      })
      .catch((error) => notify(error.response.data.error, 'error'))
  }

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(updatedBlog.id, updatedBlog)
      .then(returnedBlog => {
        dispatch(increaseLikes(returnedBlog))
        notify(`liked ${updatedBlog.title} by ${updatedBlog.author}`, 'info')
      })
      .catch((error) => notify(error.response.data.error, 'error'))
  }

  const handleDeletion = (event) => {
    event.preventDefault()

    const blogTitle = blog.title
    const blogAuthor = blog.author

    if (window.confirm(`Remove ${blogTitle} by ${blogAuthor}?`)) {
      blogService
        .deleteBlog(blog.id)
        .then(() => {
          dispatch(deleteBlogState(blog.id))
          notify(`deleted ${blog.title} by ${blog.author}`, 'info')
          navigate('/')
        })
        .catch((error) => notify(error.response.data.error, 'error'))
    }
  }

  if (!blog) return <div>loading...</div>

  return (
    <>
      <h2 className='text-2xl'>{blog.title} by {blog.author}</h2>

      <div className='py-5'>
        <span className='font-bold mr-2'>url:</span>
        <a href={prependHttp(blog.url)} className='text-blue-600'>
          {blog.url} <ExternalLink className='w-4 h-4 inline-block' />
        </a>
        <br />

        <span className='font-bold mr-2'>likes:</span>
        {blog.likes} <Button variant='ghost' className='p-0 m-0' onClick={handleLike}>👍</Button>
        <br />

        <span className='font-bold mr-2'>user:</span>
        {blog.user.username}
        <br />
      </div>

      {currentUser.username === blog.user.username && <Button variant='destructive' onClick={handleDeletion}>delete</Button>}

      <h2 className='text-lg py-5'>Comments</h2>
      {blog.comments.length
        ?
        <ul className='my-6 ml-6 list-disc [&>li]:mt-2'>
          {blog.comments.map((c) => <li key={c.id}>{c.content}</li>)}
        </ul>
        : <p className='mb-4'>no comments yet.</p>}
      <form onSubmit={handleCommentSubmit}>
        <Input type="text" value={comment} onChange={handleCommentChange} placeholder='write here...' />
        <Button type="submit" className='mt-2'>add comment</Button>
      </form>
    </>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
}

export default Blog