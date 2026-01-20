import React, { useEffect, useState } from 'react'
import { Props } from './HomeUI'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View , PermissionsAndroid,Platform, Image } from 'react-native'
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
import { MyCircle } from '../common/MyCircle'
import { Icon } from '../common/ImageComp'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


export const ProfileUI: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.auth.user)
  const [image, setImage] = useState<string  | null>(null);

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

  const pickFromCamera = () => {
  launchCamera(
    {
      mediaType: 'photo',
      cameraType: 'front',
      quality: 0.8,
    },
    (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('Camera error:', response.errorMessage);
        return;
      }
      console.log('Camera Image:', response.assets?.[0]);
      const asset = response.assets?.[0];
      if (asset?.uri) {
        setImage(asset.uri);
      }
    }
  );
};

const pickFromGallery = () => {
  try{
  launchImageLibrary(
    {
      mediaType: 'photo',
      quality: 0.8,
    },
    (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('Gallery error:', response.errorMessage);
        return;
      }
      console.log('Gallery Image:', response.assets?.[0]);
      const asset = response.assets?.[0];
      if (asset?.uri) {
        setImage(asset.uri);
      }
    }
  );
    }catch(error){
            console.log('error Image:', error);
      }
};

 const requestCameraPermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ||
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);

    return (
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      (granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
        PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED)
    );
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const openPicker = async() => {
   const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert('Permission denied');
    return;
  }


  Alert.alert(
    'Select Photo',
    'Choose an option',
    [
      { text: 'Camera', onPress: pickFromCamera },
      { text: 'Gallery', onPress: pickFromGallery },
      { text: 'Cancel', style: 'cancel' },
    ],
    { cancelable: true }
  );
};

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

          if(data.status) {
            await setLoginSave(data.value);
              dispatch(login(data.value));
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
    <View style={{ alignItems: 'center' }}>
        <MyCircle color={user?.color} size={85}>
              <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      openPicker()
                      console.log('Profile clicked');
                    }}
                  >
                    <Icon
                      size={80}
                      source={
                              image
                                ? { uri: image }
                                : require('../assets/ic_profile.png')
                            }
                    />
              </TouchableOpacity>
        </MyCircle>


{/* <Image
  source={require('../assets/ic_send.gif')}
  style={{ width: 80, height: 80 }}
/> */}
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

