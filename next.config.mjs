/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  // Server-side redirects for better SEO and performance
  async redirects() {
    const redirects = []

    // In production, redirect dev routes to homepage
    if (process.env.NODE_ENV === 'production') {
      const devRoutes = [
        '/card-demo',
        '/corner-demo',
        '/tooltip-demo',
        '/debug-scrolling',
        '/test-container-query',
        '/test-scrolling',
        '/tooltip-portal-test'
      ]

      devRoutes.forEach(route => {
        redirects.push({
          source: route,
          destination: '/',
          permanent: false,
        })
      })
    }

    return redirects
  },

  // Rewrites for clean URLs if needed
  async rewrites() {
    return [
      // Example: rewrite API paths or clean URLs
      // {
      //   source: '/api/monitors/:path*',
      //   destination: '/api/monitor/:path*',
      // },
    ]
  },
}

export default nextConfig
