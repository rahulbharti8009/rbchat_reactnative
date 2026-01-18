import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChatHistoryPayload, ChatMessage, ChatUser, RootStackParamList } from '../utils/types';
import {
  Alert,
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import MySocket from '../utils/socket';
import { useTheme } from '../theme/ThemeContext';
import CustomChattingHeader from '../components/CustomChattingHeader';
import { useAppSelector } from '../redux/hook/hook';
import { RouteName } from '../utils/enum';
import { postApi } from '../types/genericType';

type ChatRouteProp = RouteProp<
  RootStackParamList,
  RouteName.ChatHistory
>;

/* ---------------- COMPONENT ---------------- */

const ChatHistoryUI = () => {
  const route = useRoute<ChatRouteProp>();
  const { user } = route.params;
  const auth = useAppSelector((state) => state.auth.user)
  const [isRecieverUnread, setIsRecieverUnread] = useState<boolean>(false);
  const mySocket = MySocket.getInstance();
  const socket = mySocket.getSocket();
  const [message, setMessage] = useState<string>('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const { theme, toggleTheme, themeColor } = useTheme();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  useFocusEffect(
    useCallback(() => {
      console.log('Component B is focused again');
      return () => {
        console.log('Component B lost focus');
      };
    }, [])
  );

    /* ---------------- LOAD CHAT HISTORY ---------------- */
  const handleChatHistory = async () => {
    try {
      const payload: ChatHistoryPayload = {
        name: `${auth?.mobile}-${user.mobile}`,
      };
      const data = await postApi<ChatMessage[], ChatHistoryPayload>(
        '/chat/history',
        payload
      );

          if(data.status){
            setChat(() =>  data.value);
          } 
        
    } catch (error) {
      console.log(error);
    }
  };
  /* ---------------- UNREAD / ONLINE STATUS ---------------- */

  const checkIsUnread=()=> {
    socket.emit(`unread`, {
      sender : auth?.mobile,
      reciever : user.mobile,
      isUnread: true
    });
  }

  useEffect(()=> {
    if(isRecieverUnread){
      checkIsUnread()
    }
  },[isRecieverUnread])

    /* ---------------- SOCKET LISTENERS ---------------- */

  useEffect(() => {
    handleChatHistory();
    const socketParams = `message${ user.mobile ==  undefined ? `${user?.name.toString()}-${user?.name.toString()}`: `${auth?.mobile}-${user.mobile.toString()}`}`;
    socket?.on(socketParams, (msg: ChatMessage) => {
      console.log('useEffect socket ', msg);
      setChat(prev => [...prev, msg]);
      // chat list
      socket.emit('getchatList', {
        mobile : user.mobile
      });
    });
// ======= unread =======
    checkIsUnread()
    socket?.on(`unread${auth?.mobile}`, (user: any) => {
      if(user != undefined){
        ToastAndroid.show(
          `Sender: ${user.sender}, Online: ${user.isUnread}`,
          ToastAndroid.SHORT
        );
      setIsRecieverUnread(()=> user.isUnread)

      }
    })

    return () => {
      socket?.off(socketParams);
      socket?.off(`unread${user.mobile}`)
    };
  }, [user.mobile]);

    /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = () => {
    if (!auth?.mobile || !message.trim()) return;

    const t = new Date();
    const date = `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`;

    let hours = t.getHours();
    const minutes = t.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const time = `${hours}:${minutes} ${ampm}`;
// Alert.alert(`${user.mobile}`,`${JSON.stringify(user)}`)
    const body: ChatMessage = {
      message: message.trim(),
      from: auth?.mobile.toString(),
      clientFrom: auth?.mobile,
      clientTo: user.mobile,
      date: date,
      time: time,
      isUnread:isRecieverUnread,
      fcmToken: '',
    };

    socket?.emit('user-message', body);

    setMessage(()=> '');
  };

    /* ---------------- AUTO SCROLL TO BOTTOM ---------------- */

    useEffect(() => {
      if (chat.length > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({
            animated: true,
          });
        }, 100);
      }
    }, [chat]);


  return (
    <View style={{ backgroundColor: themeColor.background   , width:'100%', height: '100%'}}>
      <CustomChattingHeader
        title={`${user.mobile}`} online={isRecieverUnread ? 'online': 'offline'}
      />

          <FlatList
              ref={flatListRef} 
              data={chat}
              style={{padding: 10}}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              keyExtractor={(_, index) => index.toString()}
              ListEmptyComponent={
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                  <Text style={{ color: themeColor.text, fontSize: 16 }}>
                    No chats available
                  </Text>
                </View>
              }
              renderItem={({ item, index }) => (
                <>
                  {(index === 0 || item.date !== chat[index - 1]?.date) && (
                    <Text
                      style={{
                        
                        alignSelf: 'center',
                        marginVertical: 4,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        backgroundColor: theme,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: 'gray',
                        color:  themeColor.text,
                        overflow: 'hidden',
                      }}
                    >
                      {item.date}
                    </Text>
                  )}
                  <View
                    style={{
                      alignSelf:
                        item.from === auth?.mobile
                          ? 'flex-end'
                          : 'flex-start',
                      backgroundColor:
                        item.from === auth?.mobile ? '#d1d1d1' : '#add8e6',
                      marginStart: item.from === auth?.mobile ? 40 : 5,
                      marginEnd: item.from === auth?.mobile ? 5 : 40,
                      marginVertical: 5,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Text>{item.message}</Text>
                    <Text style={{ fontSize: 10, color: 'gray' }}>
                      {item.time}
                    </Text>
                  </View>
                </>
              )}
            />
 
            <View
              style={{
                bottom: 0,
                marginHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 10,
                marginVertical: 10,
              }}
            >
              <TextInput
                placeholder="Type your message"
                value={message}
                onChangeText={setMessage}
                returnKeyType="send"        // shows "Send" key
                onSubmitEditing={sendMessage}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Enter') {
                    sendMessage;
                  }
                }}
                multiline
                style={{
                  maxHeight: 100,
                  color:  themeColor.text,
                  flex: 1,
                  paddingVertical: 8,
                  paddingRight: 10, // give space for the send icon
                }}
              />
              <TouchableOpacity onPress={sendMessage}>
                <Text
                  style={{ color: '#007AFF', fontWeight: '600', padding: 8 }}
                >
                  Send
                </Text>
              </TouchableOpacity>
            </View>
    </View>
  );
};

export default ChatHistoryUI;
