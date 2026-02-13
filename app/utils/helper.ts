import { PermissionsAndroid, Platform } from "react-native";

export const randomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };


  const isDebug = true
  export const log=(tag: string, ...args: [])=> {
    if(isDebug){
      console.log(tag, args)
    }
  }

  export const time=(timestamp: number) => new Date(1768715307330).toLocaleTimeString('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

export const getLastTime = (timestamp: number): string => {
  if (!timestamp) return '';

  const msgDate = new Date(Number(timestamp));
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (msgDate.toDateString() === today.toDateString()) {
    return msgDate.toLocaleTimeString('en-IN', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
              })
  }

  if (msgDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return msgDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};


export const requestAudioPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'This app needs access to your microphone for audio calling.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};


