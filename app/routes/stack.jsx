import React,{useState, useEffect, use} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginUI } from '../ui/LoginUI';
import { HomeUI } from '../ui/HomeUI';
import { getLoginData } from '../utils/localDB';
import ChatHistoryUI  from '../ui/ChatHistory';
import { ThemeProvider } from '../theme/ThemeContext';
import AddGroupUI from '../ui/AddGroupUI';
import VideoCall from '../ui/VideoCall';
import { RouteName } from '../utils/enum';
import { UsersUI } from '../ui/UsersUI';
import { login } from '../redux/slice/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../redux/hook/hook';
import { ProfileUI } from '../ui/Profile';

const Stack = createNativeStackNavigator();

export const MyStack = () => {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = await getLoginData();
      if (savedUser) {
        dispatch(login(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;


  return (
    <NavigationContainer>
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right', }}
      initialRouteName={user != null ? RouteName.Home : RouteName.Login}
    >
      <Stack.Screen name={RouteName.Login} component={LoginUI} />
      <Stack.Screen name={RouteName.Home} component={HomeUI} />
      <Stack.Screen name={RouteName.Users} component={UsersUI}
       options={{ animation: 'slide_from_right',  gestureEnabled: true,
        gestureDirection: 'horizontal',}}  />
      <Stack.Screen name={RouteName.Profile} component={ProfileUI} />
      <Stack.Screen name={RouteName.ChatHistory} component={ChatHistoryUI} />
      <Stack.Screen name={RouteName.AddGroupUI} component={AddGroupUI} />
      <Stack.Screen name={RouteName.VideoCall} component={VideoCall} />
    </Stack.Navigator>
    </NavigationContainer>
  );
};
