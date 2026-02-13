// src/call/CallScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { startCall, endCall } from './call/webrtc.ts'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../utils/types.ts';
import { RouteName } from '../utils/enum.ts';
import { requestAudioPermission } from '../utils/helper.ts';

const REMOTE_USER_ID = 'USER_2_SOCKET_ID';
type ChatRouteProp = RouteProp<
  RootStackParamList,
  RouteName.ChatHistory
>;
const AudioUI = () => {
    const route = useRoute<ChatRouteProp>();
    const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`🎧 Audio Call to ${user.name} - ${user.mobile}`}</Text>

      <TouchableOpacity
        style={styles.callBtn}
        onPress={async() => {
          const hasPermission = await requestAudioPermission();
            if (!hasPermission) {
              Alert.alert('Permission required', 'Microphone permission is required.');
              return;
            }

          startCall(user.mobile)}}
      >
        <Text style={styles.text}>Start Call</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.endBtn}
        onPress={endCall}
      >
        <Text style={styles.text}>End Call</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AudioUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    marginBottom: 40
  },
  callBtn: {
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 50,
    marginBottom: 20
  },
  endBtn: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 50
  },
  text: {
    color: '#fff',
    fontSize: 16
  }
});
