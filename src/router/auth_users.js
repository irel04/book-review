const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
	username: "irel04",
	password: "1234",
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
			let accessToken = jwt.sign({ username }, 'access', { expiresIn: 60 * 60 })

			// Store the access token
			req.session.authorization = {
				accessToken
			}
		}
		
		return res.status(200).json({message: "Login Successfully"})

	} catch (error) {
		const { status, message } = error
		next(error)
	}

});

regd_users.get("/auth/user", (req, res) => {
	const { username } = req.session.authorization

	const user = users.find(item => item.username === username)

	const message = "OK"

	res.status(200).json({message, data: user})
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res, next) => {
	try {
		
		const { isbn } = req.params
		const { review } = req.query 
		const { username } = req.user
		const book = books[isbn]

		const error = new Error()
		
		if(!book){
			error.message = "ISBN not found"
			error.status = 404

			throw error
		}

		if(!review){
			error.message = "Missing! Review"
			error.status = 400
			throw error
		}

		book.reviews[username] = {
			description: review
		}

		const message = "Review Added"
		const data = book

		return res.status(200).json({ message, data })

	} catch (error) {
		console.error(error)
		next(error)
	}
});

regd_users.delete("/auth/review/:isbn", (req, res, next) => {

	try {
		const { isbn } = req.params
		const { username } = req.user

		const book = books[isbn]

		const error = new Error()
		if(!book){	
			error.message = "Book with this ISBN not found"
			error.status = 404

			throw error
		}

		if(!book.reviews.hasOwnProperty(username)){
			error.message = "No book with this username review"
			error.status = 404

			throw error
		}

		delete book.reviews[username]

		const data = books
		const message = "Deleted successfully"

		return res.status(204).json({message, data})


	} catch (error) {
		console.error(error)
		next(error)
	}

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;