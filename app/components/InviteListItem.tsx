import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme } from 'react-native';
import DB from '../db/DBEntity';
import { Invite, User } from '../types/auth';
import { MyCircle } from '../common/MyCircle';
import { useTheme } from '../theme/ThemeContext';

export const InviteListItem: React.FC<{mobile? : string, user: Invite ,  onPress: (requestType: string) => void }> = ({mobile, user, onPress }) => {
    const scheme = useColorScheme(); // "light" or "dark"
    const { theme, toggleTheme, themeColor } = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: themeColor.listitem, justifyContent:'space-between'}]} >
    
          <View style={{flexDirection: 'row', alignItems:'center'}}>
            <MyCircle color={user.color}>
              <Text style={[styles.mobile, {color: themeColor.text}]}>{`${user.mobile.substring(0,1)}`}</Text>
            </MyCircle>
              
              <View style={{marginLeft:10}}>
                  {user?.name &&  <Text style={[styles.name, {color: themeColor.text}]}>{user?.name}</Text> }
                  <Text style={[styles.mobile, {color: themeColor.text}]}>{user.mobile === mobile ? `Self\n${user.mobile}` : `${user.mobile}`}</Text>
              </View>
          </View>

          <View style={{flexDirection: 'row', alignItems:'center'}}>
          <TouchableOpacity  style={[styles.request, {  backgroundColor: '#FF312E'}]} onPress={()=> onPress('REJECT')}  activeOpacity={0.7}>
            <Text style={[styles.mobile, {color: '#ffffff'}]}>{user.reject.toLocaleUpperCase()}</Text>
            </TouchableOpacity>

            <TouchableOpacity  style={[styles.request, {  backgroundColor: '#1A700D'}]} onPress={()=> onPress('ACCEPT')}  activeOpacity={0.7}>
            <Text style={[styles.mobile, {color: '#ffffff'}]}>{user.request_type.toLocaleUpperCase()}</Text>
            </TouchableOpacity>
          </View>
    </View>
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