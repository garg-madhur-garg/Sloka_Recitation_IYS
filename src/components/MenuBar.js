

// // import React from "react";
// // import { IonMenu, IonContent, IonList, IonItem, IonImg, IonIcon, IonText} from "@ionic/react";
// // import { document, information, logoIonic, mail, server, share, terminalSharp } from 'ionicons/icons';
// // import About from "./Extra/About";
// // import Share from "./Extra/Share";
// // import Rate from "./Extra/Rate";
// // import Donate from "./Extra/Donate";
// // import Privacy from "./Extra/Privacy";
// // import Feedback from "./Extra/Feedback";
// // import Terms from "./Extra/Terms";
// // import RadhaGopinathImage from "../assets/radha_gopinath.jpg";

// // function MenuBar() {
// //   return (
// //     <IonMenu contentId="main-content">
// //       <IonContent className="ion-no-padding">
// //         <IonList className="ion-no-margin">
// //         <IonImg
// //               src={RadhaGopinathImage}
// //               // style={{
// //               //   width: "40px",
// //               //   height: "40px",
// //               //   marginLeft: "8px",
// //               //   margin: "10px",
// //               // }}
// //               // slot="end"
// //             />
          
// //           <IonItem button href="./home/about" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
// //             <IonIcon icon={information} slot="start"></IonIcon>
// //             <IonText><h6>About</h6></IonText>
// //             <About/>
// //           </IonItem>

// //           <IonItem button href="./home/share" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
// //           <IonIcon icon={share} slot="start"></IonIcon>
// //           <IonText><h6>Share the App</h6></IonText>
// //           </IonItem>

// //           {/* <IonItem button href="./home/rate" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
// //             <Rate />
// //           </IonItem> */}
// //           {/* <IonItem button href="./home/donate" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
// //             <Donate />
// //           </IonItem> */}

// //           <IonItem button href="./home/privacy" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
// //           <IonIcon icon={document} slot="start"></IonIcon>
// //           <IonText><h6>Privacy Policy</h6></IonText>
// //             <Privacy />
// //           </IonItem>

// //           <IonItem button href="./home/term_policy" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
// //           <IonIcon icon={server} slot="start" ></IonIcon>
// //           <IonText><h6>Terms of Service</h6></IonText>
// //             <Terms />
// //           </IonItem>

// //           <IonItem button href="./home/feedback" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}} onClick="window.location.href='mailto:recipient@example.com';">
// //           <IonIcon icon={mail} slot="start" ></IonIcon>
// //           <IonText><h6>Feedback / Queries</h6></IonText>
// //           </IonItem>
// //         </IonList>
// //       </IonContent>
// //     </IonMenu>
// //   );
// // }

// // export default MenuBar;


// import React from "react";
// import {
//   IonMenu,
//   IonContent,
//   IonList,
//   IonItem,
//   IonImg,
//   IonIcon,
//   IonText,
// } from "@ionic/react";
// import {
//   information,
//   share,
//   document as documentIcon,
//   server,
//   mail,
// } from "ionicons/icons";
// import RadhaGopinathImage from "../assets/radha_gopinath.jpg";
// import { useHistory } from "react-router-dom";

// function MenuBar() {
//   const history = useHistory();

//   const navigateAndClose = (path) => {
//     history.push(path);
//     const menu = document.querySelector("ion-menu");
//     if (menu) menu.close();
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

//           <IonItem
//             button
//             lines="none"
//             className="ion-no-margin"
//             onClick={() => navigateAndClose("/home/about")}
//           >
//             <IonIcon icon={information} slot="start" />
//             <IonText>About</IonText>
//           </IonItem>

//           <IonItem
//             button
//             lines="none"
//             className="ion-no-margin"
//             onClick={() => navigateAndClose("/home/share")}
//           >
//             <IonIcon icon={share} slot="start" />
//             <IonText>Share the App</IonText>
//           </IonItem>

//           <IonItem
//             button
//             lines="none"
//             className="ion-no-margin"
//             onClick={() => navigateAndClose("/home/privacy")}
//           >
//             <IonIcon icon={documentIcon} slot="start" />
//             <IonText>Privacy Policy</IonText>
//           </IonItem>

//           <IonItem
//             button
//             lines="none"
//             className="ion-no-margin"
//             onClick={() => navigateAndClose("/home/term_policy")}
//           >
//             <IonIcon icon={server} slot="start" />
//             <IonText>Terms of Service</IonText>
//           </IonItem>

//           <IonItem
//             button
//             lines="none"
//             className="ion-no-margin"
//             onClick={() =>
//               (window.location.href =
//                 "mailto:your.email@example.com?subject=Feedback&body=Your feedback here")
//             }
//           >
//             <IonIcon icon={mail} slot="start" />
//             <IonText>Feedback / Queries</IonText>
//           </IonItem>
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
  information,
  share,
  document as documentIcon, // Renamed to avoid conflict with global document
  server,
  mail,
} from "ionicons/icons";
import RadhaGopinathImage from "../assets/radha_gopinath.jpg";
import { useHistory } from "react-router-dom";

function MenuBar() {
  const history = useHistory();

  const navigateAndClose = (path) => {
    history.push(path); // Navigate to the page
    // Use window.document to ensure we call the global document
    window.document.querySelector("ion-menu").close();
  };

  return (
    <IonMenu contentId="main-content">
      <IonContent className="ion-no-padding">
        <IonList className="ion-no-margin">
          <IonImg
            src={RadhaGopinathImage}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              marginBottom: "10px",
            }}
          />

          <IonMenuToggle>
            <IonItem
              button
              lines="none"
              className="ion-no-margin"
              onClick={() => navigateAndClose("/home/about")}
            >
              <IonIcon icon={information} slot="start" />
              <IonText>About</IonText>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle>
            <IonItem
              button
              lines="none"
              className="ion-no-margin"
              onClick={() => navigateAndClose("/home/share")}
            >
              <IonIcon icon={share} slot="start" />
              <IonText>Share the App</IonText>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle>
            <IonItem
              button
              lines="none"
              className="ion-no-margin"
              onClick={() => navigateAndClose("/home/privacy")}
            >
              <IonIcon icon={documentIcon} slot="start" />
              <IonText>Privacy Policy</IonText>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle>
            <IonItem
              button
              lines="none"
              className="ion-no-margin"
              onClick={() => navigateAndClose("/home/term_policy")}
            >
              <IonIcon icon={server} slot="start" />
              <IonText>Terms of Service</IonText>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle>
            <IonItem
              button
              lines="none"
              className="ion-no-margin"
              onClick={() =>
                (window.location.href =
                  "mailto:your.email@example.com?subject=Feedback&body=Your feedback here")
              }
            >
              <IonIcon icon={mail} slot="start" />
              <IonText>Feedback / Queries</IonText>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
}

export default MenuBar;
