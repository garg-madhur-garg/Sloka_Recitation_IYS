// // import { Share } from "@capacitor/share";
// // import { IonButton } from "@ionic/react";

// // async function shareApp() {
// //   await Share.share({
// //     title: "Sloka Recitation App",
// //     text: "Download Sloka Recitation App for daily Sloka Learning!",
// //     url: "https://your-app-url.com",
// //     dialogTitle: "Share Sloka Recitation App",
// //   });
// // }

// // function SharePage() {
// //   return <IonButton onClick={shareApp}>Share App</IonButton>;
// // }

// // export default SharePage;

import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonButton,
  IonIcon,
  IonText,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import CustomAlert from "../CustomAlert";
import {
  shareSocialOutline,
  logoWhatsapp,
  logoFacebook,
  logoTwitter,
  copyOutline,
  sendOutline,
} from "ionicons/icons";

const APP_LINK = "https://play.google.com/store/apps/details?id=com.yourapp.package"; // Replace with your actual app link

const ShareApp = () => {
  const [showToast, setShowToast] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(APP_LINK);
      setShowToast(true);
    } catch (err) {
      setAlertVisible(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Share App</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={shareSocialOutline} style={{ marginRight: "8px" }} />
              Spread the Word!
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonText>
              <p>
                Help others discover the Sloka Recitation App. Share it with your friends and family through your favorite platforms.
              </p>
            </IonText>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
              <IonButton
                expand="block"
                color="success"
                href={`https://wa.me/?text=Check%20out%20this%20amazing%20Sloka%20Recitation%20App:%20${encodeURIComponent(APP_LINK)}`}
                target="_blank"
              >
                <IonIcon icon={logoWhatsapp} slot="start" />
                Share via WhatsApp
              </IonButton>

              <IonButton
                expand="block"
                color="tertiary"
                href={`https://t.me/share/url?url=${encodeURIComponent(APP_LINK)}&text=Check%20out%20this%20amazing%20Sloka%20Recitation%20App!`}
                target="_blank"
              >
                <IonIcon icon={sendOutline} slot="start" />
                Share via Telegram
              </IonButton>

              <IonButton
                expand="block"
                color="primary"
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_LINK)}`}
                target="_blank"
              >
                <IonIcon icon={logoFacebook} slot="start" />
                Share via Facebook
              </IonButton>

              <IonButton
                expand="block"
                color="medium"
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(APP_LINK)}&text=Check%20out%20this%20amazing%20Sloka%20Recitation%20App!`}
                target="_blank"
              >
                <IonIcon icon={logoTwitter} slot="start" />
                Share via Twitter
              </IonButton>

              <IonButton expand="block" color="dark" onClick={copyToClipboard}>
                <IonIcon icon={copyOutline} slot="start" />
                Copy Link to Clipboard
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Link copied to clipboard!"
          duration={2000}
          color="success"
        />

        <CustomAlert
          visible={alertVisible}
          title="Error"
          message="Failed to copy the link."
          buttons={[
            {
              text: "OK",
              onClick: () => setAlertVisible(false),
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ShareApp;
