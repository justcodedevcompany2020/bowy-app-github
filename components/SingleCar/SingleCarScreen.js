import React, { Component } from 'react';
import {
    Text,
    Alert,
    Button,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    StatusBar,
    Platform,
    NativeModules,
    ScrollView,
    Linking,
    Modal, FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// import { SliderBox } from "react-native-image-slider-box";
import Svg, { Path, Rect,G, Defs, ClipPath } from 'react-native-svg';
import { singleCarStyles } from './singleCarStyles';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { log } from 'react-native-reanimated';
import BackSvg from '../includes/back_svg'
import CloseIconSvg from "../../assets/Svg/CloseIconSvg";
import ComplaintNoActiveRadioSvg from "../../assets/Svg/ComplaintNoActiveRadioSvg";
import ComplaintActiveRadioSvg from "../../assets/Svg/ComplaintActiveRadioSvg";

const { StatusBarManager } = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

import ImageSlider from 'react-native-image-slider';
import {feedsStyles} from "../Feeds/feedsStyles";

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
            width: 0,
            current_slide: 1,
            autoData: {},
            userData: {},
            userID: "",
            userAnnouncements: "",
            imageList: [],
            settingComponent: false,
            wishListId: [],
            pageLoaded: false,
            complaint_modal_is_open: false,
            complaint_list: [
                {id:1,name:'Товар продан', selected:true},
                {id:2,name:'Неверная цена', selected:false},
                {id:3,name:'Неверное описание/фото', selected:false},
                {id:4,name:'Не дозвониться', selected:false},
                {id:5,name:'Мошенник', selected:false},
            ],
        };
    }


    getInfo = async () => {
        try {

            console.log(this.props.auto_data, 'this.props.auto_data')

            await this.setState({ autoData: this.props.auto_data })
            let arr = []
            await this.props.auto_data.image.forEach((item) => {
                arr.push("https://bowy.ru/storage/uploads/" + item.image)
            })

            console.log(arr, 'arr')

            await this.setState({ imageList: arr })

            const ID = await AsyncStorage.getItem("loggedUserID")
            this.setState({ userID: ID })

            fetch(`https://bowy.ru/api/announcement-unlogged/${this.props.auto_data.user_id}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((res) => {
                    // console.log(res[0], 'res[0]res[0]res[0]res[0]')
                    this.setState({ userData: res[0] })
                    this.getFavouriteItems()

                })
                .catch((e) => {
                    console.log(e, 'getinfo')
                })

        } catch (e) {
            // console.log(e, 'getinfo')
        }

    }
    addToFavourites = async (userID, productID) => {
        try {
            let userToken = await AsyncStorage.getItem("userToken")
            let AuthStr = "Bearer " + userToken
            fetch("https://bowy.ru/api/favourites", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': AuthStr,
                },
                body: JSON.stringify({ user_id: userID, product_id: productID })
            })
                .then(res => res.json())
                .then((res) => {
                })
                .catch((e) => {
                    console.log(e, 'add to fav')
                })
        } catch (e) {
            console.log(e, 'add to favsws')
        }
    }
    removeFromFavourites = async (itemID) => {
        try {
            let userToken = await AsyncStorage.getItem("userToken")
            let AuthStr = "Bearer " + userToken
            fetch(`https://bowy.ru/api/favourites/${itemID}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': AuthStr,
                },
            })
                .then((res) => res.json())
                .catch((e) => {
                    console.log(e)
                })
        } catch (e) {
            console.log(e)
        }
    }
    getFavouriteItems = async () => {
        try {
            let userToken = await AsyncStorage.getItem("userToken")
            let AuthStr = "Bearer " + userToken
            fetch("https://bowy.ru/api/favourites", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': AuthStr,
                },

            })
                .then(res => res.json())
                .then(res => {
                    console.log(res["0"].map((item) => item.id), 'res["0"].map((item) => item.id)')
                    this.setState({
                        wishListId: res["0"].map((item) => item.id),
                        pageLoaded: true
                    });
                })
        } catch (e) {
            console.log(e)
        }
    }

    hideSettings = () => {
        this.setState((prev) => ({ settingComponent: !prev.settingComponent }))
    }

    componentDidMount() {

        this.setState({
            pageLoaded: false,
            settingComponent: false
        })
        this.getInfo()

        this.focusListener = this.props.navigation.addListener("focus", () => {

            this.setState({
                pageLoaded: false,
                settingComponent: false
            })
            this.getInfo()
        });


        this.focusListener = this.props.navigation.addListener("blur", () => {
            this.setState({
                width: 0,
                current_slide: 1,
                autoData: {},
                userData: {},
                userID: "",
                userAnnouncements: "",
                imageList: [],
                settingComponent: false,
                wishListId: [],
            })
        })
    }

    redirectToSingleMessage = () => {
        let product_id = this.state.autoData.id
        let name = this.state.userData?.name
        let image = this.state.userData?.image
        let price = this.state.autoData?.price + " ₽"
        let headline = this.state.autoData?.headline

        this.props.navigation.navigate('SingleMessage', {
            params: product_id,
            data: name,
            same: image,
            coins: price,
            header: headline,
            receiver_id: this.props.auto_data.user_id
        })
    }


    getUserID = async () => {
        try {
            const ID = await AsyncStorage.getItem("loggedUserID")
            this.setState({ userID: ID })
        } catch (e) {

        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate('Feeds');
    };

    onLayout = e => {
        this.setState({
            width: e.nativeEvent.layout.width
        });
    };

    disableProduct = async () => {
        Alert.alert("", "Вы уверены, что хотите снять обьявление?", [
            {
                text: "Да", onPress: async () => {
                    try {
                        let userToken = await AsyncStorage.getItem("userToken")
                        let AuthStr = "Bearer " + userToken

                        console.log("https://bowy.ru/api/products/" + this.state.autoData.id)
                        fetch("https://bowy.ru/api/products/" + this.state.autoData.id, {
                            method: "DELETE",
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': AuthStr,
                            },
                        })
                            .then(res => res.json())
                            .then((res) => {

                                console.log(res, 'eeeeee')
                                if (res.success) {
                                    this.setState({ settingComponent: false })
                                    this.props.navigation.navigate("Feeds")
                                }
                            })
                    } catch (e) {
                        console.log(e, 'sdsdsd')
                    }
                }
            },
            {
                text: "Нет", onPress: () => {
                    this.setState({ settingComponent: false })
                }
            }


        ])
    }

    deleteProduct = async () => {
        Alert.alert("", "Вы уверены, что хотите удалить обьявление?", [
            {
                text: "Да", onPress: async () => {
                    try {

                        let userToken = await AsyncStorage.getItem("userToken")
                        let AuthStr = "Bearer " + userToken
                        let product_id = this.state.autoData.id;

                        console.log(`https://bowy.ru/api/delete_product?product_id=${product_id}`)
                        fetch(`https://bowy.ru/api/delete_product`, {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': AuthStr,
                            },
                            body: JSON.stringify({
                                product_id: product_id ,
                            })
                        })
                            .then(res => res.json())
                            .then((res) => {

                                console.log(res, 'eeeeee');

                                if (res.status)
                                {
                                    this.setState({ settingComponent: false })
                                    // this.props.navigation.navigate("Feeds")
                                    this.props.navigation.goBack()
                                }

                            })
                    } catch (e) {
                        console.log(e, 'sdsdsd')
                    }
                }
            },
            {
                text: "Нет", onPress: () => {
                    this.setState({ settingComponent: false })
                }
            }


        ])
    }
    editProduct = () => {
        this.props.navigation.navigate("EditCar", {
            params: this.state.autoData,
            navigation: JSON.stringify(this.props.navigation)
        })
    }


    selectComplaint = (id) =>
    {
        let {complaint_list} = this.state;
        for (const complaint in complaint_list) {
            complaint_list[complaint].selected = complaint_list[complaint].id == id ? true : false
        }
        this.setState({
            complaint_list: complaint_list
        })
    }

    handleComplaint = async () =>
    {
        let {complaint_list} = this.state;
        let selected_complaint = {};

        for (const complaint in complaint_list) {
            if (complaint_list[complaint].selected)
            {
                selected_complaint = complaint_list[complaint]
            }
        }

        console.log(selected_complaint,'handleComplaint' )

        let product_id = this.props.auto_data.id;
        let title       = 'Жалоба'
        let description = selected_complaint.name;

        try {
            let userToken = await AsyncStorage.getItem("userToken")
            let AuthStr = "Bearer " + userToken
            fetch("https://bowy.ru/api/add_new_complaints", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': AuthStr,
                },
                body: JSON.stringify({
                    title: title,
                    product_id: product_id ,
                    description: description ,
                })
            })
                .then(res => res.json())
                .then((res) => {

                    console.log(res, 'result')

                    if (res.status)
                    {
                        this.setState({
                            complaint_modal_is_open: false,
                            complaint_success_modal_is_open: true
                        })
                    }


                })
                .catch((e) => {
                    console.log(e, 'add to fav')
                })
        } catch (e) {
            console.log(e, 'add to favsws')
        }



    }



    renderModal = () => {

        let {complaint_modal_is_open, complaint_success_modal_is_open} = this.state;

        if(complaint_modal_is_open) {
            return (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.complaint_modal_is_open}
                >

                    <View style={{width:'100%',height:'100%', justifyContent:'center', alignItems:'center', padding:20, backgroundColor:'rgba(0,0,0,0.61)'}}>
                        <View
                            style={{
                                width:'100%',
                                maxWidth:313,
                                height: '100%',
                                maxHeight: 474,
                                backgroundColor:'white',
                                borderRadius: 20,
                                padding:20,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection:'row',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                    marginBottom:30
                                }}
                            >
                                <Text style={{fontSize: 16, color: '#424A55'}}>Выберите причину жалобы</Text>
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({
                                            complaint_modal_is_open: false
                                        })
                                    }}
                                >
                                    <CloseIconSvg/>
                                </TouchableOpacity>

                            </View>


                            <FlatList
                                extraData={this.state}
                                data={this.state.complaint_list}
                                renderItem={({item, index}) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={[{width:'100%', height: 54, flexDirection:'row', alignItems:"center", backgroundColor:'rgba(171, 171, 171, 0.13)', marginBottom:10, padding:17, borderRadius:10}, item.selected && {backgroundColor: 'rgba(48, 184, 155, 0.13)'} ]}
                                            onPress={() => {
                                                this.selectComplaint(item.id)
                                            }}
                                        >
                                            {item.selected ?
                                                <ComplaintActiveRadioSvg/>
                                                :
                                                <ComplaintNoActiveRadioSvg/>
                                            }
                                            <Text style={{marginLeft:19, color:'#424A55', fontSize:16}}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }}
                                // contentContainerStyle={{paddingHorizontal:20 }}
                            />


                            <TouchableOpacity
                                style={{width:189, height:50, borderRadius:8, justifyContent: 'center', alignItems:'center', backgroundColor:'#34BE7C', alignSelf:'center'}}
                                onPress={()=>{
                                    this.handleComplaint();
                                }}
                            >
                                <Text style={{fontSize:16, color: 'white'}}>Отправить жалобу</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </Modal>
            )
        } else if(complaint_success_modal_is_open) {
            return (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.complaint_success_modal_is_open}
                >

                    <View style={{width:'100%',height:'100%', justifyContent:'center', alignItems:'center', padding:20, backgroundColor:'rgba(0,0,0,0.61)'}}>
                        <View
                            style={{
                                width:'100%',
                                maxWidth:313,
                                backgroundColor:'white',
                                borderRadius: 20,
                                padding:15,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection:'row',
                                    justifyContent:'flex-end',
                                    alignItems:'center',
                                    marginBottom:10
                                }}
                            >
                                <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({
                                            complaint_success_modal_is_open: false
                                        })
                                    }}
                                >
                                    <CloseIconSvg/>
                                </TouchableOpacity>

                            </View>


                            <Text style={{fontSize: 15, color: '#34BE7C', alignSelf:'center', marginBottom:5, position:'relative', top:-10 }}>
                                Ваша жалоба на рассмотрении.
                            </Text>


                        </View>
                    </View>

                </Modal>
            )
        }



    }



    render() {




        if (this.state.pageLoaded === false) {

            return (
                <View style={{   width: '100%', height: '100%', backgroundColor: '#1BDEEB'}}>

                    <Image style={{width: '100%', height: '100%'}} source={require('../../assets/img/start.png')}/>

                </View>
            )
        }

        return (
            <SafeAreaView style={{ width: '100%', flex: 1 }}>

                {this.renderModal()}

                {this.state.settingComponent &&

                    <TouchableOpacity style={{width: '100%',  height: '100%', backgroundColor:'transparent', position: 'absolute',top: STATUSBAR_HEIGHT , left: 0, zIndex:  99}} onPress={ () => {this.hideSettings()}}>
                        <TouchableHighlight style={[singleCarStyles.settingView, { top: STATUSBAR_HEIGHT + 20 }]}>
                            <View>

                                <TouchableOpacity style={{ width: '100%', paddingHorizontal:10 }} onPress={() => {this.deleteProduct()}}>
                                    <Text>Удалить объявление</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ paddingTop: 5, width: '100%',paddingHorizontal:10  }} onPress={() => {this.editProduct()}}>
                                    <Text>Изменить объявление</Text>
                                </TouchableOpacity>

                            </View>

                        </TouchableHighlight>
                    </TouchableOpacity>

                }

                <View style={{backgroundColor:'transparent', width: '100%', height: 60, }}>

                    <TouchableOpacity style={{width: 30, height: 20, zIndex: 55, position: 'absolute', left: 22, top: 18}}
                          onPress={() => {
                              // this.props.navigation.navigate('Feeds');
                              this.props.navigation.goBack()
                          }}
                    >
                        {/*<BackSvg/>*/}

                        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M21.75 12H6m0 0l6.3-7M6 12l6.3 7" stroke="#000" strokeLinecap="round" strokeLinejoin="round"/>
                        </Svg>
                    </TouchableOpacity>

                    {Number(this.state.userID) !== Number(this.state.userData?.id) &&

                        <TouchableOpacity
                            onPress={()=>{
                                this.setState({
                                    complaint_modal_is_open: true
                                })
                            }}
                            style={{width: 30, height: 19, zIndex: 55, position: 'absolute', right: 60, top: 18,}}
                        >
                            <Svg width={25} height={25} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <G clipPath="url(#clip0_1_2)">
                                    <Path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" fill="rgba(0,0,0,0.61)"/>
                                </G>
                                <Defs>
                                    <ClipPath id="clip0_1_2">
                                        <Path fill="black" d="M0 0H24V24H0z" />
                                    </ClipPath>
                                </Defs>
                            </Svg>
                        </TouchableOpacity>

                    }


                    {Number(this.state.userID) !== Number(this.state.userData?.id) ?

                        <TouchableOpacity
                            style={{width: 30, height: 19, zIndex: 55, position: 'absolute', right: 20, top: 18}}
                            onPress={() => {
                                if (this.state.wishListId.includes(this.state.autoData.id)) {
                                    this.setState(prev => ({ wishListId: prev.wishListId.filter(items => this.state.autoData.id !== items) }))
                                    this.removeFromFavourites(this.state.autoData.id)

                                } else {
                                    this.setState((prev) => ({ wishListId: [...prev.wishListId, this.state.autoData.id] }))
                                    this.addToFavourites(this.state.autoData.user_id, this.state.autoData.id)
                                }
                            }}>

                            {this.state.wishListId.includes(this.state.autoData?.id) ?

                                <Svg width={25} height={25} viewBox="0 0 28 28" fill="none" xmlns="https://www.w3.org/2000/svg">
                                    <Rect opacity={0.4} width={28} height={28} rx={8} fill="#000" />
                                    <Path fillRule="evenodd" clipRule="evenodd" d="M16.887 6.876c.473 0 .946.066 1.395.217 2.768.9 3.766 3.938 2.933 6.593a9.546 9.546 0 01-2.257 3.606 28.841 28.841 0 01-4.748 3.72l-.188.114-.195-.121a28.57 28.57 0 01-4.776-3.72 9.7 9.7 0 01-2.259-3.6c-.847-2.654.15-5.692 2.949-6.608a3.39 3.39 0 01.666-.156h.09c.211-.031.42-.045.63-.045h.083c.472.014.93.096 1.373.247h.044c.03.014.053.03.068.044.165.054.322.114.472.196l.285.128c.07.036.146.092.213.141.043.03.08.058.11.076l.037.022c.064.037.131.077.188.12a4.697 4.697 0 012.887-.974zm1.995 5.4a.617.617 0 00.593-.571v-.09a2.475 2.475 0 00-1.583-2.37.6.6 0 00-.757.376c-.105.315.06.66.375.771.48.18.802.654.802 1.178v.023a.644.644 0 00.143.465.628.628 0 00.427.218z" fill="#FF4141"/>
                                </Svg>

                                :

                                <Svg width={25} height={25} viewBox="0 0 28 28" fill="none" xmlns="https://www.w3.org/2000/svg">
                                    <Rect opacity={0.4} width={28} height={28} rx={8} fill="#000" />
                                    <Path fillRule="evenodd" clipRule="evenodd" d="M16.887 6.876c.473 0 .946.066 1.395.217 2.768.9 3.766 3.938 2.933 6.593a9.546 9.546 0 01-2.257 3.606 28.841 28.841 0 01-4.748 3.72l-.188.114-.195-.121a28.57 28.57 0 01-4.776-3.72 9.7 9.7 0 01-2.259-3.6c-.847-2.654.15-5.692 2.949-6.608a3.39 3.39 0 01.666-.156h.09c.211-.031.42-.045.63-.045h.083c.472.014.93.096 1.373.247h.044c.03.014.053.03.068.044.165.054.322.114.472.196l.285.128c.07.036.146.092.213.141.043.03.08.058.11.076l.037.022c.064.037.131.077.188.12a4.697 4.697 0 012.887-.974zm1.995 5.4a.617.617 0 00.593-.571v-.09a2.475 2.475 0 00-1.583-2.37.6.6 0 00-.757.376c-.105.315.06.66.375.771.48.18.802.654.802 1.178v.023a.644.644 0 00.143.465.628.628 0 00.427.218z" fill="#fff" opacity={0.7}/>
                                </Svg>



                            }

                        </TouchableOpacity>

                        :

                        <TouchableOpacity onPress={() => {this.hideSettings()}} style={{width: 30, height: 30, zIndex: 55, position: 'absolute', right: 20, top: 18}}>
                            {/*<Ionicons name="ios-settings-sharp" size={24} color="white" style={{ width: '100%', height: '100%' }} />*/}
                            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="https://www.w3.org/2000/svg">
                                <Path d="M9.954 2.21a9.99 9.99 0 014.091-.002A3.994 3.994 0 0016 5.07a3.993 3.993 0 003.457.261A9.99 9.99 0 0121.5 8.876 3.994 3.994 0 0020 12a3.99 3.99 0 001.502 3.124 10.041 10.041 0 01-2.046 3.543 3.993 3.993 0 00-4.76 1.468 3.993 3.993 0 00-.65 1.653 9.99 9.99 0 01-4.09.004A3.993 3.993 0 008 18.927a3.992 3.992 0 00-3.457-.26A9.99 9.99 0 012.5 15.121 3.993 3.993 0 004 12a3.993 3.993 0 00-1.502-3.124 10.043 10.043 0 012.046-3.543A3.993 3.993 0 008 5.072a3.993 3.993 0 001.954-2.86V2.21zM12 15a3 3 0 100-6 3 3 0 000 6z" fill="#B8BFC9"/>
                            </Svg>

                        </TouchableOpacity>
                    }





                </View>

                <View onLayout={this.onLayout} style={{ width: '100%', minHeight: 300, }}>

                    <ImageSlider
                        // loopBothSides
                        // autoPlayWithInterval={2000}
                        images={this.state.imageList}
                        customSlide={({ index, item, style, width }) => (
                            <View style={{width: width, height:300}} key={index}>
                                {this.state.imageList.length > 0 &&
                                      <Image style={{width: '100%', height:'100%', resizeMode:'contain'}} source={{uri:item}}/>
                                }
                            </View>

                        )}
                        onPositionChanged={(pos) => {
                            console.log(pos, 'pos')
                            this.setState({
                                current_slide: pos +1
                            })
                        }}

                        customButtons={(position, move) => (

                            <View style={{justifyContent: "center", alignItems: 'center', position: 'absolute', bottom: 25, width: '100%'}}>
                                <View style={{width: 44, height: 24, zIndex: 55, backgroundColor: '#0000008a', borderRadius: 8, justifyContent: "center", alignItems: 'center'}}>
                                    <Text style={{ color: 'white' }}>
                                        {/*{this.printPagination(position)}*/}
                                        {this.state.current_slide} - {this.state.imageList.length}

                                    </Text>
                                </View>

                            </View>
                        )}
                    />


                </View>



                <View style={singleCarStyles.whiteWrapper}>

                    <View style={{width: '100%', height: 30, backgroundColor:'white', borderTopLeftRadius: 20, borderTopRightRadius:20, position:'absolute', top: -20 }}>

                    </View>

                    <ScrollView style={{ padding:23,}}>
                        <Text style={singleCarStyles.autoTitle}>
                            {this.state.autoData?.headline}
                        </Text>

                        <Text style={singleCarStyles.autoPrice}>
                            {this.state.autoData?.price + " ₽"}
                        </Text>

                        <Text style={{fontSize: 14, color: '#8B94A3',marginBottom:20}}>{this.state.autoData.address}</Text>

                        <Text style={singleCarStyles.autoDescription}>
                            {this.state.autoData?.description}
                        </Text>





                        {/*{Number(this.state.userID) === Number(this.state.autoData.user_id) &&*/}
                        {/*    <Text style={singleCarStyles.autoDate}>*/}
                        {/*        <Text style={{fontSize: 15, fontWeight: '700', color: '#424A55',}}>*/}
                        {/*            {"Опубликован" + " - "}*/}
                        {/*        </Text>*/}
                        {/*        {this.state.autoData?.updated_at?.split("").slice(0, 10).join("")}*/}
                        {/*    </Text>*/}
                        {/*}*/}

                        <View style={[singleCarStyles.autoAddress, {width: '100%'}]}>
                            <View style={{flexDirection:'row', }}>
                                <Text style={{}}>Область: </Text>
                                <Text style={{fontSize: 15, fontWeight: '700', color: '#424A55',}}>{this.state.autoData.region_name}</Text>
                            </View>

                            <View style={{flexDirection:'row', }}>
                                <Text style={{}}>Город: </Text>
                                <Text style={{fontSize: 15, fontWeight: '700', color: '#424A55',}}>{this.state.autoData.city_name}</Text>
                            </View>
                            <View style={{flexDirection:'row', }}>
                                <Text style={{}}>Адрес: </Text>
                                <Text style={{fontSize: 15, fontWeight: '700', color: '#424A55',}}>{this.state.autoData.address}</Text>
                            </View>
                        </View>



                        {/*    /!* info items*!/*/}

                        {this.state.autoData?.car_model !== 'Не указан' &&<View style={singleCarStyles.infoWrapper}>

                            <View style={singleCarStyles.infoLabelWrapper}>
                                <Text style={singleCarStyles.infoLabel}>Марка автомобиля</Text>
                            </View>

                            <View>
                                <Text style={singleCarStyles.infoValue}>{this.state.autoData?.car_model} </Text>
                            </View>
                        </View>}

                        {this.state.autoData?.body_type !== 'Не указан' && <View style={singleCarStyles.infoWrapper}>

                            <View style={singleCarStyles.infoLabelWrapper}>
                                <Text style={singleCarStyles.infoLabel}>Тип кузова</Text>
                            </View>

                            <View>
                                <Text style={singleCarStyles.infoValue}>{this.state.autoData?.body_type} </Text>
                            </View>
                        </View>}

                        <View style={singleCarStyles.infoWrapper}>

                            <View style={singleCarStyles.infoLabelWrapper}>
                                <Text style={singleCarStyles.infoLabel}>Год выпуска</Text>
                            </View>

                            <View>
                                <Text
                                    style={singleCarStyles.infoValue}>{this.state.autoData?.year_of_issue} </Text>
                            </View>
                        </View>

                        {this.state.autoData?.transmission !== 'Не указан' && <View style={singleCarStyles.infoWrapper}>

                            <View style={singleCarStyles.infoLabelWrapper}>
                                <Text style={singleCarStyles.infoLabel}>Коробка передач</Text>
                            </View>

                            <View>
                                <Text style={singleCarStyles.infoValue}>{this.state.autoData?.transmission}</Text>
                            </View>
                        </View>}

                        {this.state.autoData?.rudder !== 'Не указан' &&<View style={singleCarStyles.infoWrapper}>

                            <View style={singleCarStyles.infoLabelWrapper}>
                                <Text style={singleCarStyles.infoLabel}>Руль</Text>
                            </View>

                            <View>
                                <Text style={singleCarStyles.infoValue}>{this.state.autoData?.rudder} </Text>
                            </View>

                        </View>}



                        <View style={singleCarStyles.userWrapper}>

                            <View style={singleCarStyles.userImageWrapper}>
                                <Image style={singleCarStyles.userImage}
                                    source={{ uri: `https://bowy.ru/storage/uploads/${this.state.userData?.image}` }}
                                />
                            </View>

                            <View>
                                <Text style={singleCarStyles.userName}>{this.state.userData?.name}</Text>
                                <Text
                                    style={singleCarStyles.postCount}>{this.state.userData?.products?.length} объявлений</Text>
                            </View>
                        </View>


                    </ScrollView>

                    <View style={singleCarStyles.actionButtonsWrapper}>

                        <LinearGradient colors={['#34BE7C', '#2EB6A5']} style={singleCarStyles.callButton}>
                            <TouchableOpacity style={singleCarStyles.callButtonToch} onPress={() => {
                                Linking.openURL('tel:' + this.state.userData.number);
                            }}>
                                <Text style={{ color: 'white' }}>
                                    Позвонить
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>


                        {Number(this.state.userID) !== Number(this.state.userData?.id) &&
                            <LinearGradient colors={['#63DAFF', '#33B5FF']} style={singleCarStyles.writeUser}>
                                <TouchableOpacity style={singleCarStyles.writeUserToch}
                                      onPress={() => { this.redirectToSingleMessage() }}
                                >
                                    <Text style={{ color: 'white' }}>
                                        Написать
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>

                        }




                    </View>

                </View>

            </SafeAreaView>

        )

    }
}


