// components/CustomHeader.js

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { Icon } from '../common/ImageComp';
import { RouteName } from '../utils/enum';
import { Props } from '../ui/HomeUI';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';
import { MyCircle } from '../common/MyCircle';
import { useAppSelector } from '../redux/hook/hook';
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  RouteName.Home
>;
const CustomHeader : React.FC<{ title: string,isDashboard: boolean }> = ({ title , isDashboard = false})  => {
    const { theme, toggleTheme, themeColor } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const user = useAppSelector((state) => state.auth.user)


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
      {/* Back Button + Title */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {isDashboard ?  <TouchableOpacity onPress={() => navigation.navigate(RouteName.Profile)}>
            <MyCircle color={user?.color} size={35}>
              <Icon
                size={30}
                source={require('../assets/ic_profile.png')}
              />
            </MyCircle>
        </TouchableOpacity> :  <TouchableOpacity onPress={() => navigation.pop()}>
         <Icon
            source={require('../assets/back.png')}
            tintColor={themeColor.text}
            style={{ marginRight: 12 }}
          />
        </TouchableOpacity>}  
        <Text
          style={{
            color: themeColor.text,
            fontSize: 14,
            marginLeft:10,
            fontWeight: 'bold',
          }}
        >
          {`${title.substring(0,1).toUpperCase()}${title.substring(1,title.length)}`}
        </Text>
      </View>

      {/* userlist & theme */}
      {isDashboard && <View style={{ flexDirection: 'row', alignItems:'center' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate(RouteName.Users)}
              style={{ marginHorizontal: 8 }}
            >
              {/* backgroundColor:  user != null && theme === 'light' ? user.color: themeColor.navbar ,  */}
              <View style={[{padding: 10,  borderRadius:15}]}>
                <Icon
                  source={require('../assets/plus.png')}
                  size={20}
                  tintColor={themeColor.text}
                /> 
              </View>
            
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              toggleTheme();
              console.log('theme')}}>
            <View style={[{padding: 0}]}>
                <Icon
                  source={theme === 'dark' ? require('../assets/ic_dark_theme.png') : require('../assets/ic_light_theme.png')}
                  size={30}
                  tintColor={theme === 'dark' ? themeColor.white: themeColor.black}
                /> 
              </View>
            </TouchableOpacity>
          </View>
      }
    </View>
  );
};

export default CustomHeader;
