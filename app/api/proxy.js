// api/proxy.js
// This service is vercel serve cross-domain processing
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function handler(req, res) {
    let target = ''
    // Proxy Destination Address
    // target Replace it with the server you requested across domains eg: http://gmall-h5-api.atguigu.cn
    if (req.url.startsWith('/api')) {
        target = 'http://139.177.202.65:6543'
    }
    // Create a proxy object and forward the request
    createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
            // By rewriting the path, remove the `/api`
            // If enabled, /api/user/login will be forwarded to http://gmall-h5-api.atguigu.cn/user/login
            '^/api/': '/',
        },
    })(req, res)
}