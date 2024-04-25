import React, { useContext, type FC, useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import type { PropsHeaderComponent } from '../../types';
import { MinusIcon, MultiplyIcon } from '../../image';
import { StyleContext } from '../../context/StyleContext';
import { styles } from './style';
import useCheckBackground from '../../hook/useCheckBackground';
import RenderImage from '../renderImage';

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
  const { headerAlignmentType } = props.customizeConfiguration;

  const HeaderText = () => {
    return (
      <View
        style={[
          styles.headerTextContainer,
          headerAlignmentType === 'textToLeft' && {
            flex: 1,
            flexDirection: 'row',
          },
        ]}
      >
        <Text style={[styles.headerText, { color: appStyle?.headerTextColor }]}>
          {headerText ?? HeaderComponent.defaultProps?.headerText!}
        </Text>
      </View>
    );
  };
  return (
    <View
      style={[
        styles.headerContainer,
        headerAlignmentType === 'textToRight' && {
          flexDirection: 'row-reverse',
        },
      ]}
    >
      {headerAlignmentType !== 'textToCenter' && <HeaderText />}
      <View
        style={[
          { flexDirection: 'row' },
          headerAlignmentType === 'textToCenter' && {
            flex: 1,
            justifyContent: 'space-between',
          },
          headerAlignmentType === 'textToRight' && {
            flex: 1,
            flexDirection: 'row-reverse',
            justifyContent: 'flex-end',
          },
        ]}
      >
        <TouchableOpacity onPress={() => hideModal()} style={styles.center}>
          {hideIcon ? (
           <RenderImage type={hideIcon.type} value={hideIcon.value} style={styles.imageIcon}/>
          ) : (
            <Image style={styles.hideDefaultIcon} source={MinusIcon} />
          )}
        </TouchableOpacity>
        {headerAlignmentType === 'textToCenter' && <HeaderText />}
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
           <RenderImage type={closeIcon.type} value={closeIcon.value} style={headerAlignmentType === 'textToRight'  ? styles.imageIcon : styles.closeTextToCenterIcon}/>
          ) : (
            <Image style={styles.closeDefaultIcon} source={MultiplyIcon} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

HeaderComponent.defaultProps = {
  headerText: 'SESBOT',
};

export default HeaderComponent;
