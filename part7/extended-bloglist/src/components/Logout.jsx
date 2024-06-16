import { useNotification } from '../hooks'
import { setUser } from "../reducers/userReducer"
import blogService from '../services/blogs'
import { useSelector, useDispatch } from 'react-redux'
import { LogOutIcon } from 'lucide-react'

const Logout = () => {
    const dispatch = useDispatch()
    const notify = useNotification()
    const user = useSelector(state => state.user)

    const handleLogout = async (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBloglistUser')
        notify(`${user.username} logged out successfully`, 'info')
        dispatch(setUser(null))
        blogService.setToken(null)
    }

    return (
        <a onClick={handleLogout} className='cursor-pointer'> <LogOutIcon className='w-3 h-3 inline-block'/> Logout</a>
    )
}

export default Logout