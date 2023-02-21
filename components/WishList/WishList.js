import React, {Component, useState} from 'react';
import {
    View,
    Platform,
    TextInput,
    StyleSheet,
    StatusBar,
    Dimensions,
    ScrollView,
    Image,
    Text,
    TouchableOpacity,
    createStackNavigator,
    ActivityIndicator,
    Modal,
    TouchableHighlight,
    Alert,
    FlatList
} from 'react-native';

import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';

import Svg, {
    Circle,
    Ellipse,
    G,
    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use,
    Symbol,
    Defs,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
} from 'react-native-svg';
import {LinearGradient} from 'expo-linear-gradient';
import {wishListStyles} from './WishListStyles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {feedsStyles} from "../Feeds/feedsStyles";

import ActiveFeedsSvg from '../../assets/Svg/ActiveFeedsSvg'
import NoActiveFeedsSvg from '../../assets/Svg/NoActiveFeedsSvg'

import ActiveFavoritesSvg from '../../assets/Svg/ActiveFavoritesSvg'
import NoActiveFavoritesSvg from '../../assets/Svg/NoActiveFavoritesSvg'

import ActiveChatSvg from '../../assets/Svg/ActiveChatSvg'
import NoActiveChatSvg from '../../assets/Svg/NoActiveChatSvg'

import ActiveProfileSvg from '../../assets/Svg/ActiveProfileSvg'
import NoActiveProfileSvg from '../../assets/Svg/NoActiveProfileSvg'

import AddAutoSvg from '../../assets/Svg/AddAutoSvg'




export default class wishListScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            wishList: [],
            wishListId: [],
        };
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
                .then((res) => {
                    console.log(res, 'favorites')
                    this.setState({wishListId: res["0"].map((item) => item.id)});
                    this.setState({wishList: res["0"]})
                })
                .catch((e) => {
                    // console.log(e)
                })
        } catch (e) {
            // console.log(e)
        }
    }

    componentDidMount() {

        this.getFavouriteItems();

        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.getFavouriteItems();
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        if (this.focusListener) {
            this.focusListener();
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
                .then((res) => {
                    this.getFavouriteItems();

                })
                .catch((e) => {
                    console.log(e)
                })
        } catch (e) {
            console.log(e)
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
                body: JSON.stringify({user_id: userID, product_id: productID})
            })
                .then(res => res.json())
                .catch((e) => {
                    console.log(e)
                })
        } catch (e) {
            console.log(e)
        }
    }


    openSingleCar = (data) => {
        this.props.navigation.navigate('SingleCar', {
            params: data,
        })
    }

    render() {

        return (
            <SafeAreaView style={wishListStyles.wishListScreenMainView}>

                <View style={wishListStyles.wishTitleWrapper}>

                    <Text style={wishListStyles.wishTitle}>
                        Избранное
                    </Text>

                </View>


                <View style={wishListStyles.safeArea}>


                    {this.state.wishList.length > 0 ?

                        <FlatList
                            data={this.state.wishList}
                            renderItem={({item, index, separators}) => {
                                return (
                                    <View style={wishListStyles.wishCarItems}>
                                        <View style={wishListStyles.feedsCarImgWrapper}>

                                            {item.image.length > 0 &&

                                                 <Image style={wishListStyles.feedsCaritemsImg}
                                                   source={{uri: `https://bowy.ru/storage/uploads/${item?.image[0].image}`}}/>

                                            }

                                            <TouchableOpacity style={wishListStyles.addinwish}
                                                  onPress={() => {
                                                      if (this.state.wishListId.includes(item.id)) {
                                                          this.setState(prev => ({wishListId: prev.wishListId.filter(items => item.id !== items)}))
                                                          this.removeFromFavourites(item.id)

                                                      } else {
                                                          this.addToFavourites(item.user_id, item.id)
                                                          this.setState((prev) => ({wishListId: [...prev.wishListId, item.id]}))
                                                      }


                                                  }}
                                            >
                                                {this.state.wishListId.includes(item.id)
                                                    ?
                                                    <Svg
                                                        width={28}
                                                        height={28}
                                                        viewBox="0 0 28 28"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <Rect opacity={0.4} width={28} height={28} rx={8} fill="#000"/>
                                                        <Path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M16.887 6.876c.473 0 .946.066 1.395.217 2.768.9 3.766 3.938 2.933 6.593a9.546 9.546 0 01-2.257 3.606 28.841 28.841 0 01-4.748 3.72l-.188.114-.195-.121a28.57 28.57 0 01-4.776-3.72 9.7 9.7 0 01-2.259-3.6c-.847-2.654.15-5.692 2.949-6.608a3.39 3.39 0 01.666-.156h.09c.211-.031.42-.045.63-.045h.083c.472.014.93.096 1.373.247h.044c.03.014.053.03.068.044.165.054.322.114.472.196l.285.128c.07.036.146.092.213.141.043.03.08.058.11.076l.037.022c.064.037.131.077.188.12a4.697 4.697 0 012.887-.974zm1.995 5.4a.617.617 0 00.593-.571v-.09a2.475 2.475 0 00-1.583-2.37.6.6 0 00-.757.376c-.105.315.06.66.375.771.48.18.802.654.802 1.178v.023a.644.644 0 00.143.465.628.628 0 00.427.218z"
                                                            fill="#FF4141"
                                                        />
                                                    </Svg>
                                                    :
                                                    <Svg
                                                        width={28}
                                                        height={28}
                                                        viewBox="0 0 28 28"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <Rect opacity={0.4} width={28} height={28} rx={8} fill="#000"/>
                                                        <Path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M16.887 6.876c.473 0 .946.066 1.395.217 2.768.9 3.766 3.938 2.933 6.593a9.546 9.546 0 01-2.257 3.606 28.841 28.841 0 01-4.748 3.72l-.188.114-.195-.121a28.57 28.57 0 01-4.776-3.72 9.7 9.7 0 01-2.259-3.6c-.847-2.654.15-5.692 2.949-6.608a3.39 3.39 0 01.666-.156h.09c.211-.031.42-.045.63-.045h.083c.472.014.93.096 1.373.247h.044c.03.014.053.03.068.044.165.054.322.114.472.196l.285.128c.07.036.146.092.213.141.043.03.08.058.11.076l.037.022c.064.037.131.077.188.12a4.697 4.697 0 012.887-.974zm1.995 5.4a.617.617 0 00.593-.571v-.09a2.475 2.475 0 00-1.583-2.37.6.6 0 00-.757.376c-.105.315.06.66.375.771.48.18.802.654.802 1.178v.023a.644.644 0 00.143.465.628.628 0 00.427.218z"
                                                            fill="#fff"
                                                            opacity={0.7}
                                                        />
                                                    </Svg>

                                                }
                                            </TouchableOpacity>
                                        </View>
                                        <View style={wishListStyles.wishCarItemRight}>

                                            <TouchableOpacity onPress={() => this.openSingleCar(item)}
                                            >

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
                                                    }}>{"Цена" + " - "}</Text>{item.price+" ₽"} </Text>


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
                                                    }}>{"Адрес" + " - "}</Text>{item.address}</Text>

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
                                                        marginBottom: 10
                                                    }}>{"Опубликован" + " - "}</Text>
                                                    {item.updated_at.split("").slice(0, 10).join("")}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.id}
                        />

                        :

                        <Text>
                            Нет избранных обьявлений!
                        </Text>

                    }

                </View>
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
                        <ActiveFavoritesSvg/>
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
                        <NoActiveProfileSvg/>
                    </TouchableOpacity>

                </View>

            </SafeAreaView>
        )
    }
}



