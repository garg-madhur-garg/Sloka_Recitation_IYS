import { Share } from "@capacitor/share";
import { IonButton } from "@ionic/react";

async function shareApp() {
  await Share.share({
    title: "Sloka Recitation App",
    text: "Download Sloka Recitation App for daily Bhagavad Gita Recitation!",
    url: "https://your-app-url.com",
    dialogTitle: "Share Sloka Recitation App",
  });
}

function SharePage() {
  return <IonButton onClick={shareApp}>Share App</IonButton>;
}

export default SharePage;
