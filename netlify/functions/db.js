export default async (req) => {
const url = new URL(req.url)
const targetPath = url.pathname.replace(/^/.netlify/functions/db/, '')
const targetUrl = https://supabase.co${targetPath}${url.search}

const headers = new Headers(req.headers)
headers.delete('host')

const res = await fetch(targetUrl, {
method: req.method,
headers,
body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.arrayBuffer() : undefined,
})

return new Response(res.body, {
status: res.status,
headers: {
'Content-Type': res.headers.get('Content-Type') || 'application/json',
'Access-Control-Allow-Origin': '*',
},
})
}

export const config = {
path: '/.netlify/functions/db/*',
}
