import React, {Component, useState} from 'react';
import {
    View,
    StatusBar,
    TextInput,
    ScrollView,
    Image,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    FlatList,
    NativeModules,
    Platform, Alert, Modal, Animated
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {ProfileStyles} from './ProfileStyles';
import EditCarScreen from "../EditCar/EditCarScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AuthContext} from "../AuthContext/context";
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import Svg, {Path, Defs, LinearGradient as Gradient, Stop} from "react-native-svg"
import {Ionicons} from '@expo/vector-icons';

import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';
import {singleCarStyles} from "../SingleCar/singleCarStyles";
import NoActiveFeedsSvg from "../../assets/Svg/NoActiveFeedsSvg";
import NoActiveFavoritesSvg from "../../assets/Svg/NoActiveFavoritesSvg";
import AddAutoSvg from "../../assets/Svg/AddAutoSvg";
import ActiveChatSvg from "../../assets/Svg/ActiveChatSvg";
import NoActiveProfileSvg from "../../assets/Svg/NoActiveProfileSvg";
import NoActiveChatSvg from "../../assets/Svg/NoActiveChatSvg";
import ActiveProfileSvg from "../../assets/Svg/ActiveProfileSvg";

const {StatusBarManager} = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;


export default class ProfileComponent extends Component {
    constructor(props) {

        super(props);

        this.state = {
            userData: {},
            userData1: {},

            userActiveProducts: [],
            userNoActiveProducts: [],

            activeTab: true,
            noActiveTab: false,

            fioRename: false,
            numberRename: false,
            emailRename: false,
            locationRename: false,
            locationName:'',

            settingComponentVisibility: false,
            editButtonsVisibility: false,

            errorMessage: null,
            show_success_modal: false

        };
    }

    static contextType = AuthContext

    getUserData = async () => {
        try {
            let userID = await AsyncStorage.getItem("loggedUserID")
            let userToken = await AsyncStorage.getItem("userToken")
            let location = await AsyncStorage.getItem('location')
            console.log(location,'dfews');
            let AuthStr = "Bearer " + userToken
            fetch(`https://bowy.ru/api/announcement-unlogged/${userID}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
                .then(res => res.json())
                .then((res) => {


                    console.log(res[0].products, 'res[0].products')

                    this.setState({userData: res[0], userData1: res[0], locationName: res[0].city})

                    let userActiveProducts = [];
                    let userNoActiveProducts = [];

                    res[0].products.map((item) => {
                        console.log(typeof item.status, item.status)

                        if (item.status === 1) {
                            // this.setState({userActiveProducts: res[0].products});

                            userActiveProducts.push(item);

                        } else if (item.status === 0){
                            userNoActiveProducts.push(item);

                            // this.setState({userNoActiveProducts: res[0].products});
                        }
                    })

                    this.setState({
                        userActiveProducts: userActiveProducts,
                        userNoActiveProducts: userNoActiveProducts
                    });

                })
                .catch((e) => {
                    // console.log("then")
                })
        } catch (e) {
            // console.log("catch")
        }
    }


    hideSettings = () => {
        this.setState((prev) => ({settingComponentVisibility: !prev.settingComponentVisibility}))
    }

    openSingleCar = (data) => {
        this.props.navigation.navigate('SingleCar', {
            params: data,
        })
    }

    unhideEditButtons = () => {
        this.setState({editButtonsVisibility: true, settingComponentVisibility: false})
    }

    cancelEditing = () => {
        this.setState({
            userData: JSON.parse(JSON.stringify(this.state.userData1)),
            editButtonsVisibility: false,
            settingComponentVisibility: false,
            fioRename: false,
            numberRename: false,
            emailRename: false,
            locationRename: false,
            errorMessage: null
        })
    }

    editUserData = async () => {
        const {userData} = this.state
        try {

            let userToken = await AsyncStorage.getItem("userToken")
            let AuthStr = "Bearer " + userToken

            const form = new FormData();
            if (userData.image.assets[0].uri) {
                form.append('image', {
                    uri: userData.image?.uri,
                    type: 'image/jpg',
                    name: 'image.jpg',
                });
            }
            form.append("name", userData?.name)
            form.append("surname", userData?.surname)
            form.append("email", userData?.email)
            form.append("number", userData?.number)
            form.append("city", userData?.city)

            fetch("https://bowy.ru/api/users", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "multipart/form-data",
                    'Authorization': AuthStr,
                },
                body: form
            })
                .then(response => response.json())
                .then((res) => {

                    console.log(res, "userChange")

                    if (res.status) {

                        this.setState({
                            editButtonsVisibility: false,
                            settingComponentVisibility: false,
                            fioRename: false,
                            numberRename: false,
                            emailRename: false,
                            locationRename: false,
                            errorMessage: null,
                            show_success_modal: true
                            // userData: {...this.state.userData, name: res}
                        })


                    } else {

                        this.setState({errorMessage: res.message})

                        setTimeout(() => {
                            this.render()

                        }, 2000)
                    }
                })
                .catch((e) => {
                    console.log("Vzgo")
                })
        } catch (e) {
            console.log("eeeeeeeeeee")
        }
    }

    getUserProducts = (productList) => {

        return (

            <View style={ProfileStyles.scrollView}>



                {productList.map((item, index) => {
                    return (
                        <View key={index} style={ProfileStyles.profileCaritems}>

                            <View style={ProfileStyles.profileCarImgWrapper}>
                                <Image style={{width: "100%", height: 130}}
                                       source={{uri: `https://bowy.ru/storage/uploads/${item.image[0]?.image}`}}
                                />
                            </View>

                            <View style={ProfileStyles.profileCarItemRight}>
                                <TouchableOpacity onPress={() => this.openSingleCar(item)}>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontSize: 12,
                                            fontWeight: '400',
                                            color: '#424A55',
                                            marginBottom: 5,
                                            width: "100%",
                                        }}>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '700',
                                            color: '#424A55',

                                        }}>{"Заголовок" + " - "}</Text>{item.headline}</Text>


                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            width: "100%",
                                            fontSize: 12,
                                            fontWeight: '400',
                                            color: '#424A55',
                                            marginBottom: 5
                                        }}>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '700',
                                            color: '#424A55',
                                        }}>{"Цена" + " - "}</Text>{item.price + " ₽"} </Text>


                                    <Text numberOfLines={1} style={{width: "100%", fontSize: 12, fontWeight: '400', color: '#424A55', marginBottom: 5}}>
                                        <Text style={{fontSize: 14, fontWeight: '700', color: '#424A55',}}>
                                            Адрес -
                                        </Text>
                                        {item.address}
                                    </Text>

                                    <Text numberOfLines={1} style={{width: "100%", fontSize: 12, fontWeight: '400', color: '#424A55', marginBottom: 5}}>
                                        <Text style={{fontSize: 14, fontWeight: '700', color: '#424A55', marginBottom: 10}}>
                                            Опубликован -
                                        </Text>
                                        {item.updated_at.split("").slice(0, 10).join("")}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    )
                })}

                {/*<FlatList*/}
                {/*    extraData={this.state}*/}
                {/*    data={productList}*/}
                {/*    renderItem={({item}) => {*/}
                {/*       */}
                {/*    }}*/}
                {/*    keyExtractor={(item) => {*/}
                {/*        return item.id*/}
                {/*    }}*/}
                {/*/>*/}

            </View>
        )
    }

    exitFromProfile = async () => {
        await this.setState({
            isOpenLogoutModal:false,
        })
        await this.context.signOut(() => {})

        // try {
        //     await AsyncStorage.clear()
        //     this.props.navigation.navigate("Login")
        //     this.setState({settingComponentVisibility: false})
        // } catch (e) {
        //     console.log(e)
        // }
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('Feeds');
    }

    openImagePickerAsync = async () => {

        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }


        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.canceled === true) {
            return;
        }

        console.log(pickerResult.assets[0], 'pickerResult')

        pickerResult.key = pickerResult.assets[0].uri
        let res = pickerResult.assets[0].uri.split('.');
        let type = res[res.length - 1];


        if (type !== 'jpg' && type !== 'png' && type !== 'jpeg') {
            Alert.alert("формат картинки должен быть JPEG, PNG или JPG")
            return
        }


        let {userData} = this.state;
        userData.image = pickerResult;
        this.setState({
            userData
        })
    };

    openTab = (activeTab, noActiveTab) => {

        this.setState({
            activeTab: activeTab,
            noActiveTab: noActiveTab
        });

    };


    componentDidMount() {
        this.getUserData()
        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.getUserData()
        });
        this.focusListener = this.props.navigation.addListener("blur", () => {
            this.setState({
                userData: {},
                userData1: {},
                userActiveProducts: [],
                userNoActiveProducts: [],
                activeTab: true,
                noActiveTab: false,
                fioRename: false,
                numberRename: false,
                emailRename: false,
                locationRename: false,
                settingComponentVisibility: false,
                editButtonsVisibility: false,
                errorMessage: null
            })

        })
    }


    render() {
        const {userData} = this.state

        //
        // if (this.state.show_success_modal) {
        //     return (
        //
        //         <Modal transparent visible={this.props.show_success_modal}>
        //             <View style={{width: '100%', height: '100%', backgroundColor:'red'}}>
        //                <Text>Изменения успешно сохранены!</Text>
        //             </View>
        //         </Modal>
        //     )
        // }


        return (
            <SafeAreaView style={ProfileStyles.profileScreenMainView}>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.show_success_modal}
                >

                    <TouchableOpacity
                        style={{width: '100%', height: '100%', justifyContent:'center', alignItems:'center', backgroundColor:'#0000006e' }}
                        onPress={() => {this.setState({show_success_modal:false})}}
                    >

                        <TouchableHighlight style={{width: '90%', height: 150, backgroundColor:'white',justifyContent:'center', alignItems:'center', borderRadius:6 }}>
                            <Text>Изменения успешно сохранены!</Text>
                        </TouchableHighlight>

                    </TouchableOpacity>

                </Modal>

                <View style={ProfileStyles.profileTitleWrapper}>

                    <TouchableOpacity style={ProfileStyles.wishTitle} onPress={() => {
                        this.handleBackButtonClick(EditCarScreen);
                    }}>
                        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M21.75 12H6m0 0l6.3-7M6 12l6.3 7" stroke="#000" strokeLinecap="round" strokeLinejoin="round"/>
                        </Svg>
                    </TouchableOpacity>

                    <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
                        {/*<TouchableOpacity>*/}

                        {/*    <Svg style={ProfileStyles.profileNot} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*        <Path d="M18 15h2v2H0v-2h2V8a8 8 0 1116 0v7zM7 19h6v2H7v-2z" fill="#B8BFC9"/>*/}
                        {/*    </Svg>*/}

                        {/*</TouchableOpacity>*/}


                        <TouchableOpacity style={{marginLeft: 44, zIndex: 100}} onPress={this.hideSettings}>
                            <Svg style={ProfileStyles.profileSetting} viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M7.954 1.21a9.99 9.99 0 014.091-.002A3.994 3.994 0 0014 4.07a3.993 3.993 0 003.457.261A9.99 9.99 0 0119.5 7.876 3.993 3.993 0 0018 11a3.99 3.99 0 001.502 3.124 10.041 10.041 0 01-2.046 3.543 3.993 3.993 0 00-4.76 1.468 3.993 3.993 0 00-.65 1.653 9.99 9.99 0 01-4.09.004A3.993 3.993 0 006 17.927a3.992 3.992 0 00-3.457-.26A9.99 9.99 0 01.5 14.121 3.993 3.993 0 002 11 3.993 3.993 0 00.498 7.875a10.043 10.043 0 012.046-3.543A3.993 3.993 0 006 4.072a3.993 3.993 0 001.954-2.86V1.21zM10 14a3 3 0 100-6 3 3 0 000 6z" fill="#B8BFC9"/>
                            </Svg>
                        </TouchableOpacity>
                    </View>


                </View>


                <ScrollView style={{width: '100%', flex:1, paddingHorizontal: 20}}>

                    <View style={ProfileStyles.profileUserInfo}>

                        <View style={ProfileStyles.profilePhotoWrapper}>
                            <Image style={{width: 80, height: 80, borderRadius: 50}}
                                   source={{uri: userData?.image?.uri ? userData?.image.uri : "https://bowy.ru/storage/uploads/" + userData?.image}}/>
                            {this.state.editButtonsVisibility &&
                            <TouchableOpacity style={ProfileStyles.addPhotoIcon} onPress={this.openImagePickerAsync}>
                                <MaterialIcons name="add-a-photo"
                                               size={20}
                                               color="#818B9B"/>
                            </TouchableOpacity>}

                        </View>

                        <View style={ProfileStyles.profileUserInfoTwoWrapper}>
                            {/*userName*/}
                            {this.state.fioRename === false
                                ?
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={ProfileStyles.userName}>{userData?.name}
                                        {this.state.editButtonsVisibility &&
                                        <TouchableOpacity onPress={() => this.setState({fioRename: true})}>
                                            <Svg
                                                style={{marginLeft: 15}}
                                                width={16}
                                                height={16}
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"

                                            >
                                                <Path
                                                    d="M5.702 13.833H15.5V15.5H.5v-3.536l8.25-8.25 3.535 3.537-6.583 6.582zM9.928 2.537L11.696.768a.833.833 0 011.178 0l2.358 2.358a.833.833 0 010 1.178l-1.769 1.768-3.535-3.535z"
                                                    fill="#676B72"
                                                />
                                            </Svg>
                                        </TouchableOpacity>}
                                    </Text>
                                </View>
                                :
                                <View style={{flexDirection: 'row'}}>
                                    <TextInput
                                        value={userData.name}
                                        style={ProfileStyles.refactorInput}
                                        onChangeText={(name) => {
                                            this.setState((prevState) => ({
                                                userData: {...prevState.userData, name: name}
                                            }));
                                        }}
                                        onSubmitEditing={() => {
                                            this.setState({fioRename: false})
                                        }}
                                    />
                                </View>


                            }

                            <View style={ProfileStyles.profileUserInfoTwo}>
                                <Text style={ProfileStyles.profileNumberLabel}>Номер профиля</Text>
                                <Text style={ProfileStyles.profileNumber}>№ {userData.id ? userData.id : ""}</Text>
                            </View>


                        </View>

                    </View>


                    <View style={ProfileStyles.profileInfo}>

                        {/*Number*/}

                        {/*{this.state.numberRename === false ?*/}
                        {/*    <View style={ProfileStyles.userInfoItem}>*/}


                        {/*        /!*<View>*!/*/}
                        {/*        /!*    <View style={{flexDirection: 'row', width: '90%', alignItems: "center"}}>*!/*/}

                        {/*        /!*        <Svg style={ProfileStyles.profileCall} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">*!/*/}
                        {/*        /!*            <Path d="M15.5 11.683v2.947a.833.833 0 01-.775.832c-.364.025-.662.038-.892.038C6.47 15.5.5 9.53.5 2.167c0-.23.012-.528.038-.892A.833.833 0 011.37.5h2.947a.417.417 0 01.415.375c.019.192.036.344.053.46.166 1.156.505 2.28 1.007 3.334a.38.38 0 01-.123.473L3.871 6.427a10.872 10.872 0 005.703 5.703l1.284-1.795a.385.385 0 01.477-.124c1.054.5 2.178.84 3.333 1.004.116.017.269.035.459.053a.417.417 0 01.374.415H15.5z" fill="#818B9B"/>*!/*/}
                        {/*        /!*        </Svg>*!/*/}

                        {/*        /!*        <Text style={{fontSize: 14, fontWeight: '700', color: '#424A55', marginBottom: 10}}>Номер телефона</Text>*!/*/}

                        {/*        /!*    </View>*!/*/}

                        {/*        /!*    <Text style={{color: '#424A55', fontSize: 14, paddingLeft: 24}}>*!/*/}
                        {/*        /!*        {userData.number}*!/*/}
                        {/*        /!*    </Text>*!/*/}

                        {/*        /!*</View>*!/*/}


                        {/*        <View style={{alignItems: 'flex-end',  flex:1}}>*/}
                        {/*            <TouchableOpacity onPress={() => this.setState({numberRename: true})}>*/}

                        {/*                {this.state.editButtonsVisibility &&*/}
                        {/*                    <Svg style={{marginLeft: 15}} width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*                        <Path d="M5.702 13.833H15.5V15.5H.5v-3.536l8.25-8.25 3.535 3.537-6.583 6.582zM9.928 2.537L11.696.768a.833.833 0 011.178 0l2.358 2.358a.833.833 0 010 1.178l-1.769 1.768-3.535-3.535z" fill="#676B72"/>*/}
                        {/*                    </Svg>*/}
                        {/*                }*/}
                        {/*            </TouchableOpacity>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}


                        {/*    :*/}


                        {/*    <View style={ProfileStyles.userInfoItem}>*/}
                        {/*        <View style={{width: '90%', flexDirection: 'row', alignItems: "flex-end"}}>*/}
                        {/*            <Svg style={ProfileStyles.profileCall} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*                <Path d="M15.5 11.683v2.947a.833.833 0 01-.775.832c-.364.025-.662.038-.892.038C6.47 15.5.5 9.53.5 2.167c0-.23.012-.528.038-.892A.833.833 0 011.37.5h2.947a.417.417 0 01.415.375c.019.192.036.344.053.46.166 1.156.505 2.28 1.007 3.334a.38.38 0 01-.123.473L3.871 6.427a10.872 10.872 0 005.703 5.703l1.284-1.795a.385.385 0 01.477-.124c1.054.5 2.178.84 3.333 1.004.116.017.269.035.459.053a.417.417 0 01.374.415H15.5z" fill="#818B9B"/>*/}
                        {/*            </Svg>*/}
                        {/*            <TextInput*/}
                        {/*                value={userData.number}*/}
                        {/*                style={ProfileStyles.refactorInput}*/}
                        {/*                keyboardType="phone-pad"*/}
                        {/*                onChangeText={(userPhoneNumber) => {*/}
                        {/*                    this.setState((prevState) => ({*/}
                        {/*                        userData: {...prevState.userData, number: userPhoneNumber}*/}
                        {/*                    }));*/}
                        {/*                }}*/}
                        {/*                onSubmitEditing={() => {*/}
                        {/*                    this.setState({numberRename: false})*/}
                        {/*                }}*/}
                        {/*            />*/}
                        {/*        </View>*/}

                        {/*    </View>*/}

                        {/*}*/}

                        {/*Email*/}


                        {this.state.emailRename === false ?

                            <View style={ProfileStyles.userInfoItem}>

                                <View>

                                    <View style={{flexDirection: 'row', alignItems: "center", width: '90%'}}>

                                        <Svg style={ProfileStyles.profileMail} viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M1.5.5h15a.833.833 0 01.833.833v13.334a.833.833 0 01-.833.833h-15a.833.833 0 01-.833-.833V1.333A.833.833 0 011.5.5zm7.55 7.236L3.707 3.198l-1.08 1.27 6.434 5.463 6.317-5.467-1.09-1.26-5.237 4.532z" fill="#818B9B"/>
                                        </Svg>

                                        <Text style={{fontSize: 14, fontWeight: '700', color: '#424A55', marginBottom: 10}}>Эл.почта</Text>

                                    </View>

                                    <Text style={{color: '#424A55', fontSize: 14,paddingLeft: 24}}>

                                        {userData.email}
                                    </Text>
                                </View>


                                <View style={{alignItems: 'flex-end',  flex:1}}>

                                    {this.state.editButtonsVisibility &&

                                    <TouchableOpacity onPress={() => this.setState({emailRename: true})}>
                                        <Svg style={{marginLeft: 15}} width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M5.702 13.833H15.5V15.5H.5v-3.536l8.25-8.25 3.535 3.537-6.583 6.582zM9.928 2.537L11.696.768a.833.833 0 011.178 0l2.358 2.358a.833.833 0 010 1.178l-1.769 1.768-3.535-3.535z" fill="#676B72"/>
                                        </Svg>
                                    </TouchableOpacity>

                                    }

                                </View>

                            </View>

                            :
                            <View style={ProfileStyles.userInfoItem}>
                                <View style={{width: '90%', flexDirection: 'row', alignItems: "flex-end"}}>
                                    <Svg style={ProfileStyles.profileMail} viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Path d="M1.5.5h15a.833.833 0 01.833.833v13.334a.833.833 0 01-.833.833h-15a.833.833 0 01-.833-.833V1.333A.833.833 0 011.5.5zm7.55 7.236L3.707 3.198l-1.08 1.27 6.434 5.463 6.317-5.467-1.09-1.26-5.237 4.532z" fill="#818B9B"/>
                                    </Svg>
                                    <TextInput
                                        value={userData.email}
                                        keyboardType={"email-address"}
                                        style={ProfileStyles.refactorInput}
                                        onChangeText={(userEmail) => {
                                            this.setState((prevState) => ({
                                                userData: {...prevState.userData, email: userEmail}
                                            }));
                                        }}
                                        onSubmitEditing={() => {
                                            this.setState({emailRename: false})
                                        }}
                                    />
                                </View>
                            </View>}

                        {/*userLocation*/}

                        {/*{this.state.locationRename === false ?*/}
                        {/*    <View style={ProfileStyles.userInfoItem}>*/}

                        {/*        <View>*/}

                        {/*            <View style={{flexDirection: 'row', width: '90%'}}>*/}

                        {/*                <Svg style={ProfileStyles.profileLocation} viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*                    <Path d="M13.303 13.47L8 18.773 2.697 13.47a7.5 7.5 0 1110.606 0zM8 11.5a3.333 3.333 0 100-6.667A3.333 3.333 0 008 11.5zm0-1.667A1.667 1.667 0 118 6.5a1.667 1.667 0 010 3.333z" fill="#818B9B"/>*/}
                        {/*                </Svg>*/}

                        {/*                <Text style={{fontSize: 14, fontWeight: '700', color: '#424A55', marginBottom: 10}}>Местоположение</Text>*/}

                        {/*            </View>*/}

                        {/*            <Text style={{color: '#424A55', fontSize: 14, paddingLeft: 24}}>*/}

                        {/*                {this.state.locationName}*/}

                        {/*            </Text>*/}
                        {/*        </View>*/}




                        {/*        <View style={{alignItems: 'flex-end',  flex:1}}>*/}

                        {/*            {this.state.editButtonsVisibility &&*/}

                        {/*                <TouchableOpacity onPress={() => this.setState({locationRename: true})}>*/}
                        {/*                    <Svg style={{marginLeft: 15}} width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*                        <Path d="M5.702 13.833H15.5V15.5H.5v-3.536l8.25-8.25 3.535 3.537-6.583 6.582zM9.928 2.537L11.696.768a.833.833 0 011.178 0l2.358 2.358a.833.833 0 010 1.178l-1.769 1.768-3.535-3.535z" fill="#676B72"/>*/}
                        {/*                    </Svg>*/}
                        {/*                </TouchableOpacity>*/}

                        {/*            }*/}

                        {/*        </View>*/}


                        {/*    </View>*/}

                        {/*    :*/}

                        {/*    <View style={ProfileStyles.userInfoItem}>*/}

                        {/*        <View style={{width: '90%', flexDirection: 'row', alignItems: "flex-end"}}>*/}

                        {/*            <Svg style={ProfileStyles.profileLocation} viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                        {/*                <Path d="M13.303 13.47L8 18.773 2.697 13.47a7.5 7.5 0 1110.606 0zM8 11.5a3.333 3.333 0 100-6.667A3.333 3.333 0 008 11.5zm0-1.667A1.667 1.667 0 118 6.5a1.667 1.667 0 010 3.333z" fill="#818B9B"/>*/}
                        {/*            </Svg>*/}

                        {/*            <TextInput*/}
                        {/*                value={userData?.city}*/}
                        {/*                style={ProfileStyles.refactorInput}*/}
                        {/*                onChangeText={(userCity) => {*/}
                        {/*                    this.setState((prevState) => ({*/}
                        {/*                        userData: {...prevState.userData, city: userCity}*/}
                        {/*                    }));*/}

                        {/*                }}*/}
                        {/*                onSubmitEditing={() => {*/}
                        {/*                    this.setState({locationRename: false})*/}
                        {/*                }}*/}
                        {/*            />*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*}*/}


                        {this.state.errorMessage &&
                        <Text style={ProfileStyles.errorMessage}>
                            {this.state.errorMessage}
                        </Text>
                        }


                    </View>


                    {this.state.editButtonsVisibility && <View style={ProfileStyles.editProfileButtons}>
                        <LinearGradient colors={['#34BE7C', '#2EB6A5']} style={ProfileStyles.editButton}>

                            <TouchableOpacity onPress={this.editUserData}>
                                <Text style={{textAlign: 'center', color: 'white'}}>
                                    Сохранить изменения
                                </Text>
                            </TouchableOpacity>

                        </LinearGradient>

                        <LinearGradient colors={['#34BE7C', '#2EB6A5']} style={ProfileStyles.editButton}>
                            <TouchableOpacity onPress={this.cancelEditing}>
                                <Text style={{textAlign: 'center', color: 'white'}}>
                                    Отмена
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>

                    </View>}


                    <View style={{flex: 1, marginTop: 15}}>
                        <View style={ProfileStyles.tabsWrapper}>

                            <TouchableOpacity style={ProfileStyles.tabWrapper} onPress={() => {
                                this.openTab(true, false);
                            }}>
                                <Text style={ProfileStyles.tabLabel}>Активные</Text>
                                <View style={this.state.activeTab === true ? ProfileStyles.tabLine : {}}></View>
                            </TouchableOpacity>

                            <TouchableOpacity style={ProfileStyles.tabWrapper} onPress={() => {
                                this.openTab(false, true);
                            }}>
                                <Text style={ProfileStyles.tabLabel}>Неактивные</Text>
                                <View style={this.state.noActiveTab === true ? ProfileStyles.tabLine : {}}></View>
                            </TouchableOpacity>

                        </View>

                        <View style={{flex: 1}}>
                            {this.state.activeTab === true ? this.getUserProducts(this.state.userActiveProducts) : this.getUserProducts(this.state.userNoActiveProducts)}
                        </View>
                    </View>

                </ScrollView>


                {this.state.settingComponentVisibility &&

                    <TouchableOpacity style={{width: '100%',  height: '100%', backgroundColor:'transparent', position: 'absolute',top: STATUSBAR_HEIGHT , left: 0, zIndex:  99}} onPress={ () => {this.hideSettings()}}>
                        <TouchableHighlight style={[ProfileStyles.settingView, { top: STATUSBAR_HEIGHT + 20 }]}>

                        <View >
                            <TouchableOpacity style={{paddingTop: 5, zIndex: 10,width: '100%', paddingHorizontal: 10}} onPress={this.unhideEditButtons}>
                                <Text style={{color: "black", fontSize: 15, width: '100%',textAlign:'left'}}>Изменить данные</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{paddingTop: 5, zIndex: 10,width: '100%', paddingHorizontal: 10}}
                                onPress={this.exitFromProfile}
                            >
                                <Text style={{color: "black", fontSize: 15, width: '100%',textAlign:'left'}}>Выйти</Text>
                            </TouchableOpacity>
                        </View>
                        </TouchableHighlight>
                    </TouchableOpacity>
                }


                <View
                    style={{
                        width: '100%',
                        height: 66,
                        backgroundColor:'white',
                        borderTopColor:'rgba(156,154,154,0.13)',
                        borderTopWidth:1,
                        flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        paddingHorizontal:16
                    }}
                >

                    <TouchableOpacity onPress={() => {this.props.navigation.navigate('Feeds')}} style={{width: '20%', alignItems:'center'}}>
                        <NoActiveFeedsSvg/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.props.navigation.navigate('WishList')}} style={{width: '20%', alignItems:'center'}}>
                        <NoActiveFavoritesSvg/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.props.navigation.navigate('AddCarComponent')}} style={{position:'absolute', top: -50}}>
                        <AddAutoSvg/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{width: '20%', alignItems:'center'}}>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.props.navigation.navigate('Chat')}} style={{width: '20%', alignItems:'center'}}>
                        <NoActiveChatSvg/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.props.navigation.navigate('Profile')}} style={{width: '20%', alignItems:'center'}}>
                        <ActiveProfileSvg/>
                    </TouchableOpacity>

                </View>


            </SafeAreaView>
        )
    }
}



