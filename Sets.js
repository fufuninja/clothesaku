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

import * as firebase from "firebase";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Sets extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      setNameModal: false,
      setName: '',
      mySets: []
    }

  }

  static navigationOptions = ({navigation}) => ({
    header: null
  });

  componentDidMount(){
    AsyncStorage.getItem('username').then( (username) => {

      const getMySets = firebase.database().ref(username + '/sets');
      getMySets.on('child_added', function(data){

        const getData = data.val();

        this.state.mySets.push({
          name: getData.setName,
          images: getData.images,
          setID: data.key
        });

        this.setState({
          mySets: this.state.mySets
        });

      }.bind(this));

      this.setState({
        username: username,
      });

    });
  }


  renderItem = ({item, index}) => {
      return(
        <View style={{height: Dimensions.get('window').width / 3, width: Dimensions.get('window').width / 3, backgroundColor: 'green'}}>
        <TouchableHighlight
          onPress={()=>{
            const { navigate } = this.props.navigation;

            navigate('ViewSet', {data: item});
          }}
        >
          <View style={{justifyContent: 'center', alignItems: 'center', height: Dimensions.get('window').width / 3, width: Dimensions.get('window').width / 3}}>
            <Text>
              {item.name}
            </Text>
          </View>
        </TouchableHighlight>
        </View>
      )
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View>
          <Text>
            My sets
          </Text>
        </View>
        <FlatList
          numColumns={3}
          style={{backgroundColor: 'transparent'}}
          keyExtractor={(item, index) => index}
          data={this.state.mySets}
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
