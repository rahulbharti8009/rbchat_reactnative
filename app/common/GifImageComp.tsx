import React from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  ImageSourcePropType,
  View,
} from 'react-native';

interface GifIconProps {
  source: ImageSourcePropType;
  size?: number;
  radius?: number;
  padding?: number;
  margin?: number;
  borderWidth?: number;
  style?: StyleProp<ImageStyle>;
}

export const GifIcon: React.FC<GifIconProps> = ({
  source,
  size = 24,
  radius = 12,
  padding = 3,
  margin = 0,
  borderWidth = 0,
  style,
}) => {
  return (
    <View
      style={{
        padding,
        margin,
        borderRadius: radius,
        borderWidth,
      }}
    >
      <Image
        source={source}
        resizeMode="contain"
        style={[
          {
            width: size,
            height: size,
            borderRadius: radius,
          },
          style,
        ]}
      />
    </View>
  );
};
