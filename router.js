const express = require("express");
const joi = require("joi");
const AppError = require("./middleware/AppError");
const { INVALID_SUBSCRIPTION } = require("./middleware/errorCodes");
const errorHandler = require("./middleware/app.js");
const { tryCatch } = require("./middleware/tryCatch");
const database = require("./database");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

let router = express.Router();

router
  .route("/books")
  .get(
    tryCatch(async (req, res) => {
      const newbooks = await prisma.books.findMany()
      res.status(200).send(newbooks)
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

    const newbooks = await prisma.books.create({
      data :{ name : req.body.name}
    });

    res.status(200).send(newbooks);
    })
  );

router
  .route("/books/:id")
  .delete(
    tryCatch(async (req, res) => {
      const id = parseInt(req.params.id);
      if (!id) throw new Error("book not found");

      const newbooks = await prisma.books.delete({
        where:{
          id : id
        },
      })
    
      res.status(200).send(newbooks)
    })
  )
  .put(
    tryCatch(async (req, res) => {
      
      const id = parseInt(req.params.id);
      if (!id) throw new Error("book not found");

      const { error } = validateBook(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const newbooks = await prisma.books.update({
        where:{
          id : id
        },
        data:{
          name : req.body.name
        }
      })
    
      res.status(200).send(`User UPDATE with ID: ${id}`);
    })
  )
  .get(
    tryCatch(async (req, res) => {

      const id = parseInt(req.params.id);
      if (!id) throw new Error("book not found");

      const newbooks = await prisma.books.findMany({
        where:{
          id : id
        },
      })
       
      res.status(200).send(newbooks)
        })
  );

function validateBook(book) {
  const schema = joi.object({ name: joi.string().min(3).required() });
  return schema.validate(book);
}


module.exports = router;
