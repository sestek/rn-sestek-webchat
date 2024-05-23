import React, { FC, useState } from 'react';
import { Image } from 'react-native';
import { Error } from '../../image';

interface ExternalDataProps {
  type: 'url' | 'component' | undefined;
  value: number | string | React.ReactElement | React.ReactNode;
  style?: object;
}
const RenderImage: FC<ExternalDataProps> = (props) => {
  const { type, value, style } = props;

  const [isUriValid, setIsUriValid] = useState(true);

  const handleImageError = () => {
    setIsUriValid(false);
  };
  const imageSource = isUriValid
    ? typeof value === 'string'
      ? { uri: value }
      : value
    : Error;

  const isValidElement = React.isValidElement(value);

  const renderError = () => {
    return <Image style={style} source={Error} />;
  };

  if (type === 'url') {
    if (isValidElement) {
      return renderError();
    }
    return (
      <Image style={style} source={imageSource} onError={handleImageError} />
    );
  } else if (type === 'component') {
    if (!isValidElement) {
      return renderError()
    }
    return <>{value}</>;
  } else {
    return null;
  }
};

export default RenderImage;
