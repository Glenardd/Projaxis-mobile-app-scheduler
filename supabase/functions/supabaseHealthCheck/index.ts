// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

//log
console.log("Supabase active!")

Deno.serve(async (req) => {
  const data = {
    message: `supabase database active!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { 
      "Content-Type": "application/json" ,
      "Authorization": `Bearer ${Deno.env.get("CRON_SECRET")}`
    } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/supabaseHealthCheck' \
    --header 'Authorization: Bearer <CRON_SECRET>' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
