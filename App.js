import * as React from 'react';
import {
  Button,
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  BackHandler
} from 'react-native';

import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import 'react-native-gesture-handler';

import WishListComponent from './components/WishList/WishList';
import EditPassword from "./components/EditPassword/EditPassword";
import FeedsScreenComponent from './components/Feeds/FeedsScreen';
import LoginComponent from './components/Auth/LoginScreen';
import RegisterComponent from './components/Auth/RegisterScreen';
import ConfirmEmail from "./components/Auth/ConfirmEmail";
import SingleCarComponent from './components/SingleCar/SingleCarScreen';
import ProfileComponent from './components/Profile/ProfileScreen';
import ChatComponent from './components/Chats/Chat';
import AddCarComponent from "./components/AddCar/AddCar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from './components/AuthContext/context';
import { StackActions } from '@react-navigation/native';
// import Test from './components/SocialLinks/GoogleComponent'

import SingleMessageComponent from "./components/SingleMessage/SingleMessageScreen";

import ResetPasswordComponent from "./components/Auth/ResetPassword";
import EditCarComponent from "./components/EditCar/EditCarScreen";
import Svg, { G, Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg"

// import {LinearGradient} from 'expo-linear-gradient';
import { useEffect } from "react";


// function TestScreen({ navigation }) {
//   return (
//       <Test navigation={navigation} />
//   )
// }


function SingleCarScreen({ route, navigation }) {
  const { params } = route.params;
  return (
      <SingleCarComponent auto_data={params} navigation={navigation} />
  );
}

function FeedsScreen({ navigation }) {
  return (
      <FeedsScreenComponent navigation={navigation} />
  );
}

function WishListScreen({ navigation }) {
  return (
      <WishListComponent navigation={navigation} />
  );
}



function AddCarScreen({ navigation }) {
  // const { params } = route.params;
  return (
      <AddCarComponent navigation={navigation} />
  )
}

function ChatScreen({ navigation, route }) {
  return (
      <ChatComponent navigation={navigation} />
  );
}

function ProfileScreen({ navigation }) {
  return (
      <ProfileComponent navigation={navigation} />
  );
}

function LoginScreen({ navigation }) {
  return (
      <LoginComponent navigation={navigation} />
  );
}

function RegisterScreen({ navigation }) {
  return (
      <RegisterComponent navigation={navigation} />
  );
}

function ConfirmEmailScreen({ route, navigation }) {
  const { params } = route.params;

  return (
      <ConfirmEmail email={params} navigation={navigation} />
  );
}


function EditCarScreen({ route, navigation }) {
  const { params } = route.params;
  return (
      <EditCarComponent auto_data={params} navigation={navigation} />
  );
}

function SingleMessageScreen({ navigation, route }) {
  const { params, data, same, coins, header, receiver_id } = route.params
  return (
      <SingleMessageComponent navigation={navigation} product_id={params} name={data} image={same} price={coins} headline={header} receiver_id={receiver_id} />
  );
}

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  const initialLoginState = {
    isLoading: true,
    userEmail: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userEmail: action.email,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (foundUser, callback) => {
      // setIsLoading(true);
      const userToken = foundUser.token.toString();
      const userEmail = foundUser.email;

      try {
        await AsyncStorage.setItem('userToken', userToken);
      } catch (e) {
        console.log(e);
      }

      dispatch({ type: 'LOGIN', email: userEmail, token: userToken });
      callback()
    },
    signOut: async (callback) => {
      try {
        await AsyncStorage.removeItem('userToken');
        setIsLoading(false);

      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
      callback();

    },
    signUp: () => {
      // setIsLoading(false);
    }
  }), []);

  React.useEffect(() => {
    setTimeout(async () => {

      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        setIsLoading(false);

      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);


  const Tab = createBottomTabNavigator();


  const tabBarStyle = {
    height: 60,
    backgroundColor: 'white',
    elevation: 0,
    borderTopColor: '#ababab3b',
    borderTopWidth: 1,
    // width: Dimensions.get('window').width - 50,
    width: '100%',
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
  };

  if( isLoading ) {
    return(
        <View style={{   width: '100%', height: '100%', backgroundColor: '#1BDEEB'}}>

          <Image style={{width: '100%', height: '100%'}} source={require('./assets/img/start.png')}/>

        </View>
    );
  }

  return (

      <AuthContext.Provider value={authContext}>

        <NavigationContainer>

          {loginState.userToken !== null ?

              <Stack.Navigator
                  initialRouteName="Feeds"
                  screenOptions={{
                    headerShown: false,
                    tabBarVisible: false
                  }}
              >

                <Stack.Screen name="Feeds" component={FeedsScreen} />
                <Stack.Screen name="WishList" component={WishListScreen}
                      options={{
                        title: 'Избранное',
                        headerShown: false,
                        headerTitleStyle: {
                          // paddingLeft: 6,
                        },
                      }}
                />

                <Stack.Screen name='AddCarComponent' component={AddCarScreen}/>

                {/*<Stack.Screen name="AddAuto" component={AddAutoScreen}*/}
                {/*    options={{*/}
                {/*       */}
                {/*    }}*/}
                {/*/>*/}

                <Stack.Screen name="Chat" component={ChatScreen}
                            options={({ route }) => ({})}
                />
                <Stack.Screen name="Profile" component={ProfileScreen} />


                <Stack.Screen name="SingleCar" component={SingleCarScreen} />



                <Stack.Screen name="SingleMessage" component={SingleMessageScreen}
                            options={({ route }) => ({
                              tabBarButton: () => null,
                              tabBarStyle: { display: 'none' }
                            })} />

                <Stack.Screen name="EditPassword" component={EditPassword}
                            options={({ route }) => ({
                              tabBarButton: () => null,
                              tabBarStyle: { display: 'none' }
                            })} />
                <Stack.Screen name="EditCar" component={EditCarScreen}
                            options={({ route }) => ({
                              tabBarButton: () => null,
                              tabBarStyle: { display: 'none' }
                            })} />

              </Stack.Navigator>



              :


              <Stack.Navigator
                  initialRouteName="Login"
                  screenOptions={{
                    headerShown: false,
                    tabBarVisible: false
                  }}
              >


                <Stack.Screen name="Login" component={LoginScreen}
                            options={({ route }) => ({
                              tabBarButton: () => null,
                              tabBarStyle: { display: 'none' }
                            })}
                />

                <Stack.Screen name='ResetPassword' component={ResetPasswordComponent}
                            options={({ route }) => ({
                              tabBarButton: () => null,
                              tabBarStyle: { display: 'none' }
                            })}
                />

                <Stack.Screen name="Register" component={RegisterScreen}
                            options={({ route }) => ({
                              tabBarButton: () => null,
                              tabBarStyle: { display: 'none' }
                            })}
                />
                <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen}
                            options={({ route }) => ({
                              tabBarButton: () => null,
                              tabBarStyle: { display: 'none' }
                            })}
                />



                <Stack.Screen name="EditPassword" component={EditPassword}
                  options={({ route }) => ({
                    tabBarButton: () => null,
                    tabBarStyle: { display: 'none' }
                  })} />

              </Stack.Navigator>

          }


        </NavigationContainer>
      </AuthContext.Provider>
  );
}

