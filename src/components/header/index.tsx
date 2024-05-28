import React, { type FC, useEffect } from 'react';
import {Text, TouchableOpacity, View } from 'react-native';
import type { PropsHeaderComponent } from '../../types';
import { styles } from './style';
import useCheckBackground from '../../hook/useCheckBackground';
import RenderImage from '../renderImage';
import { useCustomizeConfiguration } from '../../context/CustomizeContext';

const HeaderComponent: FC<PropsHeaderComponent> = (props) => {
  const {
    closeIcon,
    hideIcon,
    clickClosedConversationModalFunc,
    hideModal,
    closeModalStatus,
    closeConversation,
    defaultConfiguration,
  } = props;

  const { customizeConfiguration, getTexts } = useCustomizeConfiguration();
  const texts = getTexts();

  const { headerAlignmentType, headerTextColor } = customizeConfiguration;

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
        <Text style={[styles.headerText, { color: headerTextColor }]}>
          {texts.headerText}
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
          <RenderImage
            type={hideIcon?.type}
            value={hideIcon?.value}
            style={styles?.imageIcon}
          />
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
            <RenderImage
              type={closeIcon?.type}
              value={closeIcon?.value}
              style={
                headerAlignmentType === 'textToRight'
                  ? styles.imageIcon
                  : styles.closeTextToCenterIcon
              }
            />
          
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderComponent;
