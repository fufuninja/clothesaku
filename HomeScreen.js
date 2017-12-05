/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  FlatList,
  TouchableHighlight,
  Modal,
  TextInput,
  Dimensions
} from 'react-native';
import * as firebase from "firebase";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class HomeScreen extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {

    }

  }

  static navigationOptions = {
   header: null
 };

 componentDidMount(){

   const { navigate } = this.props.navigation;

   AsyncStorage.getItem('username').then( (username) => {
     AsyncStorage.getItem('useremail').then( (useremail) => {
      if(useremail === null || username === null){
        navigate('Login');
      }else{
        this.setState({
          username: username,
          useremail: useremail
        });
      }
    })
  })
 }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={()=>{
            navigate('Garments')
          }}
        >
          <Text>
            Garments
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={()=>{
            navigate('MixMatch')
          }}
        >
          <Text>
            Mix and Match
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={()=>{
            navigate('Sets')
          }}
        >
          <Text>
            My Collections
          </Text>
        </TouchableHighlight>
        <View style={{height: 200}}></View>
        <TouchableHighlight
          onPress={()=>{
            AsyncStorage.clear();
            navigate('Login')
          }}
        >
          <Text>
            Sign Out
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
