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
  FlatList,
  AsyncStorage,
  TouchableHighlight,
  Image,
  Dimensions,
  Modal,
  TextInput,
  ToastAndroid
} from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob'
import * as firebase from "firebase";
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';

export default class SelectGarments extends Component<{}> {

  constructor(props){
    super(props);
    const polyfill = RNFetchBlob.polyfill
    window.XMLHttpRequest = polyfill.XMLHttpRequest
    window.Blob = polyfill.Blob

    this.state = {
      setNameModal: false,
      setName: ''
    }

  }

  static navigationOptions = ({navigation}) => ({
    header: null
  });

  componentDidMount(){
    AsyncStorage.getItem('username').then( (username) => {
      this.setState({
        username: username,
        myMatches: this.props.navigation.state.params.data
      })
    });
  }


  renderItem = ({item, index}) => {
      return(
        <View>
          <Image
            source={{uri: item}}
            style={{height: Dimensions.get('window').width / 2, width: Dimensions.get('window').width / 2}}
          />
        </View>
      )
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <Modal
           hardwareAccelerated={true}
           animationType={"fade"}
           transparent={true}
           visible={this.state.setNameModal}
           onRequestClose={() => this.setState({setNameModal: false})}
           >
           <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex:1, justifyContent: 'center', alignItems: 'center' }}>
             <View style={{width: 300, borderRadius: 5, backgroundColor:'white', elevation: 4, padding: 15, justifyContent:'center', alignItems: 'center'}}>
               <Text style={{fontSize: 18, fontWeight: 'bold', color: '#2196f3'}}>
                 Name this set
               </Text>
               <TextInput
                 underlineColorAndroid="transparent"
                 autoCapitalize="sentences"
                 autoCorrect={true}
                 style={{width: 200, backgroundColor: "#FCDA4F", opacity: 0.3, height: 40}}
                 onChangeText={(setName) => {
                   this.setState({
                       setName,
                   });
                 }}
                 value={this.state.setName}
                 placeholder="etc: Winter season"
               />
               <View style={{flexDirection: 'row'}}>
                 <TouchableHighlight
                   onPress={()=>{
                     this.setState({
                       setNameModal: false,
                       setName: ''
                     })
                   }}
                 >
                   <Text>
                     Cancel
                   </Text>
                 </TouchableHighlight>
                 <View style={{width: 30, backgroundColor: 'transparent'}}></View>
                 <TouchableHighlight
                   onPress={()=>{
                     this.setState({
                       setNameModal: false
                     });
                     if(this.state.setName === '' || this.state.setName === ' '){
                       return;
                     }
                      const setNameForSets = firebase.database().ref(this.state.username + '/sets');
                      setNameForSets.push({
                        setName: this.state.setName,
                        images: this.state.myMatches
                      });
                      navigate('Home');
                      ToastAndroid.show(
                          'Collection saved',
                          ToastAndroid.LONG
                        )
                   }}
                 >
                   <Text>
                     OK
                   </Text>
                 </TouchableHighlight>
               </View>
             </View>
           </View>
         </Modal>

        <View style={{position: 'absolute', right: 10, top: 10}}>
          <TouchableHighlight
            onPress={()=>{
              this.setState({
                setNameModal: true
              })
            }}
          >
            <Text>
              Save
            </Text>
          </TouchableHighlight>
        </View>
        <View style={{height: 50, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 15}}>What you matched!</Text>
        </View>
        <FlatList
          numColumns={2}
          style={{backgroundColor: 'transparent'}}
          keyExtractor={(item, index) => index}
          data={this.state.myMatches}
          renderItem={this.renderItem}
        />

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
