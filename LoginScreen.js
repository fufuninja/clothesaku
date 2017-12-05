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
  Modal,
  Image,
  Dimensions,
  TouchableHighlight,
  TextInput,
  AsyncStorage,
  ToastAndroid
} from 'react-native';
import ClothesakuIcon from './images/clothesaku.png';
import * as firebase from "firebase";

export default class LoginScreen extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      username: '',
      useremail: '',
      usernameCollection: []
    }

  }

  static navigationOptions = {
    header: null
  };

  componentDidMount(){
    const getAllUserName = firebase.database().ref('/');
    getAllUserName.on('child_added', function(data){
      const getData = data.val();
      if(getData.details){
        this.state.usernameCollection.push({
          username: data.key,
          useremail: getData.details.email
        });
        this.setState({
          usernameCollection: this.state.usernameCollection
        })        
      }
    }.bind(this))
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          source={ClothesakuIcon}
          style={{height:Dimensions.get('window').width - 110 , width: Dimensions.get('window').width - 120 }}
        />

        <View style={{height: 20}}></View>

        <View style={{width: 250, borderRadius: 5, backgroundColor:'transparent', padding: 15, justifyContent:'center', alignItems: 'center'}}>
          <TextInput
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
            autoCorrect={true}
            style={{width: 200, backgroundColor: "#FCDA4F", opacity: 0.3, height: 40}}
            onChangeText={(username) => {
              this.setState({
                  username,
              });
            }}
            value={this.state.username}
            placeholder = "User Name"
          />
          <View style={{height: 10, backgroundColor: 'transparent'}}></View>
          <TextInput
            underlineColorAndroid="transparent"
            autoCapitalize="sentences"
            autoCorrect={true}
            style={{width: 200, backgroundColor: "#FCDA4F", opacity: 0.3, height: 40}}
            onChangeText={(useremail) => {
              this.setState({
                  useremail,
              });
            }}
            value={this.state.useremail}
            placeholder = "User Email"
          />
        </View>

        <View>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() =>{
              const { navigate } = this.props.navigation;
              if(this.state.username === '' || this.state.username === ' ' ){
                alert('username is empty')
                return;
              }else if(this.state.useremail === '' || this.state.useremail === ' '){
                alert('useremail is empty')
                return;
              }

              const checkIndexExist = this.state.usernameCollection.map(function(i){ return i.username}).indexOf(this.state.username);
              if(checkIndexExist < 0){
                if(this.validateEmail(this.state.useremail)){
                  AsyncStorage.setItem('username', this.state.username);
                  AsyncStorage.setItem('useremail', this.state.useremail);

                  const setDetails = firebase.database().ref( this.state.username + '/details');
                  setDetails.set({
                    email: this.state.useremail,
                    createdAt: Date.now()
                  })
                  navigate('Home');
                }else{
                  alert('useremail is not valid.')
                }
              }else if(checkIndexExist > -1 && this.state.usernameCollection[checkIndexExist].useremail === this.state.useremail){
                AsyncStorage.setItem('username', this.state.username);
                AsyncStorage.setItem('useremail', this.state.useremail);
                navigate('Home');
                ToastAndroid.show(
                    'Welcome back, ' + this.state.username + '.',
                    ToastAndroid.LONG
                  )
              }
              else{
                alert('username exists. ')
              }

            }}
          >
            <View style={{justifyContent: 'center', alignItems: 'center', height: 40, width: 150, backgroundColor: '#FCDA4F', borderRadius: 25}}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>log in</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
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
