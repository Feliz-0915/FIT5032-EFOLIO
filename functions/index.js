const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.countBooks = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await admin.firestore().collection("books").get();
      const count = snapshot.size;
      res.status(200).json({count});
    } catch (error) {
      console.error("Error counting books:", error);
      res.status(500).send("Error counting books");
    }
  });
});


exports.uppercaseBook = functions.firestore
    .onDocumentCreated("books/{bookId}", async (event) => {
      const snap = event.data;
      if (!snap) return;
      const original = snap.data().name;
      console.log("Uppercasing", event.params.bookId, original);
      const uppercase = original.toUpperCase();
      await snap.ref.update({name: uppercase});
    });


exports.getAllBooks = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await admin.firestore().collection("books").get();
      const books = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).send("Error retrieving books");
    }
  });
});
