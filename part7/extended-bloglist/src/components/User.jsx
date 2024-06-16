const User = ({ user }) => {

    if (!user) {
        return <div>loading...</div>
    }

    return (
        <div>
            <h2 className="text-xl pb-5 lowercase">user details: {user.username}</h2>
            <h3 className="text-lg">Added Blogs</h3>

            {user.blogs.length > 0
                ?
                <ul className='ml-6 list-disc [&>li]:mt-2'>
                    {user.blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
                </ul>
                : <p className="mt-4">no blogs yet</p>
            }
        </div >
    )
}

export default User