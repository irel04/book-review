

const responseFormatter = async (req, res, next) => {
	const originalJson = res.json

	
	console.log(res.statusCode);
	res.json = (data) => {
		console.log(res.statusCode);
		const formattedJson = {
			success: res.statusCode < 400,
			statusCode: res.statusCode || 200,
			message: data.message,
			data: data.data || null
		}

		originalJson.call(res, formattedJson)
	}

	next()
}


module.exports = responseFormatter