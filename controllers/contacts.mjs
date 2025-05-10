import { ObjectId } from "mongodb";

import db from "../db/conn.mjs";

const contactsCollection = () => db.collection("contacts");

export async function index(_req, res) {
  let results = await contactsCollection().find({}).toArray();

  res.send(results).status(200);
}

export async function show(req, res) {
  let query  = {_id: new ObjectId(req.params.id)};
  let result = await contactsCollection().findOne(query);

  if (!result) {
    res.send({ error: "Not found" }).status(404);
  } else {
    res.send(result).status(200);
  }
}
