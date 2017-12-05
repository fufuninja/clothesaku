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

export default class SelectGarments extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      mySets: []
    }

  }

  static navigationOptions = ({navigation}) => ({
    header: null
  });

  componentDidMount(){
    AsyncStorage.getItem('username').then( (username) => {
      this.setState({
        username: username,
      });

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
        <View>
          <Text>
            {this.props.navigation.state.params.data.name}
          </Text>
        </View>
        <FlatList
          numColumns={2}
          style={{backgroundColor: 'transparent'}}
          keyExtractor={(item, index) => index}
          data={this.props.navigation.state.params.data.images}
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
