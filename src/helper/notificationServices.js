import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert } from '../../node_modules/react-native/types/index';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken()
  }
}

const getFcmToken = async() => {
    let checkToken = await AsyncStorage.getItem('fcmToken')
    console.log("The Old Token: ",checkToken)
    if(!checkToken){
        try{
            const fcmToken = await messaging().getToken();
            if(!!fcmToken){
                console.log("FCM Token generated: ",fcmToken)
                await AsyncStorage.setItem('fcmToken',fcmToken)
            }
        }catch(error){
            console.log("error in fcmToken",error);
            // Alert(error?.message);
        }
    }
}

export const notificationListener = async() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'notification caused app to open from background state',
            remoteMessage.notification,
        );
        console.log('backgroun state',remoteMessage.notification)
    });

    //check wether an initial notification is available
    messaging()
    .getInitialNotification()
    .then(remoteMessage => {
        if(remoteMessage){
            console.log('notification caused app to open from quite state: ',
            remoteMessage.notification);
            console.log('remote message: ',remoteMessage.notification);
        }
    })
}