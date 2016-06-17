CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(255),
  "email" varchar(255),
  "password" varchar(255)
);
CREATE UNIQUE INDEX user_email_key ON "user" USING btree (email);
CREATE TABLE "problem" (
  "id" SERIAL PRIMARY KEY,
  "parent_id" int,
  "title" varchar(255),
  "description" varchar(255),
  "user_id" int,
  FOREIGN KEY("user_id") REFERENCES "user" ("id")
);
CREATE TABLE "document" (
  "id" SERIAL PRIMARY KEY,
  "final_result" text,
  "role" varchar(255),
  "problem_id" int,
  FOREIGN KEY("problem_id") REFERENCES "problem" ("id")
);
CREATE TABLE "document_event" (
  "id" SERIAL PRIMARY KEY,
  "document_id" int,
  "event" varchar(255),
  "params" json,
  "timestamp" int,
  FOREIGN KEY("document_id") REFERENCES "document" ("id")
);
CREATE TABLE "problem_list" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "name" varchar(255),
  FOREIGN KEY("user_id") REFERENCES "user" ("id")
);
CREATE TABLE "problem_list_member" (
  "id" SERIAL PRIMARY KEY,
  "problem_list_id" int,
  "problem_id" int,
  FOREIGN KEY("problem_list_id") REFERENCES "problem_list" ("id"),
  FOREIGN KEY("problem_id") REFERENCES "problem" ("id")
);