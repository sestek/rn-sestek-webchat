import React from 'react';
import { View, ViewStyle } from 'react-native';
import PropTypes from 'prop-types';

interface DotProps {
  x?: number;
  y?: number;
  radius?: number;
  dotStyles?: ViewStyle;
  dotColor?: string;
}

const getStyles = ({
  x = 0,
  y = 0,
  radius = 0,
  dotColor = 'black',
}: DotProps): ViewStyle => ({
  left: x - 13,
  top: y,
  width: radius * 2,
  height: radius * 2,
  borderRadius: radius,
  backgroundColor: dotColor,
});

const Dot: React.FC<DotProps> = (props) => (
  <View style={[props.dotStyles, getStyles(props)]} />
);

Dot.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  radius: PropTypes.number,
  dotStyles: PropTypes.object,
  dotColor: PropTypes.string,
};

export default Dot;
