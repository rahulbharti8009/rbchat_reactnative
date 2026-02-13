import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';
import { RouteName } from '../utils/enum';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName.Login>;
};

const tag = 'DemoUI'
export const DemoUI: React.FC<Props> = ({ navigation }) => {
  const [count  , setCount] = useState<number>(0);  
// mounted
  useEffect(() => {   
    console.log(tag,'mounted');
    },[])
//update
  useEffect(() => {   
    console.log(tag,'updated');
    },[count])

//willUnmopunt cleanup
    useEffect(()=> {
      const time = setInterval(()=> {},1000)
      console.log(tag,'unmount cleanup');
      return ()=> clearInterval(time)
    },[])

//  focus and unfocus 
    useFocusEffect(
      React.useCallback(() => {
        console.log(tag,"Screen focused");
    
        return () => {
          console.log(tag,"Screen unfocused");
        };
      }, [])
    );

  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <TouchableOpacity onPress={()=> {
           navigation.goBack();
        }}>
          <Text>{tag}</Text>
         </TouchableOpacity>
        </View>
     );  
}