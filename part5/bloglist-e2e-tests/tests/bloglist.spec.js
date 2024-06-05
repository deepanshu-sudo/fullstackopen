const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog App', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:5173/api/testing/reset')
        await request.post('http://localhost:5173/api/users', {
            data: {
                name: 'testuser',
                username: 'testuser',
                password: 'Jind@1234'
            }
        })
        await page.goto('http://localhost:5173')
    })

    test('login form is shown', async ({ page }) => {
        const locator = await page.getByText('log in to application')
        await expect(locator).toBeVisible()

        const usernameField = await page.getByTestId('username')
        const passwordField = await page.getByTestId('password')
        await expect(usernameField).toBeVisible()
        await expect(passwordField).toBeVisible()

        const loginButton = await page.getByRole('button', { name: 'login' })
        await expect(loginButton).toBeVisible()

        await expect(page.getByText('testuser logged in')).not.toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByTestId('username').fill('testuser')
            await page.getByTestId('password').fill('Jind@1234')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('testuser logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByTestId('username').fill('wronguser')
            await page.getByTestId('password').fill('wrongpassword')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('testuser logged in')).not.toBeVisible()
            await expect(page.getByText('wrong username or password')).toBeVisible()
        })
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByTestId('username').fill('testuser')
            await page.getByTestId('password').fill('Jind@1234')

            await page.getByRole('button', { name: 'login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()

            await page.getByTestId('title').fill('new blog title')
            await page.getByTestId('author').fill('new blog author')
            await page.getByTestId('url').fill('newblogurl.com')

            await page.getByRole('button', { name: 'create' }).click()

            const blogElement = await page.getByText('new blog title by new blog author', { exact: true }).locator('..')
            await expect(blogElement.getByText('new blog title by new blog author')).toBeVisible()
            await expect(page.getByText('no blogs yet.')).not.toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()

            await page.getByTestId('title').fill('new blog title')
            await page.getByTestId('author').fill('new blog author')
            await page.getByTestId('url').fill('newblogurl.com')

            await page.getByRole('button', { name: 'create' }).click()
            const blogElement = await page.getByText('new blog title by new blog author', { exact: true }).locator('..')
            await blogElement.getByRole('button', { name: 'view' }).click()
            await blogElement.getByRole('button', { name: '👍' }).click()

            await expect(page.getByText('liked new blog title by new blog author')).toBeVisible()
            await expect(blogElement.getByText('Likes: 1')).toBeVisible()
            await expect(blogElement.getByText('Likes: 0')).not.toBeVisible()
        })

        test('a blog can be deleted', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()

            await page.getByTestId('title').fill('new blog title')
            await page.getByTestId('author').fill('new blog author')
            await page.getByTestId('url').fill('newblogurl.com')

            await page.getByRole('button', { name: 'create' }).click()
            const blogElement = await page.getByText('new blog title by new blog author', { exact: true }).locator('..')
            await blogElement.getByRole('button', { name: 'view' }).click()
            page.on('dialog', dialog => dialog.accept())
            await blogElement.getByRole('button', { name: 'delete' }).click()

            await expect(page.getByText('deleted new blog title by new blog author')).toBeVisible()
            await expect(page.getByText('no blogs yet.')).toBeVisible()
        })

        test('only the user who added the blog can see the delete button', async ({ page, request }) => {
            await page.getByRole('button', { name: 'new blog' }).click()

            await page.getByTestId('title').fill('new blog title')
            await page.getByTestId('author').fill('new blog author')
            await page.getByTestId('url').fill('newblogurl.com')

            await page.getByRole('button', { name: 'create' }).click()
            const blogElement = await page.getByText('new blog title by new blog author', { exact: true }).locator('..')
            await blogElement.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'logout' }).click()

            await request.post('http://localhost:5173/api/users', {
                data: {
                    name: 'reeucq',
                    username: 'reeucq',
                    password: 'Jind@1234'
                }
            })

            await page.getByTestId('username').fill('reeucq')
            await page.getByTestId('password').fill('Jind@1234')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(blogElement.getByRole('button', { name: 'delete' })).not.toBeVisible()

        })

        test.only('blogs are arranged in order of their likes in descending order', async ({ page }) => {
            // Create three blogs with different like counts
            const blogs = [
                { title: 'First Blog', author: 'Author 1', url: 'url1.com', likes: 3 },
                { title: 'Second Blog', author: 'Author 2', url: 'url2.com', likes: 1 },
                { title: 'Third Blog', author: 'Author 3', url: 'url3.com', likes: 2 },
            ]

            for (const blog of blogs) {
                await page.getByRole('button', { name: 'new blog' }).click()
                await page.getByTestId('title').fill(blog.title)
                await page.getByTestId('author').fill(blog.author)
                await page.getByTestId('url').fill(blog.url)
                await page.getByRole('button', { name: 'create' }).click()

                // Set the number of likes
                const blogElement = await page.getByText(`${blog.title} by ${blog.author}`, { exact: true }).locator('..')
                await blogElement.getByRole('button', { name: 'view' }).click()
                for (let i = 0; i < blog.likes; i++) {
                    await blogElement.getByRole('button', { name: '👍' }).click()
                }
            }

            // Reload the page to ensure the sorting is applied
            await page.reload()

            // Get all blog elements and their likes
            const blogElements = await page.locator('.blog').all()
            const likes = await Promise.all(blogElements.map(async (blog) => {
                await blog.getByRole('button', { name: 'view' }).click()
                const likesText = await blog.getByText(/Likes: \d+/).textContent()
                return parseInt(likesText.match(/\d+/)[0])
            }))

            // Ensure likes are in descending order
            const isSortedDescending = likes.every((value, i, array) => !i || array[i - 1] >= value)
            expect(isSortedDescending).toBe(true)
        })
    })
})