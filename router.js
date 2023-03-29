const express = require("express");
const joi = require("joi");
const AppError = require("./middleware/AppError");
const { INVALID_SUBSCRIPTION } = require("./middleware/errorCodes");
const errorHandler = require("./middleware/app.js");
const { tryCatch } = require("./middleware/tryCatch");
const database = require("./database");
let router = express.Router();

router
  .route("/books")
  .get(
    tryCatch(async (req, res) => {
      database.query("select * from Books")
      .then(results =>  res.send(results.rows));
    })
  )
  .post(
    tryCatch(async (req, res) => {
      const schema = {
        name: joi.string().min(3).required(),
      };

      const result = joi.valid(req.body, schema);
      console.log(result.$_root.isError);

      const { error } = validateBook(req.body);
      if (error) return res.status(404).send(error.details[0].message);

      const book = `
      INSERT INTO Books (name)
      VALUES('${req.body.name}')
      RETURNING *;`;
  
    await database.query(book)
    .then(results => console.table(results.rows));

      res.send(book);
    })
  );

router
  .route("/books/:id")
  .delete(
    tryCatch(async (req, res) => {
      const id = parseInt(req.params.id);
      if (!id) throw new Error("book not found");
     
      database.query("DELETE from Books where id = $1", [id])
      res.status(200).send(`User deleted with ID: ${id}`);
          
    })
  )
  .put(
    tryCatch(async (req, res) => {
      const id = parseInt(req.params.id);
      if (!id) throw new Error("book not found");

      const { error } = validateBook(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      database.query("UPDATE Books SET name = $1 WHERE id = $2", [req.body.name,id])
      res.status(200).send(`User UPDATE with ID: ${id}`);
    })
  )
  .get(
    tryCatch(async (req, res) => {
      const id = parseInt(req.params.id);
      console.log(id)
      if (!id) throw new Error("book not found");
      database.query("select * from Books WHERE id = $1", [id])
      .then(results =>  res.send(results.rows));
    })
  );

function validateBook(book) {
  const schema = joi.object({ name: joi.string().min(3).required() });
  return schema.validate(book);
}

module.exports = router;
