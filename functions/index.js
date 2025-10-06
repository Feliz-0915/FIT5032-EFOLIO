/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.countBooks = onRequest(async (req, res) => {
  try {
    const snapshot = await db.collection("books").get();
    res.status(200).send({count: snapshot.size});
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});

exports.uppercaseBook = onDocumentCreated("books/{bookId}", async (event) => {
  const data = event.data.data();
  const upperData = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      upperData[key] = String(data[key]).toUpperCase();
    }
  }

  await event.data.ref.set(upperData, {merge: false});
  console.log("Book data converted to uppercase:", upperData);
});
