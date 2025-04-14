// import React from "react";
// import {
//   IonMenu,
//   IonContent,
//   IonList,
//   IonItem,
//   IonImg,
//   IonIcon,
//   IonText,
//   IonMenuToggle,
// } from "@ionic/react";
// import {
//   informationCircleOutline,
//   shareSocialOutline,
//   documentTextOutline,
//   serverOutline,
//   mailOutline,
// } from "ionicons/icons";
// import RadhaGopinathImage from "../assets/radha_gopinath.jpg";
// import { useHistory } from "react-router-dom";

// function MenuBar() {
//   const history = useHistory();

//   const navigateAndClose = (path) => {
//     history.push(path); // Navigate to the page
//     // Use window.document to ensure we call the global document
//     window.document.querySelector("ion-menu").close();
//   };

//   return (
//     <IonMenu contentId="main-content">
//       <IonContent className="ion-no-padding">
//         <IonList className="ion-no-margin">
//           <IonImg
//             src={RadhaGopinathImage}
//             style={{
//               width: "100%",
//               height: "auto",
//               objectFit: "cover",
//               marginBottom: "10px",
//             }}
//           />

//           <IonMenuToggle>
//             <IonItem
//               button
//               lines="none"
//               className="ion-no-margin"
//               onClick={() => navigateAndClose("/home/about")}
//             >
//               <IonIcon icon={informationCircleOutline} slot="start" />
//               <IonText>About</IonText>
//             </IonItem>
//           </IonMenuToggle>

//           <IonMenuToggle>
//             <IonItem
//               button
//               lines="none"
//               className="ion-no-margin"
//               onClick={() => navigateAndClose("/home/share")}
//             >
//               <IonIcon icon={shareSocialOutline} slot="start" />
//               <IonText>Share the App</IonText>
//             </IonItem>
//           </IonMenuToggle>

//           <IonMenuToggle>
//             <IonItem
//               button
//               lines="none"
//               className="ion-no-margin"
//               onClick={() => navigateAndClose("/home/privacy")}
//             >
//               <IonIcon icon={documentTextOutline} slot="start" />
//               <IonText>Privacy Policy</IonText>
//             </IonItem>
//           </IonMenuToggle>

//           <IonMenuToggle>
//             <IonItem
//               button
//               lines="none"
//               className="ion-no-margin"
//               onClick={() => navigateAndClose("/home/term_policy")}
//             >
//               <IonIcon icon={serverOutline} slot="start" />
//               <IonText>Terms of Service</IonText>
//             </IonItem>
//           </IonMenuToggle>

//           <IonMenuToggle>
//             <IonItem
//               button
//               lines="none"
//               className="ion-no-margin"
//               onClick={() =>
//                 (window.location.href =
//                   "mailto:your.email@example.com?subject=Feedback&body=Your feedback here")
//               }
//             >
//               <IonIcon icon={mailOutline} slot="start" />
//               <IonText>Feedback / Queries</IonText>
//             </IonItem>
//           </IonMenuToggle>
//         </IonList>
//       </IonContent>
//     </IonMenu>
//   );
// }

// export default MenuBar;


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
                onClick={() => navigateAndClose("/home/term_policy")}
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
                    "mailto:your.email@example.com?subject=Feedback&body=Your feedback here")
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
