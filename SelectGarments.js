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

export default class SelectGarments extends Component<{}> {

  constructor(props){
    super(props);
    const polyfill = RNFetchBlob.polyfill
    window.XMLHttpRequest = polyfill.XMLHttpRequest
    window.Blob = polyfill.Blob

    this.state = {
      collectionList: [],
      addNameModal: false,
      imagesURL: []
    }

  }

  static navigationOptions = ({navigation}) => ({
    title: "Select from " + navigation.state.params.data.categoryName,
    header: null
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
              const indexOfUpdateRowText = this.state.collectionList.map(function(i){ return i}).indexOf(item);
                this.state.collectionList[indexOfUpdateRowText] = {
                  ...this.state.collectionList[indexOfUpdateRowText],
                   selected: !this.state.collectionList[indexOfUpdateRowText].selected
               };
                if(this.state.collectionList[indexOfUpdateRowText].selected === true){
                  this.state.imagesURL.push(this.state.collectionList[indexOfUpdateRowText].url);
                }else{
                  const indexOfUpdateRowText = this.state.imagesURL.map(function(i){ return i}).indexOf(item.url);

                  this.state.imagesURL.splice(indexOfUpdateRowText, 1)
                }
               this.setState({
                 imagesURL: this.state.imagesURL,
                 collectionList: this.state.collectionList,
                 addNameModal: true,
               });
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
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={{position: 'absolute', right: 10, top: 10}}>
          <TouchableHighlight
            onPress={()=>{
              if(this.state.imagesURL.length === 0){
                return;
              }
              this.props.navigation.state.params.addNewHorizontalList(this.state.imagesURL);
              this.props.navigation.goBack();
            }}
          >
            <Text>
              Done
            </Text>
          </TouchableHighlight>
        </View>
        <View style={{height: 50, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 15}}>Select your garments!</Text>
        </View>
        <FlatList
          numColumns={3}
          style={{backgroundColor: 'transparent'}}
          keyExtractor={(item, index) => index}
          data={this.state.collectionList}
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
