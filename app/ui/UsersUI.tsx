import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { ChatUser, RootStackParamList } from '../utils/types';
import { ChatListItem } from '../components/ChatListItem';
import { getLoginData } from '../utils/localDB';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MySocket from '../utils/socket';
import { useTheme } from '../theme/ThemeContext';
import { RouteName } from '../utils/enum';
import { UserListItem } from '../components/UserListItem';
import { useAppSelector } from '../redux/hook/hook';
import { usersApi } from '../api/service/authService';
import { User } from '../types/auth';
import CustomHeader from '../components/CustomHeader';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.Users>;
};
export const UsersUI: React.FC<Props> = ({ navigation }) => {
const tag = 'UsersUI';
const user = useAppSelector((state) => state.auth.user)
console.log(tag,user)
  const [users, setUsers] = useState<User[] | []>([]);
  const { theme, toggleTheme, themeColor } = useTheme();
  const [isUserList, setIsUserList] = useState(false)
  const mobile =  user?.mobile

  useFocusEffect(
    useCallback(() => {
      console.log(tag, `${tag} Component A is focused`);
      return () => {
        console.log('Component A lost focus');
      };
    }, [])
  );

  const handleUser = async () => {
    try {
      const data = await usersApi({
        mobile: user!!.mobile,
      });
  
      if (data.status) {
        setUsers(()=> data.value);
      } else {
        setUsers(()=> []);
      }
    } catch (error) {
      setUsers(()=> []);
      console.log(error);
    }
  };


  useEffect(() => {
    handleUser()
  }, []);

  return (
    <>      
    <CustomHeader isDashboard={false} title={`Users (${users.length})`} />

          <FlatList
              style={{ backgroundColor: themeColor.background }}
              data={users}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <UserListItem
                mobile={user?.mobile}
                  user={item}
                  onPress={() => {
                    const socket = MySocket.getInstance().getSocket();
                    if (!socket.connected) socket.connect();
                                  //add 
                        socket.emit('inviteuser', {
                          sender: user?.mobile,
                          reciever : item.mobile,
                          name : user?.name,
                          mobile : user?.mobile,
                          request_type: 'accept',
                          color: user?.color
                        });
                        // recieve 
                          const handleInviteUser = (data: User[]) => {
                          handleUser()
                          socket.emit('getInviteList', { mobile: item.mobile})
                          };
                          socket.on('invite_user', handleInviteUser);
                      
                    }
                  }
                />
              )}
            />
    </>
  );
};
