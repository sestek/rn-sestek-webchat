import React, { FC, useState, useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  PermissionsAndroid,Platform
} from 'react-native';
import type { PropsFooterComponent } from 'src/types';
import { styles } from './style';
import { Recorder } from '../../services';
import RenderImage from '../renderImage';
import { useCustomizeConfiguration } from '../../context/CustomizeContext';
import { useModules } from '../../context/ModulesContext';
import AttachmentDropdown from '../attachmentDropdown';
import { FolderIcon, PhotoIcon, CameraIcon } from '../../image';
import { useCustomAction } from '../../context/CustomActionContext';

const FooterComponent: FC<PropsFooterComponent> = (props) => {
  const { customizeConfiguration, getTexts } = useCustomizeConfiguration();
  const texts = getTexts();
  const [enableAttachmentIcon, setEnableAttachmentIcon] =
    useState<boolean>(false);
  const { globalCustomAction } = useCustomAction();

  const { modules } = useModules();

  const {
    sendAudio,
    sendAttachment,
    inputData,
    sendMessage,
    changeInputData,
    scrollViewRef,
    isDropdownVisible,
    setDropdownVisible,
  } = props;

  const {
    bottomVoiceIcon,
    bottomVoiceStopIcon,
    bottomVoiceDisabledIcon,
    bottomAttachmentIcon,
    bottomSendIcon,
    permissionAudioCheck,
    bottomInputBorderColor,
    bottomInputBackgroundColor,
    bottomInputSendButtonColor,
  } = customizeConfiguration;

  const Record =
    modules?.AudioRecorderPlayer && modules?.RNFS
      ? new Recorder(
          modules?.AudioRecorderPlayer,
          modules?.RNFS,
          modules?.Record
        )
      : undefined;

  const [recorder] = useState<Recorder | undefined>(Record);
  const [recordStart, setRecordStart] = useState<boolean>(false);
  const [disableRecord, setDisableRecord] = useState<boolean>(false);
  async function requestCameraPermission(): Promise<boolean> {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera permission required',
          message: 'The app requires camera access.',
          buttonPositive: 'Okay',
          buttonNegative: 'Cancel',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Kamera izni verildi');
        return true;
      } else {
        console.log('Kamera izni reddedildi');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  useEffect(() => {
    if (globalCustomAction === 'true') {
      setEnableAttachmentIcon(true);
    } else {
      setEnableAttachmentIcon(false);
    }
  }, [globalCustomAction]);
  const triggerRecord = async () => {
    if (disableRecord) {
      return;
    }

    if (recordStart) {
      setDisableRecord(true);
      var result = await recorder?.onStopRecord();
      const dirFile = result?.url?.split('/');
      if (dirFile) {
        sendAudio &&
          sendAudio(result?.url, dirFile[dirFile.length - 1], result?.data);
        setTimeout(() => {
          setDisableRecord(false);
        }, 3500);
      }
    } else {
      recorder?.onStartRecord();
    }
    setRecordStart((old) => !old);
  };

  const clickSendButton = () => {
    if (!inputData) return;
    sendMessage && sendMessage({ message: inputData && inputData });
    changeInputData && changeInputData('');
  };

  const touchRecord = () => {
    if (permissionAudioCheck) {
      permissionAudioCheck().then(() => triggerRecord());
    } else {
      triggerRecord();
    }
  };

  const openAttachmentMenu = () => {
    const availableOptions = [];

    // if (modules?.camera) availableOptions.push('camera');
    if (modules?.launchImageLibrary) availableOptions.push('gallery');
    if (modules?.RNFileSelector) availableOptions.push('document');

    if (availableOptions.length === 1) {
      handleSelect(availableOptions[0]);
    } else {
      setDropdownVisible(true);
    }
  };

  const handleSelect = async (optionKey: string) => {
    setDropdownVisible(false);
    setTimeout(async() => {
      if (optionKey === 'document') {
        sendAttachment('document');
      } else if (optionKey === 'gallery') {
        sendAttachment('gallery');
      } else if (optionKey === 'camera') {
        if (Platform.OS === 'android') {
          const hasPermission = await requestCameraPermission();
          if (hasPermission) {
            sendAttachment('camera');
          }
        } else if (Platform.OS === 'ios') {
          sendAttachment('camera');
        }
      }
    }, 100);
  };

  const availableOptions = [
    modules?.RNFileSelector && {
      key: 'document',
      label: texts.addFile,
      icon: FolderIcon,
    },
    modules?.launchImageLibrary && {
      key: 'gallery',
      label: texts.addPhoto,
      icon: PhotoIcon,
    },

    modules?.launchcamera && {
      key: 'camera',
      label: texts.addCamera,
      icon: CameraIcon,
    },
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: bottomInputBorderColor,
              borderTopRightRadius: recorder ? 0 : 10,
              borderBottomRightRadius: recorder ? 0 : 10,
              borderRightWidth: recorder ? 0 : 1,
              backgroundColor: bottomInputBackgroundColor,
            },
          ]}
          onFocus={() => {
            setTimeout(() => {
              scrollViewRef?.current?.scrollToEnd({ animated: true });
            }, 250);
          }}
          value={inputData && inputData}
          onChangeText={(text: string) =>
            changeInputData && changeInputData(text)
          }
          placeholder={texts.bottomInputText}
          placeholderTextColor="grey"
          keyboardType="default"
        />
        {(modules?.RNFileSelector ||
          modules?.launchImageLibrary ||
          modules?.launchcamera) &&
          enableAttachmentIcon && (
            <TouchableOpacity
              onPress={openAttachmentMenu}
              style={[
                styles.iconContainer,
                {
                  borderColor: bottomInputBorderColor,
                  backgroundColor: bottomInputBackgroundColor,
                },
              ]}
            >
              <RenderImage
                type={bottomAttachmentIcon?.type}
                value={bottomAttachmentIcon?.value}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}

        {modules?.AudioRecorderPlayer && modules?.RNFS && (
          <TouchableOpacity
            onPress={() => touchRecord()}
            style={styles.iconContainer}
          >
            {recordStart ? (
              <RenderImage
                type={bottomVoiceStopIcon?.type}
                value={bottomVoiceStopIcon?.value}
                style={styles.icon}
              />
            ) : disableRecord ? (
              <RenderImage
                type={bottomVoiceDisabledIcon?.type}
                value={bottomVoiceDisabledIcon?.value}
                style={styles.icon}
              />
            ) : (
              <RenderImage
                type={bottomVoiceIcon?.type}
                value={bottomVoiceIcon?.value}
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={clickSendButton}
        style={[
          styles.sendButton,
          { backgroundColor: bottomInputSendButtonColor },
        ]}
      >
        <RenderImage
          type={bottomSendIcon?.type}
          value={bottomSendIcon?.value}
          style={styles.sendIcon}
        />
      </TouchableOpacity>
      <AttachmentDropdown
        isVisible={isDropdownVisible}
        onSelect={handleSelect}
        onClose={() => setDropdownVisible(false)}
        options={availableOptions}
      />
    </View>
  );
};

export default FooterComponent;
