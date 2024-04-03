import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { hammer, square } from 'ionicons/icons';
import BluetoothEsp from './pages/ConnectBluetooth/BluetoothEsp'
import Hammer from './pages/Hammer/Hammer';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/hammer">
            <Hammer />
          </Route>
          <Route exact path="/connectEsp32">
            <BluetoothEsp />
          </Route>
          <Route exact path="/hammer">
            <Hammer />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">        
          <IonTabButton tab="connectEsp32" href="/connectEsp32">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Car Controller</IonLabel>
          </IonTabButton>
          <IonTabButton tab="hammer" href="/hammer">
            <IonIcon aria-hidden="true" icon={hammer} />
            <IonLabel>Hammer</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
