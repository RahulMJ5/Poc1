import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import TextInputComponent from '../Components/TextInputComponent';
import ButtonComponent from '../Components/ButtonComponent';
import { SignUpUser } from '../Firebase/SignUp';
import { AddUser } from '../Firebase/Users';
import Firebase from '../Firebase/firebaseConfig';
import Spinner from 'react-native-loading-spinner-overlay';

class SignUp extends Component {
    state = {
        name: "",
        contact: "",
        email: "",
        password: "",
        loader: false
    }

    SignUPtoFIrebase = async () => {
        if(!this.state.name)
        {
            return alert('Please Enter Name');
        }
        if(!this.state.contact)
        {
            return alert('Please Enter Your Contact Number');
        }
        if(!this.state.email)
        {
            return alert('Please Enter Email');
        }
        if(!this.state.password)
        {
            return alert('Please Enter Password');
        }
        SignUpUser(this.state.email, this.state.password ).
            then( (res) => {
                var userUID = Firebase.auth().currentUser.uid;
                AddUser(this.state.name, this.state.email ,this.state.contact , userUID).
                    then(() => {
                        alert("Success")
                        this.props.navigation.navigate('Login');
                    }).
                    catch((error) => {
                        alert(error);
                    })
                console.log(userUID);
            }).
            catch((err) => {
                alert(err);
            })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                <TextInputComponent placeholder="Enter Name" updateFields={(text) => this.setState({ name: text })} />
                <TextInputComponent placeholder="Contact Number" updateFields={(text) => this.setState({ contact: text })} />
                <TextInputComponent placeholder="Enter Email" updateFields={(text) => this.setState({ email: text })} />
                <TextInputComponent placeholder="Enter Password" updateFields={(text) => this.setState({ password: text })} />
                <ButtonComponent title="Sign Up" onPress={() => { this.SignUPtoFIrebase() }} />
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login') }}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Already Have A Account</Text>
                </TouchableOpacity>
                <Spinner
                    visible={this.state.loader}
                />
            </View>
        )
    }
}




export default SignUp;