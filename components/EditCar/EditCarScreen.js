import React, {Component} from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View, Alert, Modal, FlatList} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import {EvilIcons} from '@expo/vector-icons';

import Svg, { Path } from "react-native-svg"

import * as ImagePicker from 'expo-image-picker';
import {LinearGradient} from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {feedsStyles} from "../Feeds/feedsStyles";
import {editCarStyles} from "./EditCarStyles";
import SelectDropdown from 'react-native-select-dropdown'

import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';

export default class EditCar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carCategoryOpen: false,
            carCategoryValue: null,
            carCategoryItems: [],

            regionCategoryOpen: false,
            regionCategoryValue: null,
            regionCategoryItems: [],

            cityListOpen: false,
            cityListValue: null,
            cityListItems: [],

            carAgeOpen: false,
            carAgeValue: null,
            carAgeItems: [],


            bodyTypeOpen: false,
            bodyTypeValue: null,
            bodyTypeItems: [
                {label: "Седан", value: "Седан"},
                {label: "Универсал", value: "Универсал"},
                {label: "Хэтчбэк", value: "Хэтчбэк"},
                {label: "Купе", value: "Купе"},
                {label: "Лимузин", value: "Лимузин"},
                {label: "Микроавтобус", value: "Микроавтобус"},
                {label: "Минивэн", value: "Минивэн"},
                {label: "Хардтоп", value: "Хардтоп"},
                {label: "Таун", value: "Таун"},
                {label: "Лифтбэк", value: "Лифтбэк"},
                {label: "Фастбэк", value: "Фастбэк"},
                {label: "Кабриолет", value: "Кабриолет"},
                {label: "Родстер", value: "Родстер"},
                {label: "Ландо", value: "Ландо"},
                {label: "Брогам", value: "Брогам"},
                {label: "Тарга", value: "Тарга"},
                {label: "Спайдер", value: "Спайдер"},
                {label: "Шутингбрейк", value: "Шутингбрейк"},
                {label: "Пикап", value: "Пикап"},
                {label: "Фургон", value: "Фургон"}
            ],

            gearBoxOpen: false,
            gearBoxValue: null,
            gearBoxItem: [
                {label: "Механическая коробка передач", value: "Механическая"},
                {label: "Автоматическая коробка передач", value: "Автоматическая"},
            ],

            carModelOpen: false,
            carModelValue: null,
            carModelItems: [],

            rudderOpen: false,
            rudderValue: null,
            rudderItems: [
                {label: "левый", value: "левый"},
                {label: "правый", value: "правый"},
            ],


            selectedOldImages: [],
            selectedNewImages: [],
            selectedImages: [],
            imageIdList: [],
            imageError: null,


            title: "",
            price: null,
            address: "",
            description: "",
            pageLoaded: false,



            title_error: false,
            price_error: false,
            address_error: false,
            description_error: false,
        }
    }


    handleBack = () => {
        this.props.navigation.navigate("SingleCar", {
            params:this.props.auto_data,
            navigation: JSON.stringify(this.props.navigation)
        })
    };

    renderOldPicketPhoto = () => {
        let {selectedOldImages} = this.state;
        if (selectedOldImages.length) {
            return (
                <View style={{width: "100%"}}>

                    <Text style={{marginBottom: 10}}>Старые фото</Text>
                    <FlatList
                        horizontal
                        data={selectedOldImages}
                        extraData={this.state}
                        renderItem={({item}) => {
                            return <View style={{width: 100, height: 100, marginRight: 20}} key={item.key}>
                                <TouchableOpacity style={editCarStyles.removeCarStyle} onPress={() => {
                                    this.handleRemoveOldImage(item)
                                }}>
                                    <Image
                                        style={{justifyContent: 'center'}}
                                        source={require('../../assets/img/trashicon.png')}/>
                                </TouchableOpacity>
                                <Image style={{width: 100, height: 100, borderWidth: 3, borderRadius: 10,}}
                                       source={{uri: item.uri ? item.uri : `https://bowy.ru/storage/uploads/${item?.image}`}}/>

                            </View>
                        }}
                        keyExtractor={item => item.id}
                    />

                </View>
            );
        }
    };

    renderNewPicketPhoto = () => {
        let {selectedNewImages} = this.state;
        if (selectedNewImages.length) {
            return (
                <View style={{width: "100%"}}>

                    <Text style={{marginBottom: 10}}>Новые фото</Text>

                    <FlatList
                        horizontal
                        data={selectedNewImages}
                        extraData={this.state}
                        renderItem={({item}) => {
                            return <View style={{width: 100, height: 100, marginRight: 20}} key={item.key}>
                                <TouchableOpacity style={editCarStyles.removeCarStyle} onPress={() => {
                                    this.handleRemoveNewImage(item)
                                }}>
                                    <Image
                                        style={{justifyContent: 'center'}}
                                        source={require('../../assets/img/trashicon.png')}/>
                                </TouchableOpacity>
                                <Image style={{width: 100, height: 100, borderWidth: 3, borderRadius: 10,}}
                                       source={{uri: item.uri ? item.uri : `https://bowy.ru/storage/uploads/${item?.image}`}}/>

                            </View>
                        }}
                        keyExtractor={item => item.id}
                    />

                </View>
            );
        }
    };


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


        pickerResult.id = pickerResult.uri
        let res = pickerResult.assets[0].uri.split('.');
        let type = res[res.length - 1];


        if (type !== 'jpg' && type !== 'png' && type !== 'jpeg') {
            Alert.alert("формат картинки должен быть JPEG, PNG или JPG")
            return
        }


        let {selectedNewImages} = this.state;

        selectedNewImages.push(pickerResult);

        this.setState({
            selectedNewImages: selectedNewImages
        })
    };


    handleRemoveOldImage = async (item) => {

        console.log(item, 'dsdwd');

        let {selectedOldImages} = this.state;
        selectedOldImages = selectedOldImages.filter(el => el !== item);
        await this.setState({
            selectedOldImages: selectedOldImages,
        })

        this.deleteImage(item.id)

    };

    handleRemoveNewImage = async (item) => {

        console.log(item, 'dsdwd');

        let {selectedNewImages} = this.state;
        selectedNewImages = selectedNewImages.filter(el => el !== item);

        await this.setState({
            selectedNewImages: selectedNewImages,
        })

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(this.state.selectedImages, "images")
        console.log(this.state.imageIdList, "id")
        // console.log(this.state.selectedImages)

    }

    deleteImage = async (id) => {
        try {

            console.log("https://bowy.ru/api/delete-image/" + id);

            let userToken = await AsyncStorage.getItem("userToken")
            let AuthStr = "Bearer " + userToken
            fetch("https://bowy.ru/api/delete-image/" + id, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AuthStr,
                },
            })
                .then(response => response.json())
                .then((res) => {
                    console.log("jnjel")
                    console.log(res, 'nkary jnajaca')
                }).catch((e) => {
                console.log("errrrror")
            })
        } catch (e) {
            console.log("catch jnjel")
        }
    }
    getCategories = async () => {
        fetch('https://bowy.ru/api/home')
            .then(res => res.json())
            .then((res) => {
                const carCategory = []
                res[0].forEach((item) => {
                    let picker = {}
                    picker.label = item.name
                    picker.value = item.id
                    picker.id = item.id
                    carCategory.push(picker)
                })
                this.setState({carCategoryItems: carCategory})
            })
            .catch(() => {
                // console.log("Hi")
            })
    }
    getRegions = async () => {

        fetch('https://bowy.ru/api/home')
            .then(res => res.json())
            .then((res) => {
                const carCategory = []
                res[1].forEach((item) => {
                    let picker = {}
                    picker.label = item.name
                    picker.value = item.id
                    picker.id = item.id
                    carCategory.push(picker)
                })
                this.setState({regionCategoryItems: carCategory})
            })
            .catch(() => {
                console.log("Hello")
            })
    }


    getCities = async (regionId) => {
        try {

            let userToken = await AsyncStorage.getItem("userToken")
            let AuthStr = "Bearer " + userToken

            fetch(`https://bowy.ru/api/city`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': AuthStr,
                }
            })
                .then(response => response.json())
                .then((response) => {
                    let arr = []
                    response[1]
                        .filter((item) => item.region_id == regionId)
                        .map((item) => {
                            let picker = {}
                            picker.label = item.name
                            picker.value = item.id
                            picker.id = item.id
                            arr.push(picker)
                        })
                    this.setState({
                        cityListItems: arr,
                        pageLoaded: true
                    })

                })
                .catch((e) => {
                    // console.log(e)
                })
        } catch (e) {
            // console.log(e)
        }
    }
    getCarYears = async () => {
        let arr = []
        let maxCarAge = new Date().getFullYear().toString()
        for (let i = maxCarAge; i >= 1950; i--) {
            let picker = {}
            picker.label = i
            picker.value = i
            arr.push(picker)
        }
        this.setState({carAgeItems: arr})
    }
    getCarModel = async () => {
        try {
            let userToken = await AsyncStorage.getItem("userToken")
            let AuthStr = "Bearer " + userToken
            fetch(`https://bowy.ru/api/city`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': AuthStr,
                }
            })
                .then(response => response.json())
                .then((response) => {
                    let arr = []
                    response[0].map((item) => {
                        let picker = {}
                        picker.label = item.name
                        picker.value = item.name
                        picker.id = item.id
                        arr.push(picker)
                    })
                    this.setState({carModelItems: arr})
                })
                .catch((e) => {
                    // console.log(e)
                })
        } catch (e) {

        }
    }
    getImages = async () => {
        this.setState({selectedOldImages: this.props.auto_data?.image}, ()=>{
            console.log(this.state.selectedOldImages, 'dqdqwdwqdw')
        })
    }

    editCar = async () => {

        let {selectedNewImages, selectedOldImages} = this.state

        try {

            if (selectedNewImages.length == 0 && selectedOldImages.length == 0) {
                alert('Картинки Обязательны!')
                this.setState({imageError: "добавить картинки обязательно"})
                return false;
            }

            selectedNewImages = selectedNewImages.filter(item => item.uri)

            console.log(selectedNewImages)
            console.log(this.state.imageIdList, "idList")


            const form = new FormData();

            selectedNewImages.forEach((item, index)=>{

                form.append(`images[]`, {
                    uri: item["uri"],
                    type: 'image/jpg',
                    name: 'image'+index+'.jpg',
                });

            })


            form.append("headline", this.state.title)
            form.append("region", this.state.regionCategoryValue);
            form.append("city", this.state.cityListValue);
            form.append("price", this.state.price);
            form.append("address", this.state.address);
            form.append("car_model", this.state.carModelValue);
            form.append("description", this.state.description);
            form.append("body_type", this.state.bodyTypeValue);
            form.append("rudder", this.state.rudderValue);
            form.append("year_of_issue", this.state.carAgeValue);
            form.append("transmission", this.state.gearBoxValue);
            form.append("category_id", this.state.carCategoryValue);
            form.append("product_id", this.props.auto_data.id);


            const userToken = await AsyncStorage.getItem("userToken")
            const AuthStr = "Bearer " + userToken


            await fetch("https://bowy.ru/api/update-products/" + this.props.auto_data.id, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': AuthStr,
                },
                body: form
            })
                .then(response => response.json())
                .then((res) => {

                    console.log(res, 'res')

                    if (res.success) {

                        this.setState({
                            selectedImages: [],
                            carCategoryValue: null,
                            regionCategoryValue: null,
                            cityListValue: null,
                            carAgeValue: null,
                            bodyTypeValue: null,
                            gearBoxValue: null,
                            carModelValue: null,
                            rudderValue: null,
                            imageError: null,
                            title: "",
                            price: "",
                            address: "",
                            description: "",
                        })

                        // if (this.state.imageIdList.length) {
                        //
                        //     this.state.imageIdList.forEach((item) => {
                        //         console.log(item, "edo")
                        //         this.deleteImage(item)
                        //     })
                        //
                        // }

                        this.props.navigation.navigate("Profile")

                    } else {


                        this.setState({
                            title_error: res.data.hasOwnProperty('headline') ? true : false,
                            price_error: res.data.hasOwnProperty('price') ? true : false,
                            address_error: res.data.hasOwnProperty('address') ? true : false,
                            description_error: res.data.hasOwnProperty('description') ? true : false,
                        })


                    }
                })
                .catch((res) => {
                    console.log("catch promise")
                })


        } catch (e) {
            console.log("catch async")
        }
    }

    getCarInfo = async () => {

        this.setState({
            description: this.props.auto_data.description,
            title: this.props.auto_data.headline,
            price: String(this.props.auto_data.price),
            carCategoryValue: this.props.auto_data.category_id,
            regionCategoryValue: String(this.props.auto_data.region_name),
            cityListValue: this.props.auto_data.city_name,
            address: this.props.auto_data.address,
            carModelValue: this.props.auto_data.car_model,
            rudderValue: this.props.auto_data.rudder,
            gearBoxValue: this.props.auto_data.transmission,
            carAgeValue: Number(this.props.auto_data.year_of_issue),
            bodyTypeValue: this.props.auto_data.body_type
        })
    }


    allRequests = async () => {

        await this.setState({
            pageLoaded: false,
            selectedOldImages: [],
            selectedNewImages: []
        })

        await this.getCategories()
        await this.getRegions()
        await this.getCarYears()
        await this.getCarModel()
        await this.getImages()
        await this.getCarInfo()
        await this.getCities(this.props.auto_data.region)

    }


    componentDidMount() {

      this.allRequests()

        this.focusListener = this.props.navigation.addListener("focus", () => {

            this.allRequests()

        });

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

            <SafeAreaView style={{width: '100%', height: '100%', backgroundColor:'white'  }}>

                <View style={editCarStyles.container}>

                    <View style={editCarStyles.titleStyles}>
                        <Text style={{fontSize: 18, color: '#424A55'}}>
                            Редактирование объявления
                        </Text>
                        <TouchableOpacity onPress={this.handleBack}>
                            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636l4.95 4.95z" fill="#9AA1B4"/>
                            </Svg>
                        </TouchableOpacity>
                    </View>


                    <ScrollView style={{width: "100%", flex: 1, paddingHorizontal: 20}} contentContainerStyle={editCarStyles.scrollComponents}>

                        <View style={[editCarStyles.characteristicsView, {marginBottom: 20}]}>
                            <TextInput
                                style={[editCarStyles.inputStyles, this.state.title_error ? {borderBottomWidth: 1, borderBottomColor: 'red'} : {}]}
                                placeholderTextColor={this.state.title_error ? 'red' : "#424A55"}
                                placeholder='Заголовок объявления'
                                value={this.state.title}
                                onChangeText={(title) => this.setState({title})}
                            />

                            <TextInput
                                keyboardType={"numeric"}
                                placeholderTextColor={this.state.price_error ? 'red' : "#424A55"}
                                style={[editCarStyles.inputStyles, this.state.price_error ? {borderBottomWidth: 1, borderBottomColor: 'red'} : {}]}
                                placeholder='Стоимость'
                                value={this.state.price}
                                onChangeText={(price) => this.setState({price})}
                            />



                            <DropDownPicker
                                open={this.state.carCategoryOpen}
                                value={this.state.carCategoryValue}
                                items={this.state.carCategoryItems}
                                setOpen={() => {
                                    this.setState((state) => ({carCategoryOpen: !state.carCategoryOpen}))
                                }}
                                placeholderStyle={{
                                    color: "#424A55"
                                }}
                                maxHeight={200}
                                setValue={(call) => this.setState((value) => ({carCategoryValue: call(value)}))}
                                placeholder="Выберите категорию"
                                style={{
                                    width: '100%',
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    height: 60,
                                    borderColor: '#A2ABC2',
                                    backgroundColor: '#F0F4F8',
                                }}
                                onOpen={() => {
                                    this.setState({regionCategoryOpen: false})
                                    console.log(this.state.carCategoryValue)
                                }}
                                zIndex={10}
                                listMode="MODAL"
                            />

                            <DropDownPicker
                                open={this.state.regionCategoryOpen}
                                value={this.state.regionCategoryValue}
                                items={this.state.regionCategoryItems}
                                setOpen={() => {
                                    this.setState((state) => ({regionCategoryOpen: !state.regionCategoryOpen}))
                                }}
                                maxHeight={200}
                                setValue={(call) => this.setState((value) => ({regionCategoryValue: call(value)}))}
                                placeholder="Выберите область"
                                style={{
                                    width: '100%',
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    height: 60,
                                    borderColor: '#A2ABC2',
                                    backgroundColor: '#F0F4F8',
                                }}
                                placeholderStyle={{
                                    color: "#424A55"
                                }}
                                onOpen={() => {
                                    this.setState({carCategoryOpen: false})
                                }}
                                listMode="MODAL"
                                zIndex={9}
                                onSelectItem={(item) => {
                                    this.getCities(item.id)
                                }}

                            />
                            <DropDownPicker
                                open={this.state.cityListOpen}
                                value={this.state.cityListValue}
                                items={this.state.cityListItems}
                                setOpen={() => {
                                    this.setState((state) => ({cityListOpen: !state.cityListOpen}))
                                }}
                                maxHeight={200}
                                setValue={(call) => this.setState((value) => ({cityListValue: call(value)}))}
                                placeholder="Выберите город"
                                style={{
                                    width: '100%',
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    height: 60,
                                    borderColor: '#A2ABC2',
                                    backgroundColor: '#F0F4F8',
                                }}
                                placeholderStyle={{
                                    color: "#424A55"
                                }}
                                onOpen={() => {
                                    this.setState({carCategoryOpen: false})
                                    console.log(this.state.cityListValue)
                                }}
                                listMode="MODAL"
                                zIndex={8}
                            />


                            <TextInput
                                placeholderTextColor={this.state.address_error ? 'red' : "#424A55"}
                                style={[editCarStyles.inputStyles, this.state.address_error ? {borderBottomWidth: 1, borderBottomColor: 'red'} : {}]}
                                placeholder='Адрес'
                                value={this.state.address}
                                onChangeText={(address) => this.setState({address})}
                            />

                            <DropDownPicker
                                open={this.state.carModelOpen}
                                value={this.state.carModelValue}
                                items={this.state.carModelItems}
                                setOpen={() => {
                                    this.setState((state) => ({carModelOpen: !state.carModelOpen}))
                                }}
                                maxHeight={200}
                                setValue={(call) => this.setState((value) => ({carModelValue: call(value)}))}
                                placeholder="Марка автомобиля"
                                style={{
                                    width: '100%',
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    height: 60,
                                    borderColor: '#A2ABC2',
                                    backgroundColor: '#F0F4F8',
                                }}
                                placeholderStyle={{
                                    color: "#424A55"
                                }}
                                onOpen={() => {
                                    this.setState({carCategoryOpen: false})
                                }}
                                listMode="MODAL"
                                zIndex={7}
                            />


                            <TextInput
                                style={[{width: '100%', height: 60, paddingLeft: 13}]}
                                placeholderTextColor={this.state.description_error ? 'red' : "#424A55"}

                                placeholder='Описание объявления'
                                value={this.state.description}
                                onChangeText={(description) => this.setState({description})}
                            />

                        </View>



                        <View style={editCarStyles.feature}>
                            <Text style={{textAlign: "left", width: "100%", fontSize: 14, color:'#424A55'}}>
                                Характеристики
                            </Text>
                        </View>


                        <View style={[editCarStyles.characteristicsView, {marginTop: 10}]}>


                            <DropDownPicker
                                open={this.state.rudderOpen}
                                value={this.state.rudderValue}
                                items={this.state.rudderItems}
                                setOpen={() => {
                                    this.setState((state) => ({rudderOpen: !state.rudderOpen}))
                                }}
                                maxHeight={200}
                                setValue={(call) => this.setState((value) => ({rudderValue: call(value)}))}
                                placeholder="Руль"
                                style={{
                                    width: '100%',
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    height: 60,
                                    borderColor: '#A2ABC2',
                                    backgroundColor: '#F0F4F8',
                                }}
                                placeholderStyle={{
                                    color: "#424A55"
                                }}
                                onOpen={() => {
                                    this.setState({regionCategoryOpen: false})
                                }}
                                zIndex={6}
                                listMode="MODAL"
                            />


                            <DropDownPicker
                                open={this.state.gearBoxOpen}
                                value={this.state.gearBoxValue}
                                items={this.state.gearBoxItem}
                                setOpen={() => {
                                    this.setState((state) => ({gearBoxOpen: !state.gearBoxOpen}))
                                }}
                                maxHeight={220}
                                setValue={(call) => this.setState((value) => ({gearBoxValue: call(value)}))}
                                placeholder="Коробка передач"
                                style={{
                                    width: '100%',
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    height: 60,
                                    borderColor: '#A2ABC2',
                                    backgroundColor: '#F0F4F8',
                                }}
                                placeholderStyle={{
                                    color: "#424A55"
                                }}
                                onOpen={() => {
                                    this.setState({regionCategoryOpen: false})
                                    this.setState({carCategoryOpen: false})
                                }}
                                zIndex={5}
                                listMode="MODAL"
                            />


                            <DropDownPicker
                                open={this.state.carAgeOpen}
                                value={this.state.carAgeValue}
                                items={this.state.carAgeItems}
                                setOpen={() => {
                                    this.setState((state) => ({carAgeOpen: !state.carAgeOpen}))
                                }}
                                maxHeight={200}
                                setValue={(call) => this.setState((value) => ({carAgeValue: call(value)}))}
                                placeholder="Год выпуска"
                                style={{
                                    width: '100%',
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    height: 60,
                                    borderColor: '#A2ABC2',
                                    backgroundColor: '#F0F4F8',
                                }}
                                placeholderStyle={{
                                    color: "#424A55"
                                }}
                                onOpen={() => {
                                    this.setState({regionCategoryOpen: false})
                                    this.setState({carCategoryOpen: false})
                                }}
                                zIndex={4}
                                listMode="MODAL"
                            />


                            <DropDownPicker
                                open={this.state.bodyTypeOpen}
                                value={this.state.bodyTypeValue}
                                items={this.state.bodyTypeItems}
                                setOpen={() => {
                                    this.setState((state) => ({bodyTypeOpen: !state.bodyTypeOpen}))
                                }}
                                maxHeight={200}
                                setValue={(call) => this.setState((value) => ({bodyTypeValue: call(value)}))}
                                placeholder="Тип кузова"
                                style={{
                                    width: '100%',
                                    borderWidth: 0,
                                    borderBottomWidth: 0,
                                    height: 60,
                                    borderColor: '#A2ABC2',
                                    backgroundColor: '#F0F4F8',
                                }}
                                placeholderStyle={{
                                    color: "#424A55"
                                }}
                                onOpen={() => {
                                    this.setState({regionCategoryOpen: false})
                                }}
                                zIndex={3}
                                listMode="MODAL"
                            />



                        </View>

                        <View style={{flexDirection: "column", width: "100%", alignItems: "center", marginBottom: 30}}>


                            <View style={{width: '100%', alignItems: "flex-start", justifyContent: "center"}}>

                                <View style={editCarStyles.pickedPhotoStyle}>
                                    {this.renderOldPicketPhoto()}
                                </View>

                                <View style={editCarStyles.pickedPhotoStyle}>
                                    {this.renderNewPicketPhoto()}
                                </View>

                                <TouchableOpacity style={editCarStyles.imagePicker} onPress={this.openImagePickerAsync}>
                                    <Text style={editCarStyles.imagePickerIcon}>
                                        +
                                    </Text>
                                </TouchableOpacity>


                            </View>


                        </View>

                    </ScrollView>
                </View>

                <View style={{width: '100%', flexDirection:'row', justifyContent:'center', paddingVertical: 10, }}>

                      <TouchableOpacity style={{maxWidth: 315, width: '100%'}} onPress={this.editCar}>
                          <LinearGradient colors={['#34BE7C', '#2EB6A5']} style={editCarStyles.linearGradient}>
                              <Text style={{textAlign: 'center', color: 'white'}}>
                                  Сохранить изменения
                              </Text>
                          </LinearGradient>
                      </TouchableOpacity>

                 </View>


            </SafeAreaView>
        )
    }
}


