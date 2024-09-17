const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./src/router/auth_users.js').authenticated;
const genl_routes = require('./src/router/general.js').general;
const responseFormatter = require("./src/middleware/responseFormatter.js")
const errorMiddleWare = require("./src/middleware/errorHandler.js");


const app = express();

app.use(express.json());
app.use(responseFormatter)


app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
	//Write the authenication mechanism here
	// Get token
	const token = req.session.authorization?.accessToken 

	if (token) {
		// Verify JWT Token
		jwt.verify(token, "access", (err, user) => {
			if (!err) {
				req.user = user
				next()
			} else {
				const error = new Error("Token Expired or Invalid")
				error.status = 401
				next(error)
			}
		})
	} else {
		const error = new Error("No token")
		error.status = 401
		next(error)
	}

});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.use(errorMiddleWare)

app.listen(PORT, () => console.log("Server is running"));