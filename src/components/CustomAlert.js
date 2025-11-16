import React from 'react';
import { 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonFooter, 
  IonButton, 
  IonGrid, 
  IonRow, 
  IonCol 
} from '@ionic/react';
import "./CustomAlert.css";

const CustomAlert = ({ visible, title, message, buttons }) => {
  const handleButtonClick = (button) => {
    if (button.onClick) {
      button.onClick();
    } else if (button.handler) {
      button.handler();
    }
  };

  return (
    <IonModal isOpen={visible} backdropDismiss={false} cssClass="custom-alert-modal">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>{message}</p>
      </IonContent>
      <IonFooter>
        <IonGrid>
          <IonRow>
            {buttons.map((button, index) => (
              <IonCol key={index}>
                <IonButton
                  expand="block"
                  color={button.style === "destructive" ? "danger" : "primary"}
                  onClick={() => handleButtonClick(button)}
                >
                  {button.text}
                </IonButton>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonModal>
  );
};

export default CustomAlert;
