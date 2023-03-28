
const express = require("express");
const joi = require("joi");
const AppError = require("./middleware/AppError");
const { INVALID_SUBSCRIPTION } = require("./middleware/errorCodes");
const errorHandler = require("./middleware/app.js");
const { tryCatch } = require("./middleware/tryCatch");
let router = express.Router();

router.use(function(req, res, next) {
  console.log(req.url, "@", Date.now());
  next();
});

const books = [
    { id: 1, name: "book1" },
    { id: 2, name: "book2" },
    { id: 3, name: "book3" },
  ];
  
  router.route("/books")
  .get(tryCatch(async (req, res) => {
    res.send(books);
  }))
  .post(tryCatch(async (req, res) => {
    const schema = {
      name: joi.string().min(3).required(),
    };
  
    const result = joi.valid(req.body, schema);
    console.log(result.$_root.isError);
  
    const { error } = validateBook(req.body);
    if (error) return res.status(404).send(error.details[0].message);
  
    const book = {
      id: books.length + 1,
      name: req.body.name,
    };
    books.push(book);
    res.send(book);
  }))
  
  
  router.route("/books/:id")
  .delete(tryCatch(async (req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) throw new Error("book not found");
  
    const index = books.indexOf(book);
    books.splice(index, 1);
    res.send(book);
  }))
  .put(tryCatch(async (req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) throw new Error("book not found");
  
    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    book.name = req.body.name;
    res.send(book);
  }))
  .get(tryCatch(async (req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) res.status(404).send("this book is not here");
    res.send(book);
  }))
  
  function validateBook(book) {
    const schema = joi.object({ name: joi.string().min(3).required() });
    return schema.validate(book);
  }

module.exports = router;