import React, { useContext, type FC, useEffect } from 'react';
import { AppState, Image, Text, TouchableOpacity, View } from 'react-native';
import type { PropsHeaderComponent } from 'src/types';
import { MinusIcon, MultiplyIcon } from '../image';
import { StyleContext } from '../context/StyleContext';
import { styles } from './header-styles';

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
  useEffect(() => {
    // c-hook
    if (defaultConfiguration.getResponseData) {
      defaultConfiguration.getResponseData({ isBackground: false });
    }
    const handleChange = (nextAppState: any) => {
      if (nextAppState === 'background') {
        if (defaultConfiguration.getResponseData) {
          defaultConfiguration.getResponseData({ isBackground: true });
        }
      } else if (nextAppState === 'active') {
        if (defaultConfiguration.getResponseData) {
          defaultConfiguration.getResponseData({ isBackground: false });
        }
      }
    };
    AppState?.addEventListener('change', handleChange);
  }, []);
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
