import './App.css';
import '@ionic/react/css/core.css';
import { setupIonicReact } from '@ionic/react';
import TabBar from './components/TabBar';

import { IonReactRouter } from "@ionic/react-router";
import { IonRouterOutlet } from "@ionic/react";
import { Route, Redirect } from "react-router-dom";
import About from "./components/Extra/About";
import Donate from "./components/Extra/Donate";
import FeedBack from "./components/Extra/Feedback";
import Privacy from "./components/Extra/Privacy";
import Rate from "./components/Extra/Rate";
import Share from "./components/Extra/Share";
import Terms from "./components/Extra/Terms"

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();

function App() {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/" exact={true}>
          <Redirect to="/home" />
        </Route>
        <Route path="/about" component={About} exact={true} />
        <Route path="/donate" component={Donate} exact={true} />
        <Route path="/feedback" component={FeedBack} exact={true} />
        <Route path="/privacy" component={Privacy} exact={true} />
        <Route path="/rate" component={Rate} exact={true} />
        <Route path="/share" component={Share} exact={true} />
        <Route path="/terms" component={Terms} exact={true} />
        {/* <IonFooter> */}
        <TabBar />
        {/* </IonFooter> */}
      </IonRouterOutlet>
    </IonReactRouter>
  );
}

export default App;
