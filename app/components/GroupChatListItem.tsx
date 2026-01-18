import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { ChatUser } from '../utils/types';
import DB from '../db/DBEntity';
import { User } from '../types/auth';

export const GroupChatListItem: React.FC<{ user: User ,  onPress: () => void }> = ({ user, onPress }) => {
    const scheme = useColorScheme(); // "light" or "dark"
  
    const theme = {
      background: scheme === 'dark' ? '#121212' : '#FFFFFF',
      text: scheme === 'dark' ? '#FFFFFF' : '#000000',
      inputBackground: scheme === 'dark' ? '#1e1e1e' : '#ffffff',
      inputBorder: scheme === 'dark' ? '#444' : '#ccc',
      googleButtonBorder: scheme === 'dark' ? '#555' : '#ccc',
      googleButtonText: scheme === 'dark' ? '#eee' : '#444',
    };

  return (
    <TouchableOpacity style={[styles.container, {backgroundColor: theme.background}]} onPress={onPress}  activeOpacity={0.7}>
{/*     
      {user?.image ? <View style={{width: 50, height:50, backgroundColor: '#000000', borderRadius: 50}}></View> : 
      <Image
        source={{
          uri: user.image || 'https://fastly.picsum.photos/id/156/200/300.jpg?grayscale&hmac=wCa3cCa9XdO0BhZ6dri847io1fdHtTcU3EKEaxmlDTo',
        }}
        style={styles.avatar}
      />
      } */}
      
      <View style={styles.details}>
        <Text style={[styles.name, {color: theme.text}]}>{user.name || 'No Name'}</Text>
        <Text style={[styles.mobile, {color: theme.text}]}>{user.mobile == DB.mobile ? "Self" : user.mobile}</Text>
        {/* <Text style={[styles.time, {color: theme.text}]}>{user.online ?  "online" :""} </Text> */}

      </View>
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  details: {
    flex: 1,
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