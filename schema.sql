
CREATE TABLE IF NOT EXISTS "Books" ( "id" SERIAL, "name" VARCHAR(100) NOT NULL, PRIMARY KEY ("id") );

INSERT INTO Books (name) VALUES ('${req.body.name}');

DELETE from Books where id = $1
