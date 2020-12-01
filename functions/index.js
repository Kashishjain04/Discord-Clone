const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

exports.myFunction = functions.firestore
  .document("channels/{channelId}/messages/{messageId}")
  .onWrite(async (change, context) => {
    userName = change.after.data().user.displayName;
    photo = change.after.data().user.photo;
    message = change.after.data().message;
    const channelName = await db
      .collection("channels")
      .doc(context.params.channelId)
      .get()
      .then((doc) => doc.data().channelName);

    const payload = {
      notification: {
        title: channelName,
        body: `${userName}: ${message}`,
        icon: photo,
      },
    };
    const fcmTokens = await Promise.all([
      db
        .collection("fcm")
        .doc("fcm")
        .get()
        .then((doc) => doc.data().tokens),
    ]);
    if (!fcmTokens.length) {
      return console.log("There are no notification tokens to send to.");
    }

    const response = await messaging.sendToDevice(fcmTokens[0], payload);

    response.results.forEach((result, index) => {
      const error = result.error;
      if (error) {
        console.error(
          "Failure sending notification to",
          fcmTokens[index],
          error
        );
        // Cleanup the tokens who are not registered anymore.
        if (
          error.code === "messaging/invalid-registration-token" ||
          error.code === "messaging/registration-token-not-registered"
        ) {
          db.collection("fcm")
            .doc("fcm")
            .update({
              tokens: admin.firestore.FieldValue.arrayRemove(fcmTokens[index]),
            });
        }
      }
    });
  });

exports.onSignUp = functions.auth.user().onCreate((user) => {
  obj = {
    displayName: user.displayName,
    uid: user.uid,
    photo: user.photoURL,
  };
  db.collection("users").doc(user.uid).create(obj);
});
