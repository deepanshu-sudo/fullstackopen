import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const Users = ({ users }) => {
    return (
        <>
            <h2 className='text-2xl'>Users</h2>
            {
                users.length !== 0
                    ? <div className='my-6 w-full overflow-y-auto'>
                        <table className='w-full'>
                        <thead>
                            <tr className='m-0 border-t p-0'>
                                <th className='border px-4 py-2 text-left font-bold'>User</th>
                                <th className='border px-4 py-2 text-left font-bold'>Blogs Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map(user =>
                                    <tr key={user.id} className='m-0 border-t p-0 '>
                                        <td className='border px-4 py-2 text-left'>
                                            <ExternalLink className='w-4 h-4 inline-block mr-1'/>
                                            <Link to={`/users/${user.id}`} className='hover:underline'>{user.username}</Link>
                                        </td>
                                        <td className='border px-4 py-2 text-left'>{user.blogs.length}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    </div>
                    : <p>no users yet.</p>
            }
        </>
    )
}

export default Users
