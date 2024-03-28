import React, { Component } from 'react';
import { View, ViewStyle } from 'react-native';
import PropTypes from 'prop-types';

import Dot from './Dot';

interface TypingAnimationProps {
  style?: ViewStyle;
  dotStyles?: ViewStyle;
  dotColor?: string;
  dotMargin?: number;
  dotAmplitude?: number;
  dotSpeed?: number;
  show?: boolean;
  dotRadius?: number;
  dotY?: number;
  dotX?: number;
}

interface TypingAnimationState {
  currentAnimationTime: number;
  y1: number;
  y2: number;
  y3: number;
}

class TypingAnimation extends Component<
  TypingAnimationProps,
  TypingAnimationState
> {
  frameAnimationRequest: number;
  static propTypes: {
    style: PropTypes.Requireable<object>;
    dotStyles: PropTypes.Requireable<object>;
    dotColor: PropTypes.Requireable<string>;
    dotMargin: PropTypes.Requireable<number>;
    dotAmplitude: PropTypes.Requireable<number>;
    dotSpeed: PropTypes.Requireable<number>;
    show: PropTypes.Requireable<boolean>;
    dotRadius: PropTypes.Requireable<number>;
    dotY: PropTypes.Requireable<number>;
    dotX: PropTypes.Requireable<number>;
  };

  constructor(props: TypingAnimationProps) {
    super(props);

    const { dotAmplitude = 3, dotY = 6 } = props;
    this.state = {
      currentAnimationTime: 0,
      y1: dotY + dotAmplitude * Math.sin(0),
      y2: dotY + dotAmplitude * Math.sin(-1),
      y3: dotY + dotAmplitude * Math.sin(-2),
    };

    this.frameAnimationRequest = requestAnimationFrame(
      this._animation.bind(this)
    );
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameAnimationRequest);
  }

  _animation() {
    const { dotAmplitude = 3, dotSpeed = 0.15, dotY = 6 } = this.props;
    this.setState((prevState) => ({
      y1: dotY + dotAmplitude * Math.sin(prevState.currentAnimationTime),
      y2: dotY + dotAmplitude * Math.sin(prevState.currentAnimationTime - 1),
      y3: dotY + dotAmplitude * Math.sin(prevState.currentAnimationTime - 2),
      currentAnimationTime: prevState.currentAnimationTime + dotSpeed,
    }));
    this.frameAnimationRequest = requestAnimationFrame(
      this._animation.bind(this)
    );
  }

  render() {
    const {
      style,
      show = true,
      dotColor = 'black',
      dotMargin = 3,
      dotRadius = 2.5,
      dotX = 12,
    } = this.props;
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
          ...style,
        }}
      >
        <Dot
          x={dotX - dotRadius - dotMargin}
          y={this.state.y1}
          radius={dotRadius}
          dotColor={dotColor}
        />
        <Dot
          x={dotX}
          y={this.state.y2}
          radius={dotRadius}
          dotColor={dotColor}
        />
        <Dot
          x={dotX + dotRadius + dotMargin}
          y={this.state.y3}
          radius={dotRadius}
          dotColor={dotColor}
        />
      </View>
    );
  }
}

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
