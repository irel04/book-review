

const responseFormatter = async (req, res, next) => {
	const originalJson = res.json

	res.json = (data) => {
		const formattedJson = {
			success: res.statusCode < 400,
			statusCode: res.statusCode || 200,
			data: data
		}

		originalJson.call(res, formattedJson)
	}

	next()
}


module.exports = responseFormatter