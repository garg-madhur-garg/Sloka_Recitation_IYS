import React from "react";
import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonImg,
  IonIcon,
  IonText,
  IonMenuToggle,
} from "@ionic/react";
import {
  informationCircleOutline,
  shareSocialOutline,
  documentTextOutline,
  serverOutline,
  mailOutline,
} from "ionicons/icons";
import RadhaGopinathImage from "../assets/radha_gopinath.jpg";
import { useHistory } from "react-router-dom";
import "./MenuBar.css"; // Import the CSS file for custom styles

function MenuBar() {
  const history = useHistory();

  const navigateAndClose = (path) => {
    history.push(path);
    window.document.querySelector("ion-menu").close();
  };

  return (
    <IonMenu contentId="main-content" className="custom-menu">
      <IonContent className="ion-no-padding">
        <IonList className="ion-no-margin">
          <IonImg
            src={RadhaGopinathImage}
            className="menu-background-image"
          />
          <div className="menu-items-container">
            <IonMenuToggle>
              <IonItem
                button
                lines="none"
                className="menu-item"
                onClick={() => navigateAndClose("/home/about")}
              >
                <IonIcon icon={informationCircleOutline} slot="start" />
                <IonText>About</IonText>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle>
              <IonItem
                button
                lines="none"
                className="menu-item"
                onClick={() => navigateAndClose("/home/share")}
              >
                <IonIcon icon={shareSocialOutline} slot="start" />
                <IonText>Share the App</IonText>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle>
              <IonItem
                button
                lines="none"
                className="menu-item"
                onClick={() => navigateAndClose("/home/privacy")}
              >
                <IonIcon icon={documentTextOutline} slot="start" />
                <IonText>Privacy Policy</IonText>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle>
              <IonItem
                button
                lines="none"
                className="menu-item"
                onClick={() => navigateAndClose("/home/terms")}
              >
                <IonIcon icon={serverOutline} slot="start" />
                <IonText>Terms of Service</IonText>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle>
              <IonItem
                button
                lines="none"
                className="menu-item"
                onClick={() =>
                  (window.location.href =
                    "mailto:slokarecitationiys@gmail.com?subject=Feedback&body=Your feedback here")
                }
              >
                <IonIcon icon={mailOutline} slot="start" />
                <IonText>Feedback / Queries</IonText>
              </IonItem>
            </IonMenuToggle>
          </div>
        </IonList>
      </IonContent>
    </IonMenu>
  );
}

export default MenuBar;
