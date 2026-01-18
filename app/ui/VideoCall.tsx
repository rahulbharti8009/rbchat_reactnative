// VideoCall.tsx
import React, { useEffect, useRef, useState } from 'react';
import { RootStackParamList } from '../utils/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  RTCView,
  MediaStream,
} from 'react-native-webrtc';

import { View, Text, StyleSheet } from 'react-native';
import MySocket from '../utils/socket';

const ROOM_ID = 'demo-room';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

let pc: RTCPeerConnection;
let socket: any;

type VideoCall = RouteProp<RootStackParamList, 'VideoCall'>;

export default function VideoCall() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const remoteSocketId = useRef<string | null>(null);

 return(<>
 
 </>)

}