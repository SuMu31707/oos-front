let proxyObj = {}

proxyObj['/'] = {
	// websocket
	ws: false,
	// 目标地址
	target: 'http://localhost:8081',
	// 发送请求头里的host会被设置为target
	changeOrigin: true,
	// 不重写请求地址
	pathReWrite: {
		'^/': '/'
	}
}

module.exports = {
	devServer: {
		host: 'localhost',
		port: 8080,
		proxy: proxyObj
	}
}
