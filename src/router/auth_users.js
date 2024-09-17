const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
	username: "irel04",
	password: "1234",
	bookReview: null
}];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid

	// This ensure if the username exist it will return true
	return !!users.find(item => item.username === username)
}

const authenticatedUser = (username, password) => { 
	//returns boolean
	//write code to check if username and password match the one we have in records.
	
	const user = users.find(item => item.username === username)

	// This checks if the user is existing then checked if the user's password matched
	if(!user || !(user.password === password)){
		const error = new Error("Username or password is incorrect");
		error.status = 401
		throw error

	}

	return user.password === password
}

//only registered users can login
regd_users.post("/login", (req, res, next) => {
	try {
		const { username, password } = req.body

		// check if username and password are defined
		if (!(username && password)) {
			const error = new Error("Required username and password")
			error.status = 400

			throw error
		}

		// Authenticate the user using the built function for its business logic
		const isAuthenticated = authenticatedUser(username, password) 

		if(isAuthenticated){
			let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 })

			// Store the access token
			req.session.authorization = {
				accessToken, 
				username
			}
		}
		
		res.status(200).json({message: "Login Successfully"})

	} catch (error) {
		const { status, message } = error
		next(error)
	}

});

regd_users.get("/auth/user", (req, res) => {
	const { username } = req.session.authorization

	const user = users.find(item => item.username === username)

	res.status(200).json(user)
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	//Write your code here
	return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;