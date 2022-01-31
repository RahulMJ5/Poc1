import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component , useState } from 'react';
import { SearchBar } from 'react-native-elements/dist/searchbar/SearchBar';
import _ from 'lodash';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import firebase from '../Firebase/firebaseConfig';
import AppHeader from '../Components/AppHeader';
import { Load } from '../Container/Pagination';

class Dashboard extends Component {
    state = {
        allUsers: [],
        
    }

    async componentDidMount() {
        try {
            await firebase.database().ref('users').orderByChild('name')
                .on("value", async (datasnapshot) => {
                    const uuid = firebase.auth().currentUser.uid;
                    console.log('uuid', uuid);
                    let users = [];
                    datasnapshot.forEach((child) => {
                        if (child.val().uuid === uuid) {
                        }
                        else {
                            users.push({
                                userName: child.val().name,
                                userEmail: child.val().email,
                                userContact: child.val().contact,
                                uuid: child.val().uuid,
                            });
                        }
                    });

                    this.setState({ allUsers: users });
                })
        } catch (error) {
            alert(error);
        }
    }

    logOut = async () => {
        await firebase.auth().signOut().then(async () => {
            await AsyncStorage.removeItem('UID');
            this.props.navigation.navigate('Login');
        }).catch((err) => {
            alert(err);
        })
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: '86%',
              backgroundColor: '#CED0CE',
              marginLeft: '14%',
            }}
          />
        );
      };

    searchFilterFunction = text => {
        this.setState({
          value: text,
        });
    
        const newData = this.arrayholder.filter(item => {
          const itemData = `${item.name.toUpperCase()}`;
          const textData = text.toUpperCase();
    
          return itemData.indexOf(textData) > -1;
        });
        this.setState({
          data: newData,
        });
      };

    renderHeader = () => {
        return (
          <SearchBar
          backgroundColor = "grey"
            color= "white"
            placeholder="Type Here..."
            round
            onChangeText={text => this.searchFilterFunction(text)}
            autoCorrect={false}
            value={this.state.value}
          />
        );
      };


      renderFooter = () => {
          return(
              <ActivityIndicator size="large" color="D83E64" />
          )
      }

      getUsers = async () => {
        setIsLoading(true);
      
        const snapshot = await usersRef.orderBy('id').limit(5).get();
      
        if (!snapshot.empty) {
          let newUsers = [];
      
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      
          for (let i = 0; i < snapshot.docs.length; i++) {
            newUsers.push(snapshot.docs[i].data());
          }
      
          setUsers(newUsers);
        } else {
          setLastDoc(null);
        }
      
        setIsLoading(false);
      }
      
      getMore = async () => {
        if (lastDoc) {
          setIsMoreLoading(true);
      
          setTimeout(async() => {
          let snapshot = await usersRef.orderBy('id').startAfter(lastDoc.data().id).limit(5).get();
      
          if (!snapshot.empty) {
            let newUsers = users;
      
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      
            for(let i = 0; i < snapshot.docs.length; i++) {
              newUsers.push(snapshot.docs[i].data());
            }
      
            setUsers(newUsers);
            if (snapshot.docs.length < 3) setLastDoc(null);
          } else {
            setLastDoc(null);
          }
      
          setIsMoreLoading(false);
        }, 1000);
        }
      
        onEndReachedCalledDuringMomentum = true;
      }
    
      render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <AppHeader title="Users" navigation={this.props.navigation} onPress={() => this.logOut()} />

                <FlatList
                    alwaysBounceVertical={false}
                    data={this.state.allUsers}
                    style={{ padding: 5 }}
                    keyExtractor={(_, index) => index.toString()}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    onEndReachedThreshold={0}
                     onMomentumScrollBegin = {() => {onEndReachedCalledDuringMomentum = false;}}
                     onEndReached = {() => {
                         if (!onEndReachedCalledDuringMomentum) {
                        getMore();
                         }
                     }
                     }
                    renderItem={({ item }) => (
                        <View>
                            <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 20, marginTop: 20 }} onPress={() => this.props.navigation.navigate('Chat', { UserName: item.userName, guestUid: item.uuid })}>
                                <View style={{ width: '65%', alignItems: 'flex-start', justifyContent: 'center', marginLeft: 10 }}>
                                    <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Name = {item.userName}</Text>
                                    <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Email = {item.userEmail}</Text>
                                    <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Contact = {item.userContact}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ borderWidth: 0.5, borderColor: '#fff' }} />
                        </View>
                       
                    )}
                    
                />
            </View>
           
        )
    }
}

export default Dashboard;