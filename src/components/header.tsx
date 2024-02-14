import React, { useContext, type FC } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import type { PropsHeaderComponent } from 'src/types';
import { MinusIcon, MultiplyIcon } from '../image';
import { StyleContext } from '../context/StyleContext';
import { styles } from './header-styles';

const HeaderComponent: FC<PropsHeaderComponent> = (props) => {
  const {
    closeIcon,
    hideIcon,
    clickClosedConversationModalFunc,
    closeModal,
    headerText,
    closeModalStatus,
    closeConversation,
  } = props;
  const { appStyle } = useContext(StyleContext);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: appStyle?.headerTextColor }]}>
          {headerText ?? HeaderComponent.defaultProps?.headerText!}
        </Text>
      </View>
      <TouchableOpacity onPress={() => closeModal()} style={styles.center}>
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
