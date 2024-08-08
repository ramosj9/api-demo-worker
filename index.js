/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import router from './routes/postsRoutes'

// Error handling middleware
const errorHandler = (error) => {
	console.error(error.stack);
	return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
	  status: 500,
	  headers: { 'Content-Type': 'application/json' },
	});
};
// Routes for all traffic - the Event listener to handle incoming requests to routes

addEventListener('fetch', (event) => {
  	event.respondWith(
		router.handle(event)
		.catch(errorHandler)
	)
});

/*async function handleEvent(event) {
	try {
	  return await router(event)
	} catch (e) {
	  return await router(event, {
		mapRequestToAsset: (request) => {
		  return mapRequestToAsset(new Request(`https://${request.host}/`, request))
		}
	  })
	  	//return new Response('notfound', { status: 404 })
	}
  } */