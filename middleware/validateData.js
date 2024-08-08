// Middleware to validate post data
export const validatePostData = async (request) => {
    const contentType = request.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      const body = await request.json();
      const { username, postTitle, postContent } = body;
  
      if (!username || !postTitle || !postContent) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Attach the parsed body to the request for further handling
      request.body = body;
    } else {
      return new Response(JSON.stringify({ error: "Invalid Content-Type" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };