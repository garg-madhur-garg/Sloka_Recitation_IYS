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

function Privacy() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle className="header-title">Privacy Policy</IonTitle>
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
            style={{ borderRadius: "8px", width: "100%", maxWidth: "500px" }}
          >
            <IonCardContent>
              This application does not collect any user data. Additionally,
              there is no database or backend connected to this application.
              All user data, such as audio, is stored locally on the device. It
              is important to note that the application does not have the
              capability to access or alter personal data of the users stored
              in Mobile Device.
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Privacy;
