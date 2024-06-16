import { useRef } from 'react'
import { useSelector } from 'react-redux'

import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const Home = ({ blogs }) => {
  const user = useSelector(state => state.user)
  const blogFormRef = useRef()

  return (
    <>
      <h1 className='text-2xl'>Blogs</h1>
      <ul className='my-6 ml-6 list-disc [&>li]:mt-2'>
        {blogs.length !== 0
          ? blogs.map(blog =>
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title}
                <ExternalLink className='w-4 h-4 ml-1 inline-block' />
              </Link>
            </li>
          )
          : <p>no blogs yet.</p>}
      </ul>
      <Togglable buttonLabel='new blog' cancelLabel='cancel' ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
    </>
  )
}

export default Home