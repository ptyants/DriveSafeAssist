import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

const CirclePercent = ({ percent, radius, strokeWidth }) => {
  const diameter = radius * 2;
  const circumference = Math.PI * diameter;
  const progressValue = (percent / 100) * circumference;

  // Calculate coordinates for the arc endpoint
  const x = radius + Math.cos((2 * Math.PI * percent) / 100) * radius;
  const y = radius + Math.sin((2 * Math.PI * percent) / 100) * radius;

  return (
    <View style={{ aspectRatio: 1, width: diameter, height: diameter }}>
      <Svg width={diameter} height={diameter}>
        {/* Draw the background circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke="#ddd"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Draw the progress arc */}
        <Path
          d={`M${radius},${strokeWidth / 2} 
              A${radius - strokeWidth / 2},${radius - strokeWidth / 2} 0 ${
            percent > 50 ? 1 : 0
          },1 ${x},${y}`}
          stroke="#007bff"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
      </Svg>
    </View>
  );
};

export default CirclePercent;
