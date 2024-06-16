import { useState } from "react"
import { useDispatch } from "react-redux"
import { setUser } from '../reducers/userReducer'
import { useNotification } from '../hooks'
import loginService from '../services/login'
import blogService from '../services/blogs'
import Notification from "./Notification"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

const Login = () => {
    const dispatch = useDispatch()
    const notify = useNotification()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const tryUser = await loginService.login({
                username, password,
            })
            window.localStorage.setItem(
                'loggedBloglistUser', JSON.stringify(tryUser)
            )
            blogService.setToken(tryUser.token)
            dispatch(setUser(tryUser))
            setUsername('')
            setPassword('')
            notify(`${tryUser.username} logged in successfully`, 'info')
        } catch (error) {
            notify(`wrong username or password`, 'error')
        }
    }

    const loginForm = () => (
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <div className="flex flex-col">
                <label htmlFor="username" className="mb-2"></label>
                <Input
                    id="username"
                    data-testid="username"
                    type="text"
                    value={username}
                    name="username"
                    onChange={({ target }) => setUsername(target.value)}
                    className="w-64 p-2 border rounded"
                    placeholder='username'
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="password" className="mb-2"></label>
                <Input
                    id="password"
                    data-testid="password"
                    type="password"
                    value={password}
                    name="password"
                    onChange={({ target }) => setPassword(target.value)}
                    className="w-64 p-2 border rounded"
                    placeholder='password'
                />
            </div>
            <Button type="submit" className="mt-4 w-64 p- text-white rounded">login</Button>
        </form>
    );


    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
                <Notification />
                <h2 className="text-xl capitalize text-center my-5">log in</h2>
                {loginForm()}
            </div>
        </div>

    )
}

export default Login