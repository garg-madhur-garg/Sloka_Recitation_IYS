import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonButtons,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
} from "@ionic/react";
import { lockClosedOutline, shieldCheckmarkOutline } from "ionicons/icons";

function Privacy() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Privacy Policy</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={lockClosedOutline} style={{ marginRight: "8px" }} />
              Your Privacy Matters
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            We respect your privacy. This application does not collect any user data. All your recordings and personal data remain solely on your device.
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={shieldCheckmarkOutline} style={{ marginRight: "8px" }} />
              Data Security
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            There is no backend or external database connected to this application. All user data, including audio files, is stored locally on your device. The application does not have the capability to access or alter any personal data stored on your mobile device.
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}

export default Privacy;
