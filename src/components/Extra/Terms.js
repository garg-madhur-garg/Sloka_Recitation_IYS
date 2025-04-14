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
            style={{ borderRadius: "8px", width: "100%", maxWidth: "500px" }}
          >
            <IonCardContent>
            Our app doesn't collect your info. It doesn't use any databases or connect to other servers. Your audio stays on your device.
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Terms;
