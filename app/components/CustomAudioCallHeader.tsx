// components/CustomHeader.js

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useAppSelector } from '../redux/hook/hook';
import MySocket from '../utils/socket';

const CustomAudioCallHeader = ({ title , color, onClick}: {title: string,color: string, onClick: ()=> void}) => {
  const navigation = useNavigation();
  const auth = useAppSelector((state) => state.auth.user)
  const { theme, toggleTheme, themeColor } = useTheme();
 const mySocket = MySocket.getInstance();
  const socket = mySocket.getSocket();

  useEffect(() => {
      const socketParams = `message${auth?.mobile}`;
      socket?.on(socketParams, (msg: any) => {
       
      });
},[]) ;

  return (
    <View
      style={{
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: themeColor.toolbar,
        borderBottomWidth: 1,
        borderBottomColor: themeColor.text + '30', // slight border tint
      }}
    >
      <View style={[{flexDirection:'row'}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/back.png')}
              style={{
                width: 24,
                height: 24,
                tintColor: themeColor.text,
                marginRight: 12,
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: themeColor.text,
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            {`${title.substring(0,1).toUpperCase()}${title.substring(1,title.length)}`}
          </Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  logout:{
    backgroundColor: '#E5DDDE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobile: {
    color: '#555',
  }
});


export default  CustomAudioCallHeader;
