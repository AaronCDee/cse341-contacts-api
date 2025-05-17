import { ObjectId } from "mongodb";

import db from "../db/conn.mjs";

const contactsCollection = () => db.collection("contacts");

export async function index(_req, res) {
  /* #swagger.description = 'Endpoint to list all contacts.' */
  let results = await contactsCollection().find({}).toArray();

  res.status(200).send(results);
}

export async function show(req, res) {
  /* #swagger.description = 'Endpoint to fetch a contact by ID.' */
  const query  = {_id: new ObjectId(req.params.id)};
  const result = await contactsCollection().findOne(query);

  if (!result) {
    res.status(404).send({ error: "Not found" });
  } else {
    res.status(200).send(result);
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns {string} the new contact id
 */
export async function create(req, res) {
  /* #swagger.description = 'Endpoint to create a contact.' */
  const { firstName, lastName, birthday, favoriteColor, email } = req.body;

  const createAttrs = { firstName, lastName, birthday, favoriteColor, email };

  const { isValid, errors } = validateNewContact(createAttrs);

  if (!isValid) {
    res.status(422).send({ error: errors });

    return;
  }

  try {
    const result = await contactsCollection().insertOne(createAttrs);

    res.status(200).send({ _id: result.insertedId });
  } catch(e) {
    res.status(422).send({ error: `An error occurred while creating the contact: ${e}` })
  }
}

export async function update(req, res) {
  /* #swagger.description = 'Endpoint to update a contact.' */
  const filter = { _id: new ObjectId(req.params.id) };

  const { firstName, lastName, birthday, favoriteColor, email } = req.body;

  const allowedAttrs = { firstName, lastName, birthday, favoriteColor, email };
  const updateAttrs  = Object.keys(allowedAttrs).reduce((acc, key) => {
    if (!isEmpty(allowedAttrs[key])) {
      acc[key] = allowedAttrs[key];
    }

    return acc;
  }, {})

  try {
    const result = await contactsCollection().updateOne(filter, { $set: updateAttrs });

    res.status(200).send({ success: result.acknowledged });
  } catch(e) {
    res.status(400).send({ error: `An error occurred while updating the contact: ${e}` });
  }
}

export async function destroy(req, res) {
  /* #swagger.description = 'Endpoint to delete a contact.' */
  const filter = { _id: new ObjectId(req.params.id) };

  try {
    const result = await contactsCollection().deleteOne(filter);

    res.status(200).send({ success: result.acknowledged });
  } catch(e) {
    res.status(400).send({ error: `An error occurred while deleting the contact: ${e}` });
  }
}

const validateNewContact = (contact) => {
  let isValid  = true
  const errors = []

  const errorSentence = (attr) => `${attr} is required!`

  if (isEmpty(contact.firstName)) {
    isValid = false;

    errors.push(errorSentence('firstName'));
  }

  if (isEmpty(contact.lastName)) {
    isValid = false;

    errors.push(errorSentence('lastName'));
  }

  if (isEmpty(contact.email)) {
    isValid = false;

    errors.push(errorSentence('email'));
  }

  if (isEmpty(contact.birthday)) {
    isValid = false;

    errors.push(errorSentence('birthday'));
  }

  if (isEmpty(contact.favoriteColor)) {
    isValid = false;

    errors.push(errorSentence('favoriteColor'));
  }

  return { isValid, errors }
}

const isEmpty = (val) => val === "" || val === null || val === undefined

// {
// "_id": "681ef1bd40ed01780a118e3e",
// "firstName": "Aaron",
// "lastName": "Crocfellow",
// "email": "aaron@acme.com",
// "favoriteColor": "cyan",
// "birthday": "1996-12-20T00:00:00.000Z"
// },
