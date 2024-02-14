import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import Dot from './Dot';
import styles from './Dot/styles';

class TypingAnimation extends React.Component {
  constructor(props) {
    super(props);

    const { dotAmplitude, dotSpeed, dotY } = props;
    this.state = {
      currentAnimationTime: 0,
    };

    this._animation = () => {
      this.setState((prevState) => ({
        y1: dotY + dotAmplitude * Math.sin(prevState.currentAnimationTime),
        y2: dotY + dotAmplitude * Math.sin(prevState.currentAnimationTime - 1),
        y3: dotY + dotAmplitude * Math.sin(prevState.currentAnimationTime - 2),
        currentAnimationTime: prevState.currentAnimationTime + dotSpeed,
      }));
      this.frameAnimationRequest = requestAnimationFrame(this._animation);
    };
    this.frameAnimationRequest = requestAnimationFrame(this._animation);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameAnimationRequest);
  }

  render() {
    const { dotStyles, style, show, dotColor, dotMargin, dotRadius, dotX } =
      this.props;
    if (!show) return null;
    return (
      <View
        style={{
          width: 120,
          height: 40,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Dot
          x={dotX - dotRadius - dotMargin}
          y={this.state.y1}
          radius={dotRadius}
          style={dotStyles}
          dotColor={dotColor}
        />
        <Dot
          x={dotX}
          y={this.state.y2}
          radius={dotRadius}
          style={dotStyles}
          dotColor={dotColor}
        />
        <Dot
          x={dotX + dotRadius + dotMargin}
          y={this.state.y3}
          radius={dotRadius}
          style={dotStyles}
          dotColor={dotColor}
        />
      </View>
    );
  }
}

TypingAnimation.defaultProps = {
  style: {},
  dotStyles: {},
  dotColor: 'black',
  dotMargin: 3,
  dotAmplitude: 3,
  dotSpeed: 0.15,
  show: true,
  dotRadius: 2.5,
  dotY: 6,
  dotX: 12,
};

TypingAnimation.propTypes = {
  style: PropTypes.object,
  dotStyles: PropTypes.object,
  dotColor: PropTypes.string,
  dotMargin: PropTypes.number,
  dotAmplitude: PropTypes.number,
  dotSpeed: PropTypes.number,
  show: PropTypes.bool,
  dotRadius: PropTypes.number,
  dotY: PropTypes.number,
  dotX: PropTypes.number,
};

export default TypingAnimation;
