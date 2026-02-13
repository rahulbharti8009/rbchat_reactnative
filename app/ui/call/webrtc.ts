import {
  RTCPeerConnection,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStreamTrack,
} from 'react-native-webrtc';
import MySocket from '../../utils/socket';
import InCallManager from 'react-native-incall-manager';


let pc: RTCPeerConnection | null = null;
let localStream: any = null;
let remoteStream: any = null;

const ICE_SERVERS = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export const createPeer = async (remoteUserId: string) => {
  const socket = MySocket.getInstance().getSocket();

  socket.off('ice-candidate');
  socket.off('answer');
  socket.off('offer');

  pc = new RTCPeerConnection(ICE_SERVERS);

  localStream = await mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  localStream.getTracks().forEach((track: MediaStreamTrack) => {
    pc!.addTrack(track, localStream);
  });

  InCallManager.start({ media: 'audio' });
  InCallManager.setSpeakerphoneOn(true);

  (pc as any).onicecandidate = (event: any) => {
    if (event.candidate) {
      socket.emit('ice-candidate', {
        to: remoteUserId,
        candidate: event.candidate,
      });
    }
  };

  (pc as any).ontrack = (event: any) => {
    remoteStream = event.streams[0];
    console.log('🔊 Remote stream received', event.streams);
  };

  socket.on('ice-candidate', async (candidate: any) => {
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });

  socket.on('answer', async (answer: any) => {
    if (pc) {
      await pc.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  });

  socket.on('offer', async (offer: any) => {
    if (!pc) return;

    await pc.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit('answer', {
      to: remoteUserId,
      answer,
    });
  });
};

export const startCall = async (remoteUserId: string) => {
  if (!pc) await createPeer(remoteUserId);

  const offer = await pc!.createOffer();
  await pc!.setLocalDescription(offer);

  MySocket.getInstance().getSocket().emit('offer', {
    to: remoteUserId,
    offer,
  });
};

export const endCall = () => {
  localStream?.getTracks().forEach((t: any) => t.stop());
  localStream = null;
  remoteStream = null;

  pc?.close();
  pc = null;

  InCallManager.stop();

  const socket = MySocket.getInstance().getSocket();
  socket.off('ice-candidate');
  socket.off('answer');
  socket.off('offer');
};


const toggleSpeaker = (on: boolean) => {
  InCallManager.setSpeakerphoneOn(on);
};