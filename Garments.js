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

export default class Garments extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      categories: [],
      addCategoryModal: false,
      category: ''
    }

  }

  static navigationOptions = {
   title: 'Welcome',
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

        const getCategories = firebase.database().ref(this.state.username + '/categories');
        getCategories.on('child_added', function(data){
          const getData = data.val();
          this.state.categories.push({
            categoryName: getData.categoryName,
            categoryID: data.key
          });
          this.setState({
            categories: this.state.categories
          })
        }.bind(this))
      }
    })
  })
 }

 renderItem = ({ item, index }) => {
   const { navigate } = this.props.navigation;
   return(
     <View style={{ alignItems: 'center', justifyContent: 'center'}}>
       <TouchableHighlight
         onPress={()=>{
           navigate('Collection', {data: item})
         }}
        >
       <View style={{height: 50, width: Dimensions.get('window').width - 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
         <Text style={{fontWeight: 'bold', fontSize: 15}}>
           {item.categoryName}
         </Text>
       </View>
     </TouchableHighlight>
       <View style={{height: 1, width: 250, backgroundColor: 'black'}}></View>
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
            visible={this.state.addCategoryModal}
            onRequestClose={() => this.setState({addCategoryModal: false})}
            >
              <View style={{backgroundColor: 'rgba(0,0,0,0.5)', flex:1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{width: 250, borderRadius: 5, backgroundColor:'white', elevation: 4, padding: 15, justifyContent:'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold', color: '#2196f3'}}>
                    Add new category
                  </Text>
                  <TextInput
                    underlineColorAndroid="transparent"
                    autoCapitalize="sentences"
                    autoCorrect={true}
                    style={{width: 200, backgroundColor: "#FCDA4F", opacity: 0.3, height: 40}}
                    onChangeText={(category) => {
                      this.setState({
                          category,
                      });
                    }}
                    value={this.state.category}
                    placeholder = "craete new category"
                  />
                  <View style={{flexDirection: 'row'}}>
                    <TouchableHighlight
                      onPress={()=>{
                        this.setState({
                          addCategoryModal: false
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
                          addCategoryModal: false
                        });
                        if(this.state.category === '' || this.state.category === ' '){
                          return;
                        }
                        const setNewCategory = firebase.database().ref(this.state.username + '/categories/');
                        setNewCategory.push({
                          categoryName: this.state.category
                        }, function(err){
                          if(err){

                          }else{
                            this.setState({
                              category: ''
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

          <View style={{ width: Dimensions.get('window').width}}>

            <View style={{height: 60, width: 120, left: ( Dimensions.get('window').width - 120 ) / 2 }}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                Garments
              </Text>
            </View>

          </View>


        <FlatList
          style={{backgroundColor: 'transparent'}}
          keyExtractor={(item, index) => index}
          data={this.state.categories}
          renderItem={this.renderItem}
        />

        <View style={{alignItems: 'center', justifyContent: 'center', height: 50, width: 50, position: 'absolute', right: 20, bottom: 20, backgroundColor: 'yellow', borderRadius: 25, elevation: 2}}>
          <TouchableHighlight
            underlayColor='transparent'
            onPress={()=>{
              this.setState({
                addCategoryModal: true
              })
            }}
          >
            <View style={{width: 50, height: 50, justifyContent: 'center', alignItems: 'center'}}>
              <Icon name="plus" size={18} color="black" />
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
