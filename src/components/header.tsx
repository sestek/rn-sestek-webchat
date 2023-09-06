import React, { type FC } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import type { PropsHeaderComponent } from 'src/types';
import { MinusIcon, MultiplyIcon } from '../image';

const HeaderComponent: FC<PropsHeaderComponent> = (props) => {
  const CloseIcon = props.closeIcon;
  const HideIcon = props.hideIcon;
  return (
    <View style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            flex: 1,
            paddingTop: 8,
            paddingLeft: 10,
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,
          }}
        >
          {props.headerText}
        </Text>
      </View>
      <TouchableOpacity onPress={() => props.closeModal()}>
        {props.closeIcon ? <CloseIcon /> :
          <Image
            style={{ width: 20, height: 20, margin: 5 }}
            source={MinusIcon}
          />}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.clickClosedConversationModalFunc()}>
        {props.hideIcon ? <HideIcon /> :
          <Image
            style={{ width: 20, height: 20, margin: 5 }}
            source={MultiplyIcon}
          />
        }
      </TouchableOpacity>
    </View>
  );
};

HeaderComponent.defaultProps = {
  headerText: 'SESBOT',
};

export default HeaderComponent;
