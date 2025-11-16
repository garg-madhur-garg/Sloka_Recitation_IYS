import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton,
  IonToast,
  IonText,
} from "@ionic/react";
import CustomAlert from "../CustomAlert";

function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleSendEmail = () => {
    if (!name || !email || !message) {
      setAlertVisible(true);
      return;
    }

    const mailToLink = `mailto:feedback@slokarecitation.com?subject=Feedback from ${name}&body=Name: ${name}%0DEmail: ${email}%0D%0DMessage:%0D${message}`;
    
    window.location.href = mailToLink;
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Feedback / Query</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonText>
          <h2 style={{ textAlign: "center" }}>We'd love to hear from you!</h2>
          <p style={{ textAlign: "center" }}>Your suggestions and questions help us improve.</p>
        </IonText>

        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput
            value={name}
            placeholder="Your name"
            onIonChange={(e) => setName(e.detail.value)}
            clearInput
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            placeholder="Your email"
            onIonChange={(e) => setEmail(e.detail.value)}
            clearInput
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Message</IonLabel>
          <IonTextarea
            rows={6}
            value={message}
            placeholder="Your message or query"
            onIonChange={(e) => setMessage(e.detail.value)}
          />
        </IonItem>

        <IonButton
          expand="block"
          color="primary"
          onClick={handleSendEmail}
          style={{ marginTop: "20px" }}
        >
          Send via Email
        </IonButton>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Redirecting to your email app..."
          duration={1500}
          color="success"
        />

        <CustomAlert
          visible={alertVisible}
          title="Missing Fields"
          message="Please fill in all fields."
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
}

export default Feedback;
