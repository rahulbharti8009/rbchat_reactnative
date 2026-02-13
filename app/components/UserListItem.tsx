import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme, ToastAndroid, Linking, Alert } from 'react-native';
import DB from '../db/DBEntity';
import { User } from '../types/auth';
import { MyCircle } from '../common/MyCircle';
import { useTheme } from '../theme/ThemeContext';
type UpiStatus = 'SUCCESS' | 'FAILURE' | 'SUBMITTED' | null;

export const UserListItem: React.FC<{mobile? : string, user: User ,  onPress: () => void }> = ({mobile, user, onPress }) => {
    const scheme = useColorScheme(); // "light" or "dark"
    const { theme, toggleTheme, themeColor } = useTheme();

      const payNow = (): void => {
    const txnId = Date.now().toString();

    const upiUrl : string =
      `upi://pay?` +
      `pa=test@axl` +          // Payee VPA
      `&pn=abc` +              // Payee Name
      `&am=1` +                   // Amount
      `&cu=INR` +                  // Currency
      `&tr=${txnId}` +             // Transaction ID
      `&tn=test` +          // Note
      `&url=myapp://upi-callback`;   // Callback URL it writen in manifest

    Linking.openURL(upiUrl)
      .catch(() => Alert.alert('Error', 'No UPI app found'));
  };
  
   useEffect(() => {
    const subscription = Linking.addEventListener(
      'url',
      handleUPIResponse
    );

    return () => subscription.remove();
  }, []);

  const handleUPIResponse = (event: { url: string }): void => {
    const responseUrl: string = event.url;
    console.log('UPI Callback:', responseUrl);

    // myapp://upi-callback?Status=SUCCESS&txnId=123
    const queryString = responseUrl.split('?')[1];
    if (!queryString) return;

    const params = new URLSearchParams(queryString);

    const status = params.get('Status') as UpiStatus;
    const txnId = params.get('txnId');

    if (status === 'SUCCESS') {
      Alert.alert('Payment Success', `TxnId: ${txnId}`);
    } else if (status === 'FAILURE') {
      Alert.alert('Payment Failed');
    } else {
      Alert.alert('Payment Pending');
    }
    // 🔐 Always verify txnId from backend
  };

const getColorType =()=> {
  if(user.requestType == 'invite') return '#2E3CFF'
  if(user.requestType == 'pending') return '#E8E8E8'
}
  return (
    <TouchableOpacity onPress={()=> {
      payNow();
    }} style={[styles.container, {backgroundColor: themeColor.background, justifyContent: 'space-between', alignItems:'center'}]} >
    
          <View style={{flexDirection:'row', alignItems:'center'}}>
          <MyCircle color={user.color} size={40}>
            <Text style={[styles.mobile, {color: themeColor.text}]}>{`${user.mobile.substring(0,1)}`}</Text>
          </MyCircle>
            
            <View style={styles.details}>
              {user?.name &&  <Text style={[styles.name, {color: themeColor.text}]}>{user?.name}</Text> }
              <Text style={[styles.mobile, {color: themeColor.text}]}>{user.mobile === mobile ? `Self\n${user.mobile}` : `${user.mobile}`}</Text>
            </View>
          </View>
          {user.requestType !== '' &&   <TouchableOpacity  disabled={user.requestType === 'pending'} style={[styles.request, {  backgroundColor: getColorType()}]} onPress={()=> onPress()}  activeOpacity={0.7}>
             <Text style={[styles.mobile, {color: (user.requestType === 'invite') ? '#ffffff' : themeColor.text}]}>{user.requestType}</Text>
          </TouchableOpacity>
          }
        
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: '#ccc',
    borderWidth: 0,
    borderRadius: 10,
    padding: 10,
    marginVertical: 0,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  request:{
    backgroundColor: '#E5DDDE',
    marginLeft:10,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    marginStart: 10
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  mobile: {
    color: '#555',
  },
  time: {
    color: '#999',
    fontSize: 12,
  },
});