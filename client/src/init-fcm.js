import * as firebase from "firebase/app";
import "firebase/messaging";
const initializedFirebaseApp = firebase.initializeApp({
	// Project Settings => Add Firebase to your web app
  messagingSenderId: "317785342802"
});
const messaging = initializedFirebaseApp.messaging();
messaging.usePublicVapidKey(
	// Project Settings => Cloud Messaging => Web Push certificates
  "BBZuglw2NDXl2JTkF7IlZoLLvXQv-n8QbMq3LmihzFhcP-ieFtZf-vrDO_xFUSAYF7rGMaux4KteYTdWIASsGes"
);
export { messaging };