import React, { useEffect, useState } from 'react'
import { Props } from './HomeUI'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAppSelector } from '../redux/hook/hook'
import CustomHeader from '../components/CustomHeader'
import CustomProfileHeader from '../components/CustomProfileHeader'
import { RouteName } from '../utils/enum'
import { useDispatch } from 'react-redux'
import { login, logout } from '../redux/slice/authSlice'
import { useTheme } from '../theme/ThemeContext'
import AnimatedInput from '../components/AnimatedInput'
import ColorPicker from 'react-native-wheel-color-picker'
import { ProfilePayload } from '../utils/types'
import { postApi } from '../types/genericType'
import { User } from '../types/auth'
import { setLoginSave } from '../utils/localDB'

export const ProfileUI: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.auth.user)

  const { theme , themeColor } = useTheme();
  const [name, setName] = useState<string>(user?.name ?? '');
  const [mobile, setMobile] = useState<string>(user?.mobile ?? '');
  const [color, setColor] = useState<string>('#000000');
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.color && theme === 'light') {
      setColor(user.color);
    }
  } , [setColor]); 

  const onClick=()=> {
    dispatch(logout())
    navigation.reset({
      index: 0,
      routes: [{ name: RouteName.Login }],
    });
  }

  const handleProfile = async () => {
    try {
      const payload: ProfilePayload = {
        mobile: user?.mobile ?? '',
        name: name,
        color:  theme == 'dark' ? user?.color ?? color : color,
      };
      setLoading(prev => prev = true)
      const data = await postApi<User, ProfilePayload>(
        '/update_profile',
        payload
      );
        setLoading(prev => prev = false)

          if(data.status){
            await setLoginSave(data.value);
            
              dispatch(login(data.value));
                            // dispatch(logout());

              Alert.alert('Success', data.message);
          } 
    } catch (error) {
      console.log(error);
    }
  };

  return (
          <>
<CustomProfileHeader  title={`${RouteName.Profile}`} color={color} onClick={onClick}/>
                
 <ScrollView style={[styles.container, { backgroundColor: themeColor.background }]}>

  {/* Name */}
  <AnimatedInput
    label="👤 Name"
    marginTop={10}
    value={name}
    onChangeText={setName}
    maxLength={20}
  />

  {/* Mobile */}
  <AnimatedInput
    marginTop={10}
    label="📞 Mobile"
    value={user?.mobile}
    editable={false}
  />

  {/* Color Code */}
  <AnimatedInput
    marginTop={10}
    marginBottom={0}
    label="🎨 Selected Color"
    value={color}
    editable={false}
  />

  {/* Color Preview */}
  {/* <View style={[styles.colorPreview, { backgroundColor: color }]} /> */}

  {/* Color Picker */}
  <View style={styles.pickerWrapper}>
    <ColorPicker
      color={color}
      onColorChangeComplete={setColor} // ✅ IMPORTANT
      thumbSize={30}
      sliderSize={20}
      noSnap
      row={false}
      swatches
      swatchesLast
    />
  </View>
</ScrollView>
  {/* Save Button */}
  <TouchableOpacity
    style={[styles.saveButton,{ backgroundColor: theme == 'dark' ? themeColor.black : color}]}
    onPress={handleProfile}
    disabled={isLoading}
  >
    <Text style={styles.saveText}>
      {isLoading ? 'Saving...' : 'Save Profile'}
    </Text>
  </TouchableOpacity>
      
          </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '8%',
    paddingTop: 20,
  },

  pickerWrapper: {
    height: 260, // ✅ REQUIRED
  },

  colorPreview: {
    height: 50,
    width: '100%',
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  saveButton: {
        width: '80%',
        marginHorizontal: '10%',
        position:'absolute',
        bottom:20,
    backgroundColor: '#1A700D',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

