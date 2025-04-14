import React from "react";
import {
  IonCard,
  IonPage,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonButtons,
  IonCardContent,
  IonContent,
} from "@ionic/react";

function Terms() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle className="header-title">Terms of Service</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <IonCard
            className="ion-padding"
            style={{
              borderRadius: "16px",
              width: "100%",
              maxWidth: "600px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              background: "#f9f9f9",
            }}
          >
            <IonCardContent style={{ fontSize: "16px", lineHeight: "1.6" }}>
              This app is built with simplicity and your privacy in mind.
              <br />
              <br />
              We do not collect your personal information. No servers, no cloud, no third-party trackers. Everything you do—like recording your recitations—stays securely on your own device.
              <br />
              <br />
              By using the app, you agree to these simple terms: your data is yours, and we won’t touch it.
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Terms;
