import React from 'react';
import { IonApp, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { Route, Redirect } from 'react-router';

import { playCircle, radio, library, search, home, addCircle, barChart, list } from 'ionicons/icons';

import HomePage from '../pages/HomePage';
import AddSloka from '../pages/AddSloka';
import SelectSloka from '../pages/SelectSloka';
import Playlist from '../pages/Playlist';
import SlokaDetail from '../pages/SlokaDetail';
import About from './Extra/About'
import Donate from './Extra/Donate'
import Privacy from './Extra/Privacy'
import Terms from './Extra/Terms'
import Rate from './Extra/Rate'
import Share from './Extra/Share'

function TabBar() {
  return (
    <IonApp>

    
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/home" />
          {/*
          Use the render method to reduce the number of renders your component will have due to a route change.

          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
          <Route path="/home" render={() => <HomePage />} exact={true} />
          <Route path="/addSloka" render={() => <AddSloka />} exact={true} />
          <Route path="/selectSloka" render={() => <SelectSloka />} exact={true} />
          <Route path="/playlist" render={() => <Playlist />} exact={true} />
          <Route path="/home/slokaDetail" render={() => <SlokaDetail/>} exact={true} />
          <Route path="/home/about" render={() => <About />} exact={true} />
          <Route path="/home/share" render={() => <Share />} exact={true} />
          <Route path="/home/rate" render={() => <Rate />} exact={true} />
          <Route path="/home/donate" render={() => <Donate />} exact={true} />
          <Route path="/home/privacy" render={() => <Privacy />} exact={true} />
          <Route path="/home/terms" render={() => <Terms />} exact={true} />
          <Route path="/home/feedback" render={() => <feedback />} exact={true} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>

          <IonTabButton tab="addSloka" href="/addSloka">
            <IonIcon icon={addCircle} />
            <IonLabel>Add Sloka</IonLabel>
          </IonTabButton>

          <IonTabButton tab="selectSloka" href="/selectSloka">
            <IonIcon icon={barChart} />
            <IonLabel>Select Sloka</IonLabel>
          </IonTabButton>

          <IonTabButton tab="playlist" href="/playlist">
            <IonIcon icon={list} />
            <IonLabel>Playlist</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
    </IonApp>
  );
}
export default TabBar;

