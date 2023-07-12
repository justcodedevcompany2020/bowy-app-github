import React, {Component} from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View, Alert, Modal} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import {EvilIcons} from '@expo/vector-icons';
import {
    SafeAreaView,
    SafeAreaProvider,
    SafeAreaInsetsContext,
    useSafeAreaInsets,
    initialWindowMetrics,
} from 'react-native-safe-area-context';

import SelectDropdown from 'react-native-select-dropdown'

import {addCarStyle} from './AddCarStyles';
import * as ImagePicker from 'expo-image-picker';
import {LinearGradient} from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {editCarStyles} from "../EditCar/EditCarStyles";


export default class AddCar extends Component {
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


            carModelOpen: false,
            carModelValue: null,
            carModelItems: [],

            rudderOpen: false,
            rudderValue: null,
            rudderItems: [
                {label: "левый", value: "левый"},
                {label: "правый", value: "правый"},
            ],

            gearBoxOpen: false,
            gearBoxValue: null,
            gearBoxItem: [
                {label: "Механическая коробка передач", value: "Механическая"},
                {label: "Автоматическая коробка передач", value: "Автоматическая"},
            ],

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


            selectedImages: [],
            imageError: null,


            title: "",
            price: "",
            address: "",
            description: "",


            title_error: false,
            region_category_error: false,
            city_list_error: false,
            price_error: false,
            address_error: false,
            car_model_error: false,
            description_error: false,
            body_type_error: false,
            ruder_error: false,
            car_age_error: false,
            gear_box_error: false,
            car_category_error: false,
            disable_button: false
        }
    }


    handleBack = () => {
        this.props.navigation.navigate('Feeds')
    };


    renderPicketPhoto = () => {
        let {selectedImages} = this.state;
        if (selectedImages.length) {
            return (
                <ScrollView style={{}} horizontal={true}>
                    {
                        selectedImages.map((item, index) => (
                            <View style={{width: 100, height: 100, marginRight: 20}} key={index}>
                                <TouchableOpacity style={addCarStyle.removeCarStyle}
                                      onPress={() => {
                                         this.handleRemoveCar(item)
                                      }}
                                >
                                    <Image
                                        style={{justifyContent: 'center'}}
                                        source={require('../../assets/img/trashicon.png')}
                                    />
                                </TouchableOpacity>
                                <Image source={{uri: item.assets[0].uri}}
                                   style={{
                                        width: 100,
                                        height: 100,
                                        borderWidth: 3,
                                        borderRadius: 10,
                                   }}
                                />
                            </View>
                        ))
                    }

                </ScrollView>
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


        let pickerResult2 = pickerResult;

        pickerResult2.key = pickerResult2.assets[0].uri;

        let res = pickerResult2.assets[0].uri.split('.');
        let type = res[res.length - 1];


        console.log(pickerResult2, 'pickerResult2')

        if (type !== 'jpg' && type !== 'png' && type !== 'jpeg') {
            Alert.alert("формат картинки должен быть JPEG, PNG или JPG")
            return
        }


        let {selectedImages} = this.state;
        selectedImages.push(pickerResult2);
        this.setState({
            selectedImages: selectedImages
        })

        console.log(pickerResult2, "picker")

    };
    handleRemoveCar = (uri) => {
        let {selectedImages} = this.state;
        selectedImages = selectedImages.filter(el => el !== uri);

        this.setState({
            selectedImages
        })
    };

    getCategories = () => {
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

                console.log(carCategory, 'carCategory');

                this.setState({carCategoryItems: carCategory});

            })
            .catch(() => {
                // console.log("Hi")
            })
    }

    getRegions = () => {
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
                    console.log(response)
                    let arr = []
                    response[1]
                        .filter((item) => item.region_id === regionId)
                        .map((item) => {
                            let picker = {}
                            picker.label = item.name
                            picker.value = item.id
                            picker.id = item.id
                            arr.push(picker)
                        })
                    this.setState({cityListItems: arr})

                })
                .catch((e) => {
                    // console.log(e)
                })
        } catch (e) {
            // console.log(e)
        }
    }
    getCarYears = () => {
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


    addAnnouncement = async () => {

        let {selectedImages,title, regionCategoryValue, cityListValue, price, address, carModelValue, description, bodyTypeValue, rudderValue, carAgeValue, gearBoxValue, carCategoryValue} = this.state;

        try {

            if (!this.state.selectedImages.length) {
                this.setState({imageError: "добавить картинки обязательно"})
                return
            }

            const form = new FormData();

            console.log(selectedImages, 'selectedImages')

            selectedImages.forEach((item, index)=>{
                console.log(item["key"], 'selectedImages')

                form.append(`images[]`, {
                    uri: item["key"],
                    type: 'image/jpg',
                    name: 'image'+index+'.jpg',
                });

            })

            // console.log(form, 'form')


            if (title === '' || !regionCategoryValue || !cityListValue || price === '' || address === '' ||
                !carModelValue || description === '' || !bodyTypeValue || !rudderValue || !carAgeValue ||
                !gearBoxValue || !carCategoryValue ) {

                this.setState({

                    title_error: title === '' ? true : false,
                    region_category_error: !regionCategoryValue ? true : false,
                    city_list_error: !cityListValue ? true : false,
                    price_error: price === '' ? true : false,
                    address_error: address === '' ? true : false,
                    car_model_error: !carModelValue ? true : false,
                    description_error: description === '' ? true : false,
                    body_type_error: !bodyTypeValue ? true : false,
                    ruder_error: !rudderValue ? true : false,
                    car_age_error: !carAgeValue ? true : false,
                    gear_box_error: !gearBoxValue ? true : false,
                    car_category_error: !carCategoryValue ? true : false,

                })

                return false;

            }


            form.append("headline", title)
            form.append("region", regionCategoryValue);
            form.append("city", cityListValue);
            form.append("price", price);
            form.append("address", address);
            form.append("car_model", carModelValue);
            form.append("description", description);
            form.append("body_type", bodyTypeValue);
            form.append("rudder", rudderValue);
            form.append("year_of_issue", carAgeValue);
            form.append("transmission", gearBoxValue);
            form.append("category_id", carCategoryValue);


            await this.setState({
                disable_button: true
            })
            // return false;

            let userToken = await AsyncStorage.getItem("userToken")
            let AuthStr = "Bearer " + userToken

            fetch("https://bowy.ru/api/products", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': AuthStr,
                },
                body: form


            })
                .then(response => response.json())
                .then(async (res) => {
                    await this.setState({
                        disable_button: false
                    })

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
                        Alert.alert("Ваше объявление успешно добавлено")
                        setTimeout(() => {
                            this.props.navigation.navigate("Feeds")
                        }, 2000)
                    } else {

                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        } catch (e) {
            console.log(e)
        }

    }



    componentDidMount() {
        this.getCategories()
        this.getRegions()
        this.getCarYears()
        this.getCarModel()

        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.getCategories()
            this.getRegions()
            this.getCarYears()
            this.getCarModel()
        })
    }
    componentWillUnmount() {
        console.log("")
    }

    render() {
        return (

            <SafeAreaView style={{width: '100%', height: '100%', backgroundColor: 'white'}}>

                <View style={addCarStyle.container}>

                    <View style={addCarStyle.titleStyles}>
                        <Text style={{fontSize: 23, fontWeight: "bold"}}>Создание объявления</Text>
                        <TouchableOpacity onPress={this.handleBack}>
                            <EvilIcons name="close" size={23} color="black"/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{width: "100%"}} showsVerticalScrollIndicator={false}>


                        <View style={addCarStyle.characteristicsView}>
                            <TextInput
                                placeholderTextColor={this.state.title_error ? 'red' : "#424A55"}
                                style={[addCarStyle.inputStyles, {color:'#424A55', fontSize: 14}, this.state.title_error ? {borderBottomWidth: 1, borderBottomColor: 'red'} : {}]}
                                placeholder='Заголовок объявления'
                                value={this.state.title}
                                onChangeText={(title) => this.setState({title})}
                            />

                            <TextInput
                                placeholderTextColor={this.state.price_error ? 'red' : "#424A55"}
                                keyboardType={"numeric"}
                                style={[addCarStyle.inputStyles,{color:'#424A55', fontSize: 14}, this.state.price_error ? {borderBottomWidth: 1, borderBottomColor: 'red'} : {}]}
                                placeholder='Стоимость'
                                value={this.state.price}
                                onChangeText={(price) => this.setState({price})}
                            />



                            <SelectDropdown
                                data={this.state.carCategoryItems}
                                onSelect={(selectedItem, index) => {

                                    console.log(selectedItem.id, index)

                                    if(selectedItem.id === 2 || selectedItem.id === 4 || selectedItem.id === 5){
                                        console.log('ssssss')
                                        this.setState({
                                            carModelValue:'Не указан',
                                            rudderValue:'Не указан',
                                            bodyTypeValue:'Не указан'
                                        })
                                    }
                                    if(selectedItem.id === 5){
                                        this.setState({
                                            carModelValue:'Не указан',
                                            rudderValue:'Не указан',
                                            gearBoxValue:'Не указан',
                                            bodyTypeValue:'Не указан'
                                        })
                                    }
                                    this.setState({
                                        carCategoryValue: selectedItem.id
                                    })

                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    // text represented after item is selected
                                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                                    return selectedItem.label
                                }}
                                rowTextForSelection={(item, index) => {
                                    // text represented for each item in dropdown
                                    // if data array is an array of objects then return item.property to represent item in dropdown
                                    return item.label
                                }}
                                defaultButtonText={'Выберите категорию'}
                                buttonStyle={{
                                    width: '100%',
                                    borderBottomWidth: 1,
                                    borderRadius: 0,
                                    borderWidth: 0,
                                    height: 60,
                                    borderColor: this.state.car_category_error ? 'red' : '#A2ABC2' ,
                                    backgroundColor: '#F0F4F8',
                                }}
                                buttonTextStyle={{ textAlign:'left', color: this.state.car_category_error ? 'red' : '#424A55',fontSize: 16}}
                            />


                            <SelectDropdown
                                data={this.state.regionCategoryItems}
                                onSelect={(selectedItem, index) => {

                                    console.log(selectedItem, 'regionCategoryItems')

                                    this.setState({
                                        regionCategoryValue: selectedItem.value
                                    })

                                    this.getCities(selectedItem.id)

                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    // text represented after item is selected
                                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                                    return selectedItem.label
                                }}
                                rowTextForSelection={(item, index) => {
                                    // text represented for each item in dropdown
                                    // if data array is an array of objects then return item.property to represent item in dropdown
                                    return item.label
                                }}
                                defaultButtonText={'Выберите область'}
                                buttonStyle={{
                                    width: '100%',
                                    borderBottomWidth: 1,
                                    borderRadius: 0,
                                    borderWidth: 0,
                                    height: 60,
                                    borderColor: this.state.region_category_error ? 'red' : '#A2ABC2',
                                    backgroundColor: '#F0F4F8',
                                }}
                                buttonTextStyle={{ textAlign:'left', color: this.state.region_category_error ? 'red' : '#424A55', fontSize: 16}}
                            />


                            <SelectDropdown
                                data={this.state.cityListItems}
                                onSelect={(selectedItem, index) => {

                                    console.log(selectedItem, 'cityListValue')

                                    this.setState({
                                        cityListValue: selectedItem.value
                                    })


                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    // text represented after item is selected
                                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                                    return selectedItem.label
                                }}
                                rowTextForSelection={(item, index) => {
                                    // text represented for each item in dropdown
                                    // if data array is an array of objects then return item.property to represent item in dropdown
                                    return item.label
                                }}
                                defaultButtonText={'Выберите город'}
                                buttonStyle={{
                                    width: '100%',
                                    borderBottomWidth: 1,
                                    borderRadius: 0,
                                    borderWidth: 0,
                                    height: 60,
                                    borderColor: this.state.city_list_error ? 'red' : '#A2ABC2',
                                    backgroundColor: '#F0F4F8',
                                }}
                                buttonTextStyle={{ textAlign:'left', color: this.state.city_list_error ? 'red' : '#424A55', fontSize: 16}}
                            />






                            <TextInput
                                placeholderTextColor={this.state.address_error ? 'red' : "#424A55"}
                                style={[addCarStyle.inputStyles,{color:'#424A55', fontSize: 14}, this.state.address_error ? {borderBottomWidth: 1, borderBottomColor: 'red'} : {}]}
                                placeholder='Адрес'
                                value={this.state.address}
                                onChangeText={(address) => this.setState({address})}
                                // editable={!!this.state.cityListValue}
                            />

                            {console.log(this.state.carCategoryValue)}
                            {this.state.carCategoryValue  !== 2 && this.state.carCategoryValue  !== 4 && this.state.carCategoryValue  !== 5 &&
                            <SelectDropdown
                                data={this.state.carModelItems}
                                onSelect={(selectedItem, index) => {
                                    this.setState({
                                        carModelValue: selectedItem.value
                                    })
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem.label
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.label
                                }}
                                defaultButtonText={'Марка автомобиля'}
                                buttonStyle={{
                                    width: '100%',
                                    borderBottomWidth: 1,
                                    borderRadius: 0,
                                    borderWidth: 0,
                                    height: 60,
                                    borderColor: this.state.car_model_error ? 'red' : '#A2ABC2',
                                    backgroundColor: '#F0F4F8',
                                }}
                                buttonTextStyle={{ textAlign:'left', color: this.state.car_model_error ? 'red' : '#424A55', fontSize: 16}}
                            />}



                            <TextInput
                                placeholderTextColor={this.state.description_error ? 'red' : "#424A55"}
                                style={[{width: '100%', height: 60, paddingLeft: 13, zIndex: 0, color:'#424A55', fontSize: 14}, ]}
                                placeholder='Описание объявления'
                                value={this.state.description}
                                onChangeText={(description) => this.setState({description})}
                            />

                        </View>


                        <View style={addCarStyle.feature}>
                            <Text style={{textAlign: "left", width: "100%", fontSize: 14, color:'#424A55' }}>
                                Характеристики
                            </Text>
                        </View>

                        <View style={addCarStyle.characteristicsView}>

                            {(this.state.carCategoryValue !== 2  && this.state.carCategoryValue !== 5)  && <SelectDropdown
                                data={this.state.rudderItems}
                                onSelect={(selectedItem, index) => {
                                    this.setState({
                                        rudderValue: selectedItem.value
                                    })
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem.label
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.label
                                }}
                                defaultButtonText={'Руль'}
                                buttonStyle={{width: '100%', borderBottomWidth: 1, borderRadius: 0, borderWidth: 0, height: 60, borderColor: this.state.ruder_error ? 'red' : '#A2ABC2', backgroundColor: '#F0F4F8',}}
                                buttonTextStyle={{ textAlign:'left', color: this.state.ruder_error ? 'red' : '#424A55', fontSize: 16}}
                            />}


                            {this.state.carCategoryValue !== 5 &&<SelectDropdown
                                data={this.state.gearBoxItem}
                                onSelect={(selectedItem, index) => {
                                    this.setState({
                                        gearBoxValue: selectedItem.value
                                    })
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem.label
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.label
                                }}
                                defaultButtonText={'Коробка передач'}
                                buttonStyle={{width: '100%', borderBottomWidth: 1, borderRadius: 0, borderWidth: 0, height: 60, borderColor: this.state.gear_box_error ? 'red' : '#A2ABC2', backgroundColor: '#F0F4F8',}}
                                buttonTextStyle={{ textAlign:'left', color:this.state.gear_box_error ? 'red' :  '#424A55', fontSize: 16}}
                            />
                            }

                            <SelectDropdown
                                data={this.state.carAgeItems}
                                onSelect={(selectedItem, index) => {

                                    console.log(selectedItem, 'carAgeValue')

                                    this.setState({
                                        carAgeValue: selectedItem.value
                                    })


                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem.label
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.label
                                }}
                                defaultButtonText={'Год выпуска'}
                                buttonStyle={{width: '100%', borderBottomWidth: 1, borderRadius: 0, borderWidth: 0, height: 60, borderColor: this.state.car_age_error ? 'red' : '#A2ABC2', backgroundColor: '#F0F4F8',}}
                                buttonTextStyle={{ textAlign:'left', color:this.state.car_age_error ? 'red' : '#424A55', fontSize: 16}}
                            />




                            {this.state.carCategoryValue !== 5 || this.state.carCategoryValue !== 4 &&<SelectDropdown
                                data={this.state.bodyTypeItems}
                                onSelect={(selectedItem, index) => {

                                    this.setState({
                                        bodyTypeValue: selectedItem.value
                                    })

                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem.label
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.label
                                }}
                                defaultButtonText={'Тип кузова'}
                                buttonStyle={{width: '100%', borderBottomWidth:0, borderRadius: 0, borderWidth: 0, height: 60, borderColor: this.state.body_type_error ? 'red' : '#A2ABC2', backgroundColor: '#F0F4F8',}}
                                buttonTextStyle={{ textAlign:'left', color: this.state.body_type_error ? 'red' : '#424A55', fontSize: 16}}
                            />}


                        </View>


                        <View style={{width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: "flex-start", paddingHorizontal: 10, marginTop: 30, marginBottom: 30}}>

                            <TouchableOpacity style={addCarStyle.imagePicker} onPress={this.openImagePickerAsync}>
                                <Text style={addCarStyle.imagePickerIcon}>
                                    +
                                </Text>
                            </TouchableOpacity>

                            <View style={addCarStyle.pickedPhotoStyle}>
                                {this.renderPicketPhoto()}
                            </View>
                        </View>



                    </ScrollView>

                </View>


                <View style={{width: '100%', flexDirection:'row', justifyContent:'center', paddingVertical: 10, }}>

                    <TouchableOpacity
                        style={[{maxWidth: 315, width: '100%'}, this.state.disable_button ? {opacity:0.5} : {}]}
                        onPress={() => {
                            if(this.state.disable_button === false) {
                                this.addAnnouncement()
                            }
                        }}
                    >
                        <LinearGradient colors={['#34BE7C', '#2EB6A5']} style={editCarStyles.linearGradient}>
                            <Text style={{textAlign: 'center', color: 'white'}}>
                                Разместить Объявление
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        )
    }
}
