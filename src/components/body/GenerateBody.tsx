import React, { useContext } from 'react';
import { ImageBackground } from 'react-native';
import { StyleContext } from '../../context/StyleContext';
import { styles } from '../modal-style';
import { GenerateBodyComponent } from '../../types/components/GenerateBodyComponent';

const GenerateBody = (props: GenerateBodyComponent) => {
  const { appStyle } = useContext(StyleContext);
  const { BodyComponent } = props;
  return (
    <>
      {appStyle?.chatBody?.type == 'image' ? (
        <ImageBackground
          source={{ uri: appStyle?.chatBody?.value }}
          style={styles.imageBackground}
          resizeMode="stretch"
        >
          {BodyComponent && BodyComponent}
        </ImageBackground>
      ) : (
        BodyComponent
      )}
    </>
  );
};

export default GenerateBody;
