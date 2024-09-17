
const errorMiddleWare = async (err, req, res, next) => {
	
	// Handle the error and send a response
	const statusCode = err.status || 500;
	const message = err.message || "Internal Server Error";

	return res.status(statusCode).json({ statusCode, message });
}

module.exports = errorMiddleWare