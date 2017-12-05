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
  TextInput
} from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob'
import * as firebase from "firebase";
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';

export default class GarmentCollection extends Component<{}> {

  constructor(props){
    super(props);
    const polyfill = RNFetchBlob.polyfill
    window.XMLHttpRequest = polyfill.XMLHttpRequest
    window.Blob = polyfill.Blob

    this.state = {
      collectionList: [],
      addNameModal: false
    }

  }

  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.data.categoryName,
  });

  componentDidMount(){
    AsyncStorage.getItem('username').then( (username) => {
      this.setState({
        username: username
      })
      const getCollectList = firebase.database().ref(username + '/categories/' + this.props.navigation.state.params.data.categoryID + '/uploads');
      getCollectList.on('child_added', function(data){
        const getData = data.val();
        this.state.collectionList.push({
          url: getData.url,
          selected: false,
          itemID: data.key
        });
        this.setState({
          collectionList: this.state.collectionList
        })
      }.bind(this))
    });
  }


  renderItem = ({item, index}) => {
      return(
        <View>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={()=>{
              // const indexOfUpdateRowText = this.state.collectionList.map(function(i){ return i}).indexOf(item);
              //   this.state.collectionList[indexOfUpdateRowText] = {
              //     ...this.state.collectionList[indexOfUpdateRowText],
              //      selected: !this.state.collectionList[indexOfUpdateRowText].selected
              //  };
               this.setState({
                 // collectionList: this.state.collectionList,
                 addNameModal: true,
                 selectedItemID: item.itemID,
               });
               const setNameToItem = firebase.database().ref(this.state.username + '/categories/' + this.props.navigation.state.params.data.categoryID + '/uploads/' + item.itemID);
               setNameToItem.once('value').then(function(data){
                 const getData = data.val();
                 if(getData.itemName){
                   this.setState({
                     itemName: getData.itemName
                   })
                 }else{
                   this.setState({
                     itemName: ''
                   })
                 }
               }.bind(this))
            }}
          >
            <View>
              <Image
                source={{uri: item.url}}
                style={{height: Dimensions.get('window').width / 3, width: Dimensions.get('window').width / 3}}
              />
              {item.selected ? (
                <View style={{position: 'absolute', top: 0, left:0, height: Dimensions.get('window').width / 3,
                width: Dimensions.get('window').width / 3, backgroundColor: '#FCDA4F', opacity: 0.3}}></View>
              ) : null}
            </View>
          </TouchableHighlight>
        </View>
      )
  }

  render() {
    return (
      <View style={styles.container}>

        <Modal
           hardwareAccelerated={true}
           animationType={"fade"}
           transparent={true}
           visible={this.state.addNameModal}
           onRequestClose={() => this.setState({addNameModal: false})}
           >
           <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex:1, justifyContent: 'center', alignItems: 'center' }}>
             <View style={{width: 300, borderRadius: 5, backgroundColor:'white', elevation: 4, padding: 15, justifyContent:'center', alignItems: 'center'}}>
               <Text style={{fontSize: 18, fontWeight: 'bold', color: '#2196f3'}}>
                 Apparel Name
               </Text>
               <TextInput
                 underlineColorAndroid="transparent"
                 autoCapitalize="sentences"
                 autoCorrect={true}
                 style={{width: 200, backgroundColor: "#FCDA4F", opacity: 0.3, height: 40}}
                 onChangeText={(itemName) => {
                   this.setState({
                       itemName,
                   });
                 }}
                 value={this.state.itemName}
                 placeholder="etc: My black dress"
               />
               <View style={{flexDirection: 'row'}}>
                 <TouchableHighlight
                   onPress={()=>{
                     this.setState({
                       addNameModal: false,
                       itemName: ''
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
                       addNameModal: false
                     });
                     if(this.state.itemName === '' || this.state.itemName === ' '){
                       return;
                     }
                     const setNameToItem = firebase.database().ref(this.state.username + '/categories/' + this.props.navigation.state.params.data.categoryID + '/uploads/' + this.state.selectedItemID);
                     setNameToItem.update({
                       itemName: this.state.itemName
                     }, function(err){
                       if(err){

                       }else{
                         this.setState({
                           itemName: ''
                         })
                       }
                     }.bind(this))
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

        <FlatList
          numColumns={3}
          style={{backgroundColor: 'transparent'}}
          keyExtractor={(item, index) => index}
          data={this.state.collectionList}
          renderItem={this.renderItem}
        />

        <View style={{alignItems: 'center', justifyContent: 'center', height: 50, width: 50, position: 'absolute', right: 20, bottom: 20, backgroundColor: '#FCDA4F', borderRadius: 25, elevation: 2}}>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={()=>{
              AsyncStorage.getItem('username').then( (username) => {
              ImagePicker.openPicker({
                 width: 500,
                 height: 500,
                 cropping: true
               }).then(image => {
                 const path = image.path;
                 const imageName = path.substr(path.lastIndexOf('/') + 1);
                 Blob.build(RNFetchBlob.wrap(path), { type : 'image/jpeg' })
                 .then((blob) => firebase.storage()
                 .ref('images')
                 .child(imageName)
                 .put(blob, { contentType : 'image/png' })
                 )
                 .then((snapshot) => {
                   const addNewItemToCollectionFromGallery = firebase.database().ref( username + '/categories/' + this.props.navigation.state.params.data.categoryID + '/uploads');
                   addNewItemToCollectionFromGallery.push({ url: snapshot.metadata.downloadURLs[0]});
                 })
               })
               .catch(error => {
               });

             });
            }}
          >
            <View style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="picture-o" size={18} color="black" />
            </View>
          </TouchableHighlight>
        </View>

        <View style={{alignItems: 'center', justifyContent: 'center', height: 50, width: 50, position: 'absolute', right: 20, bottom: 80, backgroundColor: '#FCDA4F', borderRadius: 25, elevation: 2}}>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={()=>{
              AsyncStorage.getItem('username').then( (username) => {
              ImagePicker.openCamera({
                 width: 500,
                 height: 500,
                 cropping: true
               }).then(image => {
                 const path = image.path;
                 const imageName = path.substr(path.lastIndexOf('/') + 1);
                 Blob.build(RNFetchBlob.wrap(path), { type : 'image/jpeg' })
                 .then((blob) => firebase.storage()
                 .ref('images')
                 .child(imageName)
                 .put(blob, { contentType : 'image/png' })
                 )
                 .then((snapshot) => {
                   const addNewItemToCollectionFromGallery = firebase.database().ref( username + '/categories/' + this.props.navigation.state.params.data.categoryID + '/uploads');
                   addNewItemToCollectionFromGallery.push({ url: snapshot.metadata.downloadURLs[0]});
                 })
               })
               .catch(error => {
               });

             });
            }}
          >
            <View style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="camera" size={18} color="black" />
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
