import React, { useContext } from 'react';
import { ImageBackground } from 'react-native';
import { styles } from '../modal/style';
import { GenerateBodyComponent } from '../../types/components/GenerateBodyComponent';
import { CustomizeConfigurationContext } from '../../context/CustomizeContext';

const GenerateBody = (props: GenerateBodyComponent) => {
  const context = useContext(CustomizeConfigurationContext);
  const {customizeConfiguration} =context
  const { BodyComponent } = props;
  return (
    <>
      {customizeConfiguration?.chatBody?.type == 'image' ? (
        <ImageBackground
          source={{ uri: customizeConfiguration?.chatBody?.value }}
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
