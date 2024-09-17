const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
	//Write your code here
	const { username, password, bookReview = null } = req.body

	if (isValid(username)) {
		return res.status(403).json({ message: "Username already used" })
	}

	users.push({
		username,
		password,
		bookReview
	})

	return res.status(200).json({
		message: "Account created successfully"
	})
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
	//Write your code here

	const message = "List of books fetched successfully"
	const data = books

	return res.status(200).json({ message, data })


});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res, next) {
	//Write your code here
	const { isbn } = req.params

	try {

		const findOne = books[isbn]

		if (!findOne) {
			const error = new Error("Book not found")
			error.status = 404
			throw error
		}

		const message = `OK`
		const data = findOne

		return res.status(200).json({ message, data })

	} catch (error) {
		console.error(error)
		next(error)

	}


});

// Get book details based on author
public_users.get('/author/:author', function (req, res, next) {
	try {

		const { author } = req.params
		const matchedResult = []

		// Iterate through array to traverse the object
		for (let isbn in books) {
			const bookAuthor = books[isbn]?.author
			if (bookAuthor && bookAuthor.toLowerCase() === author.toLowerCase()) {
				matchedResult.push(books[isbn])
			} 
		}

		if(matchedResult.length === 0) {
			const error = new Error("No book matched with the author")
			error.status = 400
			throw error
		}

		const message = "OK"
		const data = matchedResult

		return res.status(200).json({ message, data })

	} catch (error) {
		console.error(error)
		next(error)
	}

});

// Get all books based on title
public_users.get('/title/:title', function (req, res, next) {
	try {

		const { title } = req.params
		const matchedResult = []

		// Iterate through array to traverse the object
		for (let isbn in books) {
			const bookTitle = books[isbn]?.title
			if (bookTitle && bookTitle.toLowerCase() === title.toLowerCase()) {
				matchedResult.push(books[isbn])
			} 
		}

		if(matchedResult.length === 0) {
			const error = new Error("No book matched with the title")
			error.status = 400
			throw error
		}

		const message = "OK"
		const data = matchedResult

		return res.status(200).json({ message, data })

	} catch (error) {
		console.error(error)
		next(error)
	}
});

//  Get book review
public_users.get('/review/:isbn', function (req, res, next) {
	try {
		
		const { isbn } = req.params

		const book = books[isbn]

		if(!book){
			const error = new Error("ISBN not found")
			error.status = 404

			throw error
		}
		
		const { author, ...other } = book

		const message = "OK"
		const data = {...other}

		return res.status(200).json({ data, message })

	} catch (error) {
		console.error(error)
		next(error)
	}
});

module.exports.general = public_users;