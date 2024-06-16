import { useEffect } from 'react'
import { Route, Routes, Link, useMatch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import Home from './components/Home'
import Users from './components/Users'
import Login from './components/Login'
import Logout from './components/Logout'
import User from './components/User'
import Blog from './components/Blog'
import Notification from './components/Notification'

import { setUser } from './reducers/userReducer'
import blogService from './services/blogs'
import { useUsers, useBlogs } from './hooks'

import { ArrowRightIcon } from 'lucide-react'

const Menu = ({ user }) => {
  return (
    <>
      <nav className="flex flex-col md:flex-row justify-between border-b border-gray-200 p-5">
        <p>Bloglist App</p>
        <p className="">Welcome {user.username}!</p>
        <Logout />
      </nav>
    </>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const blogs = useBlogs()
  const users = useUsers(blogs)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const loggedInUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(loggedInUser))
      blogService.setToken(loggedInUser.token)
    }
  }, [dispatch])


  const userMatch = useMatch('/users/:id')
  const userToView = userMatch ? users.find(user => user.id === userMatch.params.id) : null

  const blogMatch = useMatch('/blogs/:id')
  const blogToView = blogMatch ? blogs.find(blog => blog.id === blogMatch.params.id) : null

  if (!user) return <Login />

  return (
    <>
      <Menu user={user} />
      <div className="grid h-[calc(100vh - 72.8px)] md:grid-cols-4 grid-cols-1 items-stretch">
        <div className="flex flex-col h-full min-h-0 justify-between border-b md:border-r md:border-b-0 border-gray-200 p-5">
          <div className="flex-grow">
            <ul>
              <li className="mb-2">
                <ArrowRightIcon className="w-4 h-4 inline-block mr-2" />
                <Link to="/" className="hover:underline">blogs</Link>
              </li>
              <li>
                <ArrowRightIcon className="w-4 h-4 inline-block mr-2" />
                <Link to="/users" className="hover:underline">users</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col h-full min-h-0 md:col-span-3 p-5">
          <Notification />
          <Routes>
            <Route path="/" element={<Home blogs={blogs} />} />
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/users/:id" element={<User user={userToView} />} />
            <Route path="/blogs/:id" element={<Blog blog={blogToView} currentUser={user} />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App