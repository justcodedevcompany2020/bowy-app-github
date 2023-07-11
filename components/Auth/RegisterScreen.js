import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    StatusBar,
    ScrollView,
    Modal,
    Animated,
    Alert, Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import { AntDesign } from '@expo/vector-icons';
import Svg, { Path } from "react-native-svg"
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location'

import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';




export default class App extends Component {

    constructor(props) {

        super(props);
        this.state = {
            name: '',
            email: '',
            number: '',
            password: '',
            password_confirmation: '',
            name_error: null,
            email_error: null,
            phone_error: null,
            password_error: null,
            location_error:null,
            password_confirmation_error: null,
            ready: false,
            where: { lat: null, lng: null },
            error: null,
            location: '',
            disableButton: false,
            privacy_policy: false,
            privacy_policy_error:false,
            privacy_policy_error_text: ''
        };
    }


    handleRegistration = async () => {

        // await this.setState({
        //     disableButton: true
        // })

        const { name, password, email, number, password_confirmation, location,privacy_policy, privacy_policy_error, privacy_policy_error_text } = this.state;
        if (!privacy_policy)
        {
            this.setState({
                privacy_policy_error: true,
                privacy_policy_error_text: ''
            });

            return false;
        }

        fetch('https://bowy.ru/api/registration', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                password,
                email,
                number,
                password_confirmation,
                location
            })
        })
            .then(res => res.json())
            .then((response) => {

                console.log(response, "res")
                // this.setState({
                //     disableButton: false
                // })
                if (response.success === false && response.message == 'Validation errors' ) {

                    if (response.data.name) {
                        this.setState({ name_error: response.data.name[0] })
                    } else {
                        this.setState({ name_error: null, })
                    }

                    if (response.data.email) {
                        if (response.data.email[0] == 'Повторяющаяся запись для электронной почты') {
                            this.setState({ email_error: 'Данная почта уже используется' })
                        } else {
                            this.setState({ email_error: response.data.email[0] })
                        }
                    } else {
                        this.setState({ email_error: null, })
                    }

                    if (response.data.number) {
                        this.setState({ phone_error: response.data.number[0] })
                    } else {
                        this.setState({ phone_error: null, })
                    }

                    if (response.data.password) {
                        this.setState({ password_error: response.data.password[0] })
                    } else {
                        this.setState({ password_error: null, })
                    }

                    if (response.data.password_confirmation) {
                        this.setState({ password_confirmation_error: response.data.password_confirmation[0] })
                    } else {
                        this.setState({ password_confirmation_error: null, })
                    }

                }
                else if (response.hasOwnProperty('token')) {

                    this.setState({
                        name: '',
                        email: '',
                        number: '',
                        password: '',
                        location:'',
                        password_confirmation: '',
                        name_error: null,
                        email_error: null,
                        phone_error: null,
                        password_error: null,
                        password_confirmation_error: null,
                        location_error: null
                    })



                    // AsyncStorage.setItem("loggedUserID", `${response.user?.id}`).then((e) => {
                    //     console.log(e)
                    // })
                    //
                    // AsyncStorage.setItem("userToken", `${response.token}`).then((e) => {
                    //     console.log(e)
                    // })
                    //
                    AsyncStorage.setItem("location", `${response.user?.location}`).then((e) => {
                        console.log(e)
                    })
                    this.props.navigation.navigate('ConfirmEmail', {
                        params:email,
                    })
                }




                // console.log(response.user?.location, 'dsdsdsd');
            })
            .catch(e => {
                console.log(e, "catch error")
            })
    }


    goToLogin = () => {
        this.props.navigation.navigate('Login')
        this.setState({
            name: '',
            email: '',
            number: '',
            password: '',
            confirm_password: '',
            name_error: null,
            email_error: null,
            phone_error: null,
            password_error: null,
            password_confirmation_error: null,
            location: ''
        })
        // console.log('locarion', location)
    }



    componentDidMount() {
        let geoOptions = {
            enableHighAccuracy: true,
            timeOut: 20000,
            maximumAge: 60 * 60 * 24
        };
        this.setState({ ready: false, error: null });
        Location.installWebGeolocationPolyfill()
        navigator.geolocation.getCurrentPosition(geoOptions)
        console.log(geoOptions);
    }

    geoSuccess = (position) => {
        console.log(position.coords.latitude);

        this.setState({
            ready: true,
            where: { lat: position.coords.latitude, lng: position.coords.longitude }

        })
        console.log(this.state.where)
    }
    geoFailure = (err) => {
        this.setState({ error: err.message });
    }



    render() {
        return (


            <SafeAreaView style={styles.container}>

                <Text style={styles.inputText}>
                    Регистрация
                </Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                    style={{ flex: 1, width: "100%" }}
                >

                    {!this.state.name_error ?
                        <View style={[styles.errorView, { marginTop: 10 }]}>
                            <TextInput
                                value={this.state.name}
                                onChangeText={(name) => this.setState({ name })}
                                placeholder='Ник'
                                maxLength={45}
                                style={styles.input}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        :
                        <View style={styles.errorView}>
                            <Text style={{
                                color: 'red',
                                fontSize: 10,
                                marginBottom: 3,
                                alignSelf: 'flex-start',
                                paddingLeft: 3,
                            }}>{this.state.name_error}</Text>
                            <TextInput
                                value={this.state.name}
                                onChangeText={(name) => this.setState({ name })}
                                placeholder='Ник'
                                maxLength={45}
                                style={styles.errorMessage}
                                underlineColorAndroid="transparent"
                            />
                        </View>}




                    {!this.state.email_error ?
                        <View style={styles.errorView}>

                            <TextInput
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}
                                placeholder='Почта'
                                maxLength={45}
                                style={styles.input}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        :
                        <View style={styles.errorView}>
                            <Text style={{
                                color: 'red',
                                fontSize: 10,
                                marginBottom: 3,
                                alignSelf: 'flex-start',
                                paddingLeft: 3,
                            }}>{this.state.email_error}</Text>
                            <TextInput
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}
                                placeholder='Почта'
                                maxLength={45}
                                style={styles.errorMessage}
                                underlineColorAndroid="transparent"
                            />
                        </View>}


                    {!this.state.phone_error ?
                        <View style={styles.errorView}>
                            <TextInput
                                value={this.state.number}
                                onChangeText={(number) => this.setState({ number })}
                                placeholder='Номер телефона'
                                maxLength={45}
                                keyboardType='numeric'
                                style={styles.input}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        :
                        <View style={styles.errorView}>
                            <Text style={{
                                color: 'red',
                                fontSize: 10,
                                marginBottom: 3,
                                alignSelf: 'flex-start',
                                paddingLeft: 3,
                            }}>{this.state.phone_error}</Text>
                            <TextInput
                                value={this.state.number}
                                onChangeText={(number) => this.setState({ number })}
                                placeholder='Номер телефона'
                                maxLength={45}
                                keyboardType='numeric'
                                style={styles.errorMessage}
                                underlineColorAndroid="transparent"
                            />

                        </View>}

                    {!this.state.password_error ?
                        <View style={styles.errorView}>
                            <TextInput
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })}
                                secureTextEntry={true}
                                maxLength={45}
                                style={styles.input}
                                underlineColorAndroid='transparent'
                                placeholder="Пароль"
                            />
                        </View>
                        :
                        <View style={styles.errorView}>
                            <Text style={{
                                color: 'red',
                                fontSize: 10,
                                marginBottom: 3,
                                alignSelf: 'flex-start',
                                paddingLeft: 3,
                            }}>{this.state.password_error}</Text>
                            <TextInput
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })}
                                secureTextEntry={true}
                                maxLength={45}
                                style={styles.errorMessage}
                                underlineColorAndroid='transparent'
                                placeholder="Пароль"
                            />
                        </View>}


                    {!this.state.password_confirmation_error ?
                        <View style={styles.errorView}>
                            <TextInput
                                value={this.state.password_confirmation}
                                onChangeText={(password_confirmation) => this.setState({ password_confirmation })}
                                secureTextEntry={true}
                                maxLength={45}
                                style={styles.input}
                                underlineColorAndroid='transparent'
                                placeholder="Повторить пароль"
                            />
                        </View>
                        :
                        <View style={styles.errorView}>
                            <Text style={{
                                color: 'red',
                                fontSize: 10,
                                marginBottom: 3,
                                alignSelf: 'flex-start',
                                paddingLeft: 3,
                            }}>{this.state.password_confirmation_error}</Text>
                            <TextInput
                                value={this.state.password_confirmation}
                                onChangeText={(password_confirmation) => this.setState({ password_confirmation })}
                                secureTextEntry={true}
                                maxLength={45}
                                style={styles.errorMessage}
                                underlineColorAndroid='transparent'
                                placeholder="Повторить пароль"
                            />
                        </View>
                    }


                    <View style={styles.privacy_policy_checkbox_input}>
                        <TouchableOpacity
                            style={[styles.inputRadio, this.state.privacy_policy_error &&  {borderWidth:1, borderColor: 'red'}]}
                            onPress={()=> {
                                this.setState({
                                    privacy_policy: !this.state.privacy_policy,
                                    privacy_policy_error:false
                                })
                            }}>
                            {this.state.privacy_policy &&
                                <View style={styles.activeRadioRound}>

                                    <Svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 83 65" fill="none">
                                        <Path d="M73.333.667L28 46 9.333 27.333 0 36.667l28 28L82.667 10 73.333.667z" fill="white"/>
                                    </Svg>

                                </View>
                            }
                        </TouchableOpacity>
                        <Text style={[styles.privacy_policy_text]}>
                            Согласен с <TouchableOpacity
                            onPress={() => {
                                Linking.openURL('https://bowy.ru/policy.pdf')
                            }}
                        ><Text style={[styles.privacy_policy_text_bold,{position:'relative', top:2}]}> правилами
                        </Text>
                        </TouchableOpacity>

                            {/*<View style={{paddingRight:5}}></View>*/}
                            <TouchableOpacity
                                style={{paddingTop:3}}
                                onPress={() => {
                                    Linking.openURL('https://bowy.ru/policy.pdf')
                                }}
                            ><Text style={[styles.privacy_policy_text_bold]}>и политикой конфиденциальности
                            </Text>
                            </TouchableOpacity>

                        </Text>


                    </View>

                    <LinearGradient colors={['#34BE7C', '#2EB6A5']} style={styles.linearGradient}>

                        <TouchableOpacity style={styles.loginButton}
                          onPress={() => {
                              if (!this.state.disableButton) {
                                  this.handleRegistration()
                              }
                          }}
                        >
                            <Text style={styles.loginButtonText}>Регистрация</Text>
                        </TouchableOpacity>

                    </LinearGradient>

                    <Text style={styles.dontHaveAccount}>
                        У вас уже есть аккаунт?
                    </Text>

                    <TouchableOpacity style={styles.goToRegister} onPress={() => this.goToLogin()}>
                        <Text style={styles.goToRegisterText}>Войти</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingTop: StatusBar.currentHeight + 15,
        paddingHorizontal: 30
    },
    inputText: {
        width: "80%",
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 38.4,
        marginBottom: 20,
        fontSize: 32,
        color: '#424A55'
    },
    contentContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    input: {
        width: "100%",
        height: 55,
        padding: 15,
        marginBottom: 30,
        borderRadius: 10,
        backgroundColor: '#f0f4f8',
    },
    errorView: {
        flex: 1,
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",

    },
    errorMessage: {
        width: "100%",
        height: 55,
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#f0f4f8',
        borderColor: 'red',
        borderWidth: 1
    },

    success: {
        color: "green",
        fontSize: 20,
        marginBottom: 25,
        lineHeight: 38.4,
        fontWeight: "bold",
        alignSelf: "center"
    },

    loginButton: {
        fontSize: 14,
        color: 'white',
        width: '100%',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',

    },
    loginButtonText: {
        color: 'white'
    },
    linearGradient: {
        borderRadius: 10,
        paddingVertical: 3,
        width: "100%",
        alignItems: "center",
        marginTop: 10
    },
    dontHaveAccount: {
        marginTop: 50,
        fontWeight: 'normal',
        fontSize: 14,
        color: '#8B94A3'
    },
    goToRegister: {}, goToRegisterText: {
        color: '#34BE7C',
        marginVertical: 12,
        fontWeight: 'bold',
        fontSize: 14,
    },
    socLinksWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 196
    },
    socLinkImg: {
        width: 32,
        height: 32
    },
    privacy_policy_text_bold: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#000000',
        // paddingLeft: 5,

    },
    privacy_policy_checkbox_input: {
        flexDirection: 'row',
        width:'100%',
        paddingHorizontal: '10%',
        marginBottom:15
    },
    inputRadio: {
        backgroundColor: "#E4E4E4",
        width: 28,
        height: 28,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    activeRadioRound:{
        width: 28,
        height: 28,
        backgroundColor: "#2EB6A5",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
    },

});

