const joi = require("joi");
const express = require("express");
const AppError = require("./middleware/AppError");
const { INVALID_SUBSCRIPTION } = require("./middleware/errorCodes");
const errorHandler = require("./middleware/app.js");
const { tryCatch } = require("./middleware/tryCatch");
const app = express();

app.use(express.json());

const books = [
  { id: 1, name: "book1" },
  { id: 2, name: "book2" },
  { id: 3, name: "book3" },
];

app.get("/api/books",tryCatch(async (req, res) => {
    res.send(books);
  })
);

app.get("/api/books/:id",tryCatch(async (req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) res.status(404).send("this book is not here");
    res.send(book);
  })
);

app.post("/api/books",tryCatch(async (req, res) => {
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
  })
);

app.put("/api/cars/:id",tryCatch(async (req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) throw new Error("book not found");

    const { error } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    book.name = req.body.name;
    res.send(book);
  })
);

app.delete("/api/books/:id",tryCatch(async (req, res) => {
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) throw new Error("book not found");

    const index = books.indexOf(book);
    books.splice(index, 1);
    res.send(book);
  })
);

function validateBook(book) {
  const schema = joi.object({ name: joi.string().min(3).required() });
  return schema.validate(book);
}

app.use(errorHandler);

const port = process.env.port || 3000;

app.listen(port, () => console.log(`${port}`));
