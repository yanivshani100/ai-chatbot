import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// })

// export async function POST(req: Request) {
//   const json = await req.json()
//   const { messages, previewToken } = json
//   const userId = (await auth())?.user.id

//   if (!userId) {
//     return new Response('Unauthorized', {
//       status: 401
//     })
//   }

//   if (previewToken) {
//     openai.apiKey = previewToken
//   }

//   const res = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     messages,
//     temperature: 0.7,
//     stream: true
//   })

//   const stream = OpenAIStream(res, {
//     async onCompletion(completion) {
//       const title = json.messages[0].content.substring(0, 100)
//       const id = json.id ?? nanoid()
//       const createdAt = Date.now()
//       const path = `/chat/${id}`
//       const payload = {
//         id,
//         title,
//         userId,
//         createdAt,
//         path,
//         messages: [
//           ...messages,
//           {
//             content: completion,
//             role: 'assistant'
//           }
//         ]
//       }
//       // await kv.hmset(`chat:${id}`, payload)
//       // await kv.zadd(`user:chat:${userId}`, {
//       //   score: createdAt,
//       //   member: `chat:${id}`
//       // })
//     }
//   })

//   return new StreamingTextResponse(stream)
// }



// Import fetch if your environment doesn't support it globally
// If you're using a recent version of Next.js, fetch is available globally, and this import is unnecessary
// import fetch from 'node-fetch';

async function executeWorkflow(apiName:string, userInput:string) {
  const data = { api_name: apiName, user_input: userInput };
  const endpoint = 'http://localhost:8000/workflow/'; // Adjust the endpoint as necessary

  console.error(`executeWorkflow() >>: ${JSON.stringify(data)}`);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any other headers your API requires
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok, status: ${response.status}`);
    }

    const responseData = await response.json();
    console.error(`executeWorkflow << response=${JSON.stringify(responseData)}`);
    return responseData;
  } catch (error) {
    console.error(`Error in executeWorkflow: ${error.message}`);
    return null; // Or handle the error as needed
  }
}

export async function POST(req: Request) {
  const json = await req.json();
  const userId = (await auth())?.user.id;
  console.error("POST:", json);

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Assuming executeWorkflow has been adjusted to call your FastAPI backend
  // and that it returns a JSON object as the response
  try {
    const res = await executeWorkflow("1forge_finance_apis", "Can you provide me with the list of symbols for forex trading?");
    
    // Directly return the JSON response
    // Ensure the response has the appropriate headers if needed
    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json' },
      status: 200 // or another appropriate status code based on res
    });
  } catch (error) {
    console.error("Error in POST:", error);
    // Handle any errors that occur during the fetch
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500 // Internal Server Error
    });
  }
}
