import React, { FC, useState, useContext } from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import type { PropsFooterComponent } from 'src/types';
import { styles } from './style';
import {
  RecordInIcon,
  RecordOutIcon,
  RecordDisable,
  SendIconWhite,
  Link,
} from '../../image';
import { Recorder } from '../../services';
import { StyleContext } from '../../context/StyleContext';
import { useLoading } from '../../context/LoadingContext';
import RenderImage from '../renderImage';
import { useLanguage } from '../../context/LanguageContext';
const FooterComponent: FC<PropsFooterComponent> = (props) => {
  const { getTexts } = useLanguage();
  const texts = getTexts();
  const RNFSModule = props.modules.RNFS;
  const RNFileSelector = props.modules.RNFileSelector;
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

  const { setLoading } = useLoading();
  const {
    modules,
    sendAudio,
    sendAttachment,
    inputData,
    sendMessage,
    changeInputData,
    customizeConfiguration,
    scrollViewRef,
  } = props;

  const {
    bottomVoiceIcon,
    bottomVoiceStopIcon,
    bottomVoiceDisabledIcon,
    bottomAttachmentIcon,
    bottomSendIcon,
    permissionAudioCheck,
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

  const { appStyle } = useContext(StyleContext);

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

  const convertToBase64 = async (uri: string): Promise<string | null> => {
    try {
      const fileBase64 = await RNFSModule.fs.readFile(uri, 'base64');
      return fileBase64;
    } catch (error) {
      console.error('Error converting file to base64:', error);
      return null;
    }
  };

  const pickDocument = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await RNFileSelector.pick({
          type: [RNFileSelector.types.allFiles],
        });
        resolve(res);
      } catch (err) {
        if (RNFileSelector.isCancel(err)) {
          reject(err);
        } else {
          reject(err);
        }
      }
    });
  };

  const readAndConvertPickDocument = async () => {
    pickDocument()
      .then((res: any) => {
        setLoading(true);
        const path =
          Platform.OS === 'android'
            ? res[0]?.uri
            : res[0]?.uri.replace('file://', '');
        const fileSizeBytes = res[0].size;
        if (fileSizeBytes < MAX_FILE_SIZE_BYTES) {
          convertToBase64(path)
            .then((data) => {
              sendAttachment && sendAttachment(res[0]?.uri, data);
            })
            .then(() => {
              setLoading(false);
            });
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: appStyle?.bottomInputBorderColor,
              borderTopRightRadius: recorder ? 0 : 10,
              borderBottomRightRadius: recorder ? 0 : 10,
              borderRightWidth: recorder ? 0 : 1,
              backgroundColor: appStyle?.bottomInputBackgroundColor,
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
      </View>
      {modules?.RNFileSelector && modules?.RNFS && (
        <TouchableOpacity
          onPress={readAndConvertPickDocument}
          style={[
            styles.AttachmentButton,
            {
              borderColor: appStyle?.bottomInputBorderColor,
              backgroundColor: appStyle?.bottomInputBackgroundColor,
            },
          ]}
        >
          {bottomAttachmentIcon ? (
            <RenderImage
              type={bottomAttachmentIcon.type}
              value={bottomAttachmentIcon.value}
              style={styles.AttachmentIcon}
            />
          ) : (
            <Image style={styles.AttachmentIcon} source={Link} />
          )}
        </TouchableOpacity>
      )}
      {modules?.AudioRecorderPlayer && modules?.RNFS && (
        <TouchableOpacity
          onPress={() => touchRecord()}
          style={[
            styles.audioButton,
            {
              borderRightWidth: 1,
              borderColor: appStyle?.bottomInputBorderColor,
              backgroundColor: appStyle?.bottomInputBackgroundColor,
            },
          ]}
        >
          {recordStart ? (
            bottomVoiceStopIcon ? (
              <RenderImage
                type={bottomVoiceStopIcon.type}
                value={bottomVoiceStopIcon.value}
                style={styles.MicButtonIcon}
              />
            ) : (
              <Image style={styles.MicButtonIcon} source={RecordInIcon} />
            )
          ) : disableRecord ? (
            bottomVoiceDisabledIcon ? (
              <RenderImage
                type={bottomVoiceDisabledIcon.type}
                value={bottomVoiceDisabledIcon.value}
                style={styles.MicButtonIcon}
              />
            ) : (
              <Image style={styles.MicButtonIcon} source={RecordDisable} />
            )
          ) : bottomVoiceIcon ? (
            <RenderImage
              type={bottomVoiceIcon.type}
              value={bottomVoiceIcon.value}
              style={styles.MicButtonIcon}
            />
          ) : (
            <Image style={styles.MicButtonIcon} source={RecordOutIcon} />
          )}
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={clickSendButton}
        style={[
          styles.sendButton,
          { backgroundColor: appStyle?.bottomInputSendButtonColor },
        ]}
      >
        {bottomSendIcon ? (
          <RenderImage
            type={bottomSendIcon.type}
            value={bottomSendIcon.value}
            style={styles.SendButtonIcon}
          />
        ) : (
          <Image style={styles.SendButtonIcon} source={SendIconWhite} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default FooterComponent;
