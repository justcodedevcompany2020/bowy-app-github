import React, { Component } from 'react';
// import axios from "axios";

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    StatusBar,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';
import {ProfileStyles} from "../Profile/ProfileStyles";
import EditCarScreen from "../EditCar/EditCarScreen";
import Svg, {Path} from "react-native-svg";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailError: false,
            successMessage: false
        }
    }


    goToRegister = () => {
        this.props.navigation.navigate('Register')

        this.setState({
            resetPasswordCode: false,
            email: '',
            emailFlag: true
        })
    }

    goToLogin = () => {
        this.props.navigation.navigate('Login')

        this.setState({
            resetPasswordCode: false,
            email: '',
            emailFlag: true
        })
    }


    sendEmail = () => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!this.state.email.length) {
            this.setState({ emailError: 'Данное поле обязательно' })
        } else if (!reg.test(this.state.email)) {
            this.setState({ emailError: 'Не верный E-mail' })
        } else {
            fetch("https://bowy.ru/api/code-sending", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: this.state.email })
            })
                .then(res => res.json())
                .then((res) => {
                    console.log(res, "gago")
                    if (res.success) {
                        this.setState({
                            emailError: false,
                            successMessage: false,
                            email: ''
                        })

                        this.props.navigation.navigate('EditPassword')
                        // this.setState({ successMessage: false, email: '', })
                        // setTimeout(() => {
                        //
                        // }, 3000)

                    } else {
                        this.setState({ emailError: res.message })
                    }
                }).catch((e) => {
                    console.log("errror")
                })
        }
    }

    render() {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    paddingHorizontal: 15,
                    paddingTop:10
                }}>
                <TouchableOpacity
                    style={{backgroundColor:'white', width:'100%'}}
                    onPress={() => {
                        this.props.navigation.goBack()
                    }}
                >
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M21.75 12H6m0 0l6.3-7M6 12l6.3 7" stroke="#000" strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>
                </TouchableOpacity>
                <View style={{ marginTop: 30 }}>
                    <Text style={styles.text}>Восстановление пароля</Text>
                </View>

                {this.state.successMessage &&
                    <Text style={styles.successMessageStyle}>Код успешно отправлен.</Text>
                }
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.contentContainer, {backgroundColor:'white' }]}
                    style={{ flex: 1, width: "100%" }}>
                    {!this.state.emailError ?
                        <TextInput
                            value={this.state.email}
                            onChangeText={(email) => this.setState({ email })}
                            maxLength={45}
                            style={styles.input}
                            underlineColorAndroid="transparent"
                            placeholder='Введите электронную почту'
                        />
                        :
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <TextInput
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}
                                maxLength={45}
                                style={styles.errorInput}
                                underlineColorAndroid="transparent"
                                placeholder='Введите электронную почту'
                            />
                            <Text style={{
                                color: 'red',
                                fontSize: 10,
                                marginBottom: 10,
                                textAlign: "center"
                            }}>{this.state.emailError}</Text>
                        </View>
                    }
                    <View>

                        {this.state.resetPasswordCode === true ?
                            <TextInput
                                value={this.state.resetCode}
                                onChangeText={(resetCode) => this.setState({ resetCode })}
                                maxLength={5}
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder='Введите код'
                            /> : null}
                    </View>
                    <LinearGradient colors={['#34BE7C', '#2EB6A5']} style={styles.linerGradient}>
                        <TouchableOpacity style={styles.button} onPress={this.sendEmail}>
                            <Text style={{ color: 'white' }}>
                                Отправить Код
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>


                    {/*<View style={styles.bottomView}>*/}
                    {/*   */}

                    {/*    <LinearGradient colors={['#34BE7C', '#2EB6A5']} style={styles.linerGradient1}>*/}
                    {/*        <TouchableOpacity style={styles.button} onPress={() => this.goToLogin()}>*/}
                    {/*            <Text style={{ color: 'white' }}>*/}
                    {/*                Вход*/}
                    {/*            </Text>*/}
                    {/*        </TouchableOpacity>*/}
                    {/*    </LinearGradient>*/}

                    {/*    <LinearGradient colors={['#34BE7C', '#2EB6A5']} style={styles.linerGradient1}>*/}
                    {/*        <TouchableOpacity style={styles.button} onPress={() => this.goToRegister()}>*/}
                    {/*            <Text style={{ color: 'white' }}>*/}
                    {/*                Регистрация*/}
                    {/*            </Text>*/}
                    {/*        </TouchableOpacity>*/}
                    {/*    </LinearGradient>*/}
                    {/*</View>*/}
                </ScrollView>


            </SafeAreaView>


        );
    }
}
const styles = StyleSheet.create({
    input: {
        width: "80%",
        height: 45,
        padding: 13,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#f0f4f8',
        borderColor: "gray",
        borderWidth: 1
    },
    errorInput: {
        width: "80%",
        height: 45,
        padding: 13,
        marginBottom: 5,
        borderRadius: 10,
        backgroundColor: '#f0f4f8',
        borderColor: 'red',
        borderWidth: 1
    },
    successMessageStyle: {
        color: "green",
        fontSize: 15,
        textAlign: "center",
        marginBottom: 10
    },
    resetSide: {
        width: "100%",
        alignItems: "center"
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: 38.4,
        marginBottom: 40,
        fontSize: 32,
        color: '#424A55'
    },
    button: {
        fontSize: 14,
        color: 'white',
        width: "100%",
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',

    },
    linerGradient: {
        borderRadius: 10,
        marginBottom: 20,
        width: "80%",

    },
    linerGradient1: {
        borderRadius: 10,
        marginBottom: 20,
        width: "80%",
    },

    bottomView: {
        width: "100%",
        flexDirection: "column",
        marginTop: 100,
        justifyContent: "space-around",
        alignItems: "center"
    },
    contentContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
    },

})
