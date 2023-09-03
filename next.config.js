/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        // API_URL: "http://localhost:8000/",
        API_URL: "https://collaboratio-api.vercel.app/api/",
       NEXT_PUBLIC_PUSHER_KEY: "ba1ec0d23f304fedd67d",
       NEXT_PUBLIC_PUSHER_CLUSTER: "sa1"
    }
}

module.exports = nextConfig
