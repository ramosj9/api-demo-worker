// ./routes/postsRoutes.js
import { Router } from 'itty-router'
import { validatePostData } from '../middleware/validateData';

// Create a new router instance
const router = Router()

// Define the routes
// Function to read posts from the R2 bucket
/*const readPosts = async (env) => {
  try {
    const obj = await env.POSTS_BUCKET.get('posts.json');
    if (obj) {
      const text = await obj.text();
      console.log('Read posts:', text); // Debugging log
      return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error('Error reading posts:', error);
    throw new Error('Failed to read posts');
  }
};

// Function to write posts to the R2 bucket
const writePosts = async (env, posts) => {
  try {
    const json = JSON.stringify(posts);
    await env.POSTS_BUCKET.put('posts.json', json);
    console.log('Written posts:', json); // Debugging log
  } catch (error) {
    console.error('Error writing posts:', error);
    throw new Error('Failed to write posts');
  }
};*/

// Define the routes
// Define the GET route for retrieving the list of posts

router.get("/", () => {
  return new Response("Hello, world! This is the root page of your Worker template.")
});

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
router.post('/api/posts:id', async (request, env) => {
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
});

// all other routes can be handler with the following below.
router.all("*", () => new Response("404, not found!", { status: 404 }))

// Export the router
export default router;