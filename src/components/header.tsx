import React, { useContext, type FC, useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import type { PropsHeaderComponent } from 'src/types';
import { MinusIcon, MultiplyIcon } from '../image';
import { StyleContext } from '../context/StyleContext';
import { styles } from './header-styles';
import useCheckBackground from '../hook/useCheckBackground';

const HeaderComponent: FC<PropsHeaderComponent> = (props) => {
  const {
    closeIcon,
    hideIcon,
    clickClosedConversationModalFunc,
    hideModal,
    headerText,
    closeModalStatus,
    closeConversation,
    defaultConfiguration,
  } = props;
  const { appStyle } = useContext(StyleContext);
  const { background } = useCheckBackground();

  useEffect(() => {
    if (defaultConfiguration.getResponseData) {
      defaultConfiguration.getResponseData({ isBackground: false });
    }
  }, []);
  useEffect(() => {
    if (background) {
      if (defaultConfiguration.getResponseData) {
        defaultConfiguration.getResponseData({ isBackground: true });
      }
    } else if (background === false) {
      if (defaultConfiguration.getResponseData) {
        defaultConfiguration.getResponseData({ isBackground: false });
      }
    }
  }, [background]);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: appStyle?.headerTextColor }]}>
          {headerText ?? HeaderComponent.defaultProps?.headerText!}
        </Text>
      </View>
      <TouchableOpacity onPress={() => hideModal()} style={styles.center}>
        {hideIcon ? (
          <Image style={styles.imageIcon} source={hideIcon.value} />
        ) : (
          <Image style={styles.hideDefaultIcon} source={MinusIcon} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (closeModalStatus) {
            clickClosedConversationModalFunc();
          } else {
            closeConversation();
          }
        }}
        style={styles.center}
      >
        {closeIcon ? (
          <Image style={styles.imageIcon} source={closeIcon.value} />
        ) : (
          <Image style={styles.closeDefaultIcon} source={MultiplyIcon} />
        )}
      </TouchableOpacity>
    </View>
  );
};

HeaderComponent.defaultProps = {
  headerText: 'SESBOT',
};

export default HeaderComponent;
