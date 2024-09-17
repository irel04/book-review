

const responseFormatter = async (req, res, next) => {
	const originalJson = res.json

	// This function will override the res.json throughout the application
	res.json = (data) => {
		const formattedJson = {
			statusCode: res.statusCode || 200,
			success: res.statusCode < 400,
			message: data.message,
			data: data.data || null
		}

		originalJson.call(res, formattedJson)
	}

	next()
}


module.exports = responseFormatter