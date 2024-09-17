const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res, next) => {
	try {

		//Write your code here
		const { username, password } = req.body

		if (isValid(username)) {
			const error = new Error("Username already used")
			error.status = 403

			throw error
		}

		users.push({
			username,
			password,
		})

		const message = "Account created successfully"
		const { password: userPassword, ...data } = users.find(item => item.username === username)

		return res.status(201).json({ data, message })



	} catch (error) {
		console.error(error)
		next(error)

	}


});

// Get the book list available in the shop
public_users.get('/', function (req, res, next) {

	// used Promised base
	const findBooks = new Promise((resolve, reject) => {
		setTimeout(() => {

			if(!books){
				const error = new Error("Books are not available")
				error.status = 404

				reject(error)
			}

			const message = "List of books fetched successfully"
			const data = books

			resolve({message, data})
		}, [500])
	})

	findBooks.then(result => {
		return res.status(200).json(result)
	}).catch(err => next(err))


});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res, next) {
	//Write your code here
	const { isbn } = req.params

	const findOneWithISBN = new Promise((resolve, reject)=> {
		setTimeout(() => {
			const book = books[isbn]

			if(!book){
				const error = new Error("Book with this ISBN not found")
				error.status = 404

				reject(error)
			}

			const message = "OK"
			const data = book

			resolve({message, data})


		}, [500])
	})

	findOneWithISBN.then(result => {
		return res.status(200).json(result)
	}).catch(err => next(err))

});

// Get book details based on author
public_users.get('/author/:author', function (req, res, next) {
		const { author } = req.params
		const matchedResult = []

		const findBookByAuthor = new Promise((resolve, reject) => {
			setTimeout(() => {

				// Iterate through array to traverse the object
				for (let isbn in books) {
					const bookAuthor = books[isbn]?.author
					if (bookAuthor && bookAuthor.toLowerCase() === author.toLowerCase()) {
						matchedResult.push(books[isbn])
					}
				}

				if (matchedResult.length === 0) {
					const error = new Error("No book matched with the author")
					error.status = 400
					reject(error)
				}

				const message = "OK"
				const data = matchedResult

				resolve({ message, data })

			}, [500])
		})

		findBookByAuthor.then(result => {
			return res.status(200).json(result)
		}).catch(err => next(err))
});

// Get all books based on title
public_users.get('/title/:title', function (req, res, next) {

	const { title } = req.params
	const matchedResult = []

	const findBookByTitle = new Promise((resolve, reject) => {
		setTimeout(() => {
			// Iterate through array to traverse the object
			for (let isbn in books) {
				const bookTitle = books[isbn]?.title
				if (bookTitle && bookTitle.toLowerCase() === title.toLowerCase()) {
					matchedResult.push(books[isbn])
				}
			}

			if (matchedResult.length === 0) {
				const error = new Error("No book matched with the title")
				error.status = 400
				reject(error)
			}

			const message = "OK"
			const data = matchedResult

			resolve({data, message})
		}, [500])
	})

	findBookByTitle.then(result => {
		return res.status(200).json(result)
	}).catch(err => next(err))

});

//  Get book review
public_users.get('/review/:isbn', function (req, res, next) {
	try {

		const { isbn } = req.params

		const book = books[isbn]

		if (!book) {
			const error = new Error("ISBN not found")
			error.status = 404

			throw error
		}

		const { author, ...other } = book

		const message = "OK"
		const data = { ...other }

		return res.status(200).json({ data, message })

	} catch (error) {
		console.error(error)
		next(error)
	}
});

module.exports.general = public_users;