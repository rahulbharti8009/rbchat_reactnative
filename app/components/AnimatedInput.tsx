import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAppSelector } from '../redux/hook/hook';

type AnimatedInputProps = TextInputProps & {
    label: string;
    marginTop?: number;
    marginBottom?:number;
    isOtp?: boolean;
    disabled?: boolean;
    bgcolor?: string;

};

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
  marginTop = 0,
  marginBottom = 18,
  disabled = false,
  isOtp = false,
  ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const user = useAppSelector((state) => state.auth.user)
    const {theme, themeColor } = useTheme();
    

  const animatedValue = useRef<Animated.Value>(
    new Animated.Value(value ? 1 : 0)
  ).current;

  const [typedLabel, setTypedLabel] = useState('');
  /* ✍️ Typing animation */
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedLabel(label.slice(0, index + 1));
      index++;
      if (index === label.length) clearInterval(interval);
    }, 40); // typing speed

    return () => clearInterval(interval);
  }, [label]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: value ? 0 : 12,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -23],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: '#777',
    paddingHorizontal: 4,
  };

  return (
    <View style={[styles.wrapper,{ marginTop: marginTop, marginBottom : marginBottom }]}>
      <Animated.Text style={[labelStyle,{fontSize:14}]}>
        {typedLabel}
      </Animated.Text>

      <TextInput
        value={value}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={isOtp}
        autoFocus={true} 
        textContentType="oneTimeCode"
        style={[styles.input,{ borderColor: isFocused ? user?.color != null ? user?.color : themeColor.navbar : '#B0B0B0' , textAlign: value ? 'center' : 'left' , color: themeColor.text
    }]}
        {...props}
      />
    </View>
  );
};

export default AnimatedInput;
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
