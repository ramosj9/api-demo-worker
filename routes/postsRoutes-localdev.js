// ./routes/postsRoutes.js
import { Router } from 'itty-router'
import { validatePostData } from '../middleware/validateData';
import { promises as fs } from 'fs';

// Create a new router instance
const router = Router()

// Define the routes
// Function to read posts from the R2 bucket
const readPosts = async () => {
  const filePath = '../local-r2/posts.json';
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    console.log('Read posts:', data); // Debugging log
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
};

// Function to write posts to the local file
const writePosts = async (posts) => {
  const filePath = '../local-r2/posts.json';
  try {
    const json = JSON.stringify(posts, null, 2);
    await fs.writeFile(filePath, json, 'utf-8');
    console.log('Written posts:', json); // Debugging log
  } catch (error) {
    console.error('Error writing posts:', error);
  }
};

router.get("/", () => {
  return new Response("Hello, world! This is the root page of your Worker template.")
})

// Define the routes
// Define the GET route for retrieving the list of posts
router.get('/api/posts', async (requests, env) => {
  try {
    // Read the current posts
    const posts = await readPosts(env);

    return new Response(JSON.stringify(posts), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// route for post request
/*router.post('/api/posts:id', async (request, env) => {
  try {
    // Validate the data
    const validationResponse = await validatePostData(request);
    if (validationResponse) {
      return validationResponse; // If validation fails, return the error response
    }

    const { username, postTitle, postContent } = request.body;

    // Read the current posts
    const posts = await readPosts(env);

    // Add the new post
    const newPost = { username, postTitle, postContent };
    posts.push(newPost);

    // Write the updated posts back to the file
    await writePosts(env, posts);

    return new Response(JSON.stringify({ message: 'Post created', data: newPost }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}); */

router.all("*", () => new Response("404, not found!", { status: 404 }))
// Export the router
export default router;