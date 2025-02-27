// import React from "react";
// import { IonItem, IonLabel, IonMenu, IonPage } from "@ionic/react";
// import About from "./Extra/About";
// import Share from "./Extra/Share";
// import Rate from "./Extra/Rate";
// import Donate from "./Extra/Donate";
// import Privacy from "./Extra/Privacy";
// import Feedback from "./Extra/Feedback";

// function MenuBar() {
//   return (
//     <>
//       <IonMenu contentId="main-content">
//         <IonItem button>
//           <About />
//         </IonItem>

//         <IonItem button>
//           <Share />
//         </IonItem>

//         <IonItem button>
//           <Rate />
//         </IonItem>

//         <IonItem button>
//           <Donate />
//         </IonItem>

//         <IonItem button>
//           <Privacy />
//         </IonItem>

//         <IonItem button>
//           <Feedback />
//         </IonItem>
//       </IonMenu>
//     </>
//   );
// }
// export default MenuBar;

import React from "react";
import { IonMenu, IonContent, IonList, IonItem, IonImg, IonItemDivider, IonLabel } from "@ionic/react";
import About from "./Extra/About";
import Share from "./Extra/Share";
import Rate from "./Extra/Rate";
import Donate from "./Extra/Donate";
import Privacy from "./Extra/Privacy";
import Feedback from "./Extra/Feedback";

function MenuBar() {
  return (
    <IonMenu contentId="main-content">
      <IonContent className="ion-no-padding">
        <IonList className="ion-no-margin">
          <IonImg
            src="https://docs-demo.ionic.io/assets/madison.jpg"
            alt="The Wisconsin State Capitol building in Madison, WI at night"
          ></IonImg>
          
          <IonItem button href="./home/about" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
            <About />
          </IonItem>
          <IonItem button href="./home/share" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
            <Share />
          </IonItem>
          <IonItem button href="./home/rate" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
            <Rate />
          </IonItem>
          <IonItem button href="./home/donate" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
            <Donate />
          </IonItem>
          <IonItem button href="./home/privacy" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
            <Privacy />
          </IonItem>
          <IonItem button href="./home/feedback" lines="none" className="ion-no-margin" style={{borderBottom: "0.5px solid grey"}}>
            <Feedback />
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
}

export default MenuBar;
