import React, { type FC, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { PropsHeaderComponent } from '../../types';
import { styles } from './style';
import useCheckBackground from '../../hook/useCheckBackground';
import RenderImage from '../renderImage';
import { useCustomizeConfiguration } from '../../context/CustomizeContext';
import { Back } from '../../image';

const HeaderComponent: FC<PropsHeaderComponent> = (props) => {
  const {
    closeIcon,
    hideIcon,
    clickClosedConversationModalFunc,
    hideModal,
    closeModalStatus,
    closeConversation,
    defaultConfiguration,
    onToggleInfo,
    isInfoVisible,
  } = props;
  const { customizeConfiguration, getTexts } = useCustomizeConfiguration();
  const texts = getTexts();
  const [showInfoBadge, setShowInfoBadge] = useState<boolean>(true);

  const {
    headerAlignmentType,
    headerTextStyle,
    infoArea,
    infoAreaIcon,
  } = customizeConfiguration;

  const { background } = useCheckBackground();
  const isRight = headerAlignmentType === 'textToRight';
  const isCenter = headerAlignmentType === 'textToCenter';

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
          styles.titleWrap,
          isRight && styles.titleWrapReverse,
          isCenter && { flex: 1, justifyContent: 'center' },
        ]}
      >
        {infoArea && infoAreaIcon?.value ? (
          <TouchableOpacity
            onPress={() => {
              if (showInfoBadge) setShowInfoBadge(false);
              onToggleInfo();
            }}
            style={[
              styles.infoIconTouch,
              isRight && styles.infoIconTouchReverse,
            ]}
             hitSlop={{ top: 6, bottom: 8, left: 8, right: 7 }}
          >
            <RenderImage
              type={infoAreaIcon.type}
              value={isInfoVisible ? Back : infoAreaIcon.value}
              style={styles.infoIcon}
            />
            {showInfoBadge && !isInfoVisible && (
              <View style={styles.infoBadge} />
            )}
          </TouchableOpacity>
        ) : null}
        <Text style={headerTextStyle}>{texts.headerText}</Text>
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
        <TouchableOpacity onPress={() => hideModal()} style={styles.iconTouch}>
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
          style={styles.iconTouch}
        >
          <RenderImage
            type={closeIcon?.type}
            value={closeIcon?.value}
            style={
              headerAlignmentType === 'textToRight'
                ? styles.imageIcon
                : styles.imageIcon
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderComponent;
