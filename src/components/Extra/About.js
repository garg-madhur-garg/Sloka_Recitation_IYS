import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonBackButton,
  IonTitle,
  IonButtons,
  IonContent,
} from "@ionic/react";

function About() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle className="header-title">About</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>About the App</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            In our fast-paced world, finding moments of peace and reflection can be challenging. Our app is here to help you preserve and revisit those sacred moments by allowing you to record and store your cherished slokas.
            <br /><br />
            Whether you're capturing a personal recitation or saving a meaningful chant, our intuitive interface makes it simple to create a personal library of spiritual expressions.
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Why Choose Our App?</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <ul>
              <li><strong>Personalized Recording:</strong> Easily record your slokas in your own voice, creating a unique spiritual collection.</li>
              <li><strong>Secure Storage:</strong> Your recordings are safely stored on your device, ensuring privacy and offline access.</li>
              <li><strong>Organized Library:</strong> Manage and categorize your slokas for quick and easy retrieval.</li>
              <li><strong>User-Friendly Design:</strong> Navigate through the app effortlessly with our clean and intuitive interface.</li>
            </ul>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            Embrace the convenience of having your spiritual practices at your fingertips, ready to accompany you wherever you go.
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}

export default About;
