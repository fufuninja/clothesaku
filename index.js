import { AppRegistry } from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import * as firebase from "firebase";

import HomeScreen from './HomeScreen';
import GarmentCollection from './GarmentCollection';
import LoginScreen from './LoginScreen';
import MixMatch from './MixMatch';
import SelectGarments from './SelectGarments';
import MyMatches from './MyMatches';
import Garments from './Garments';
import Sets from './Sets';
import ViewSet from './ViewSet';

var config = {
   apiKey: "AIzaSyD-mAV_THSvabNk_A8u05ipzn4IsDDKWBk",
   authDomain: "clothesaku.firebaseapp.com",
   databaseURL: "https://clothesaku.firebaseio.com",
   projectId: "clothesaku",
   storageBucket: "clothesaku.appspot.com",
   messagingSenderId: "821444514689"
 };

firebase.initializeApp(config);

const Clothesaku = StackNavigator({
  Home: {screen: HomeScreen},
  Login: {screen: LoginScreen},
  Collection: {screen: GarmentCollection},
  MixMatch: {screen: MixMatch},
  ViewSet: {screen: ViewSet},
  Sets: {screen: Sets},
  Garments: {screen: Garments},
  MyMatches: {screen: MyMatches},
  SelectGarments: {screen: SelectGarments}
}, {
  initialRouteName: 'Home',
  headerMode: 'screen'
});

AppRegistry.registerComponent('Clothesaku', () => Clothesaku);
