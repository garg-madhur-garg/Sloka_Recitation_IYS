import { IonButton, IonPage } from "@ionic/react";

function Rate() {
  const handleRate = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=com.hiddenVault.SlokaRecitation"
    );
  };

  return <IonPage><IonButton onClick={handleRate}>Rate Us</IonButton></IonPage>
}

export default Rate;
