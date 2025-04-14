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


// import React from "react";
// import {
//   IonPage,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonButtons,
//   IonBackButton,
//   IonContent,
//   IonButton,
//   IonIcon,
//   IonText,
//   IonToast,
// } from "@ionic/react";
// import {
//   shareSocialOutline,
//   logoWhatsapp,
//   logoFacebook,
//   logoTwitter,
//   copyOutline,
//   sendOutline, // use this for Telegram
// } from "ionicons/icons";

// const APP_LINK = "https://play.google.com/store/apps/details?id=com.yourapp.package"; // Replace with actual link

// function ShareApp() {
//   const [showToast, setShowToast] = React.useState(false);

//   // const shareNative = async () => {
//   //   if (navigator.share) {
//   //     try {
//   //       await navigator.share({
//   //         title: "Check out this awesome app!",
//   //         text: "Download this amazing Sloka Recitation app!",
//   //         url: APP_LINK,
//   //       });
//   //     } catch (err) {
//   //       console.error("Native share failed:", err);
//   //     }
//   //   } else {
//   //     alert("Native sharing not supported on this device.");
//   //   }
//   // };

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(APP_LINK);
//       setShowToast(true);
//     } catch (err) {
//       alert("Failed to copy.");
//     }
//   };

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar color="primary">
//           <IonButtons slot="start">
//             <IonBackButton defaultHref="/home" />
//           </IonButtons>
//           <IonTitle>Share App</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent className="ion-padding">
//         <IonText>
//           <h2 style={{ textAlign: "center" }}>Spread the Word!</h2>
//           <p style={{ textAlign: "center" }}>
//             Choose a method to share this app with others.
//           </p>
//         </IonText>

//         <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "30px" }}>
//           {/* <IonButton expand="block" color="primary" onClick={shareNative}>
//             <IonIcon icon={shareSocialOutline} slot="start" />
//             Share via Native Option
//           </IonButton> */}

//           <IonButton
//             expand="block"
//             color="success"
//             href={`https://wa.me/?text=Check%20this%20awesome%20app%3A%20${encodeURIComponent(APP_LINK)}`}
//             target="_blank"
//           >
//             <IonIcon icon={logoWhatsapp} slot="start" />
//             Share via WhatsApp
//           </IonButton>

//           <IonButton
//             expand="block"
//             color="tertiary"
//             href={`https://t.me/share/url?url=${encodeURIComponent(APP_LINK)}&text=Check this awesome app!`}
//             target="_blank"
//           >
//             <IonIcon icon={sendOutline} slot="start" />
//             Share via Telegram
//           </IonButton>

//           <IonButton
//             expand="block"
//             color="secondary"
//             href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_LINK)}`}
//             target="_blank"
//           >
//             <IonIcon icon={logoFacebook} slot="start" />
//             Share via Facebook
//           </IonButton>

//           <IonButton
//             expand="block"
//             color="medium"
//             href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(APP_LINK)}&text=Check this awesome app!`}
//             target="_blank"
//           >
//             <IonIcon icon={logoTwitter} slot="start" />
//             Share via Twitter
//           </IonButton>

//           <IonButton expand="block" color="dark" onClick={copyToClipboard}>
//             <IonIcon icon={copyOutline} slot="start" />
//             Copy Link to Clipboard
//           </IonButton>
//         </div>

//         <IonToast
//           isOpen={showToast}
//           onDidDismiss={() => setShowToast(false)}
//           message="Link copied to clipboard!"
//           duration={1500}
//           color="success"
//         />
//       </IonContent>
//     </IonPage>
//   );
// }

// export default ShareApp;



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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(APP_LINK);
      setShowToast(true);
    } catch (err) {
      alert("Failed to copy the link.");
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
      </IonContent>
    </IonPage>
  );
};

export default ShareApp;
