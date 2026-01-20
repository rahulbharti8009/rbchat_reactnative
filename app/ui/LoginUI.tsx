import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';
import { getLoginData, setLoginSave } from '../utils/localDB';
import { useTheme } from '../theme/ThemeContext';
import { RouteName } from '../utils/enum';
import { useDispatch } from 'react-redux'
import { login } from '../redux/slice/authSlice';
import { LoginPayload, User } from '../types/auth';
import { postApi } from '../types/genericType';
import { MyCircle } from '../common/MyCircle';
import { Icon } from '../common/ImageComp';
import AnimatedInput from '../components/AnimatedInput';


type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.Login>;
};

export const LoginUI: React.FC<Props> = ({ navigation }) => {
  const [mobile, setMobile] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [debouncedName, setDebouncedName] = useState('');

  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const {theme, themeColor } = useTheme();


useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedName(name);
  }, 1000);

  return () => clearTimeout(timer);
}, [name]);

const handleLogin = async () => {
  try {
    const payload: LoginPayload = {
      mobile: mobile,
      name : name
    };
    setLoading(prev => prev = true)
    const data = await postApi<User, LoginPayload>(
      '/login',
      payload
    );

        if(data.status){
          await setLoginSave(data.value);
          const user =  await getLoginData();
          setTimeout(()=>{
            dispatch(login(user));
            setLoading(prev => prev = false)
            // navigation.navigate(RouteName.Home);
                    navigation.replace(RouteName.Home);

          }, 3000)

        } else {
          
        }
  } catch (error) {
    console.log(error);
  }
};

const otpAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  if (mobile.length >= 10) {
    Animated.timing(otpAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  } else {
    otpAnim.setValue(0);
  }
}, [mobile]);

  return (
      <View style={[styles.container, { flex: 1, backgroundColor: themeColor.background }]}>

     <View style={{ width: '80%', height: '50%' , flexDirection:'column', paddingTop:'50%',}}>
         <AnimatedInput
          label="📞 Please enter your mobile number.😊"
          value={mobile}
          marginBottom={18}
          onChangeText={setMobile}
          keyboardType="ascii-capable"
          maxLength={10}
        />

        {mobile.length >= 10 && (
           <AnimatedInput
              label="👤 Please enter your name."
              value={name}
              marginTop={10}
              marginBottom={18}
              onChangeText={setName}
              keyboardType="ascii-capable"
              maxLength={20}
        />)}

          {mobile.length >= 10 && debouncedName.length > 2 && (
                    <AnimatedInput
                        label="🔐 Enter OTP"
                        value={otp}
                        isOtp={true}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        marginTop={10}
                        maxLength={4}
                      />
           )}
          
     </View>
        <MyCircle style={{}} color={themeColor.statusbar}  size={60} marginTop={20} >
                 <TouchableOpacity style={[styles.loginButton,{}]} onPress={handleLogin}>
                        {isLoading ? <ActivityIndicator size="small" color="#FFFFFF"/> :    <Icon
                                    source={theme === 'dark' ? require('../assets/ic_right_arrow.png') : require('../assets/ic_right_arrow.png')}
                                    size={30}
                                    tintColor={theme === 'dark' ? themeColor.white: themeColor.black}
                                  /> }
              </TouchableOpacity>

              </MyCircle>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  box: {
    width: '85%',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
  },
  loginButton: {
    width:60,
    height:60,
    justifyContent:'center',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
 
});
