import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Linking,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useModules } from '../../../context/ModulesContext';
import { useCustomizeConfiguration } from '../../../context/CustomizeContext';
import RenderImage from '../../renderImage';
import useRenderContent from '../../../hook/useRenderContent';

export default function FileMessages(props: any) {
  const { modules } = useModules();
  const { customizeConfiguration, getTexts } = useCustomizeConfiguration();
  const texts = getTexts();

  const renderContent = (text: string, textType: string) =>
    useRenderContent(
      text,
      customizeConfiguration?.chatBotMessageBoxTextColor,
      customizeConfiguration?.fontSettings,
      textType
    );
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: texts.filePTitle,
            message: texts.filePMessage,
            buttonNeutral: texts.filePNeutral,
            buttonNegative: texts.filePNegative,
            buttonPositive: texts.filePPositive,
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };
  const attachment = props.activity?.attachments?.[0];

  const handleDownloadAndViewFile = async () => {
    if (!attachment) {
      Alert.alert('Ek yok');
      return;
    }

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('İzin verilmedi, dosya açılamıyor.');
      return;
    }

    const contentKey = attachment.contentUrl;
    const cleanBaseURL = props.url.replace('/chathub', '');
    const url = `${cleanBaseURL}/file?tenantName=${props.defaultConfiguration.tenant}&key=${contentKey}&storageType=2`;

    const { config, fs } = modules.RNFS;
    const fileDir = fs.dirs.DocumentDir;

    try {
      const fileName = attachment.name || 'downloaded-file';
      const filePath = `${fileDir}/${fileName}`;

      const downloadResponse = await config({
        fileCache: true,
        path: filePath,
      }).fetch('GET', url, {
        'accept': '*/*',
        'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'user-agent': 'Mozilla/5.0',
      });

      if (downloadResponse.info().status === 200) {
        modules.fileViewer
          .open(filePath)
          .then(() => {
            console.log('Dosya başarıyla açıldı');
          })
          .catch((error: any) => {
            console.log('Dosya açma hatası:', error);
            if (
              error.message.includes('No app associated with this mime type')
            ) {
              Alert.alert(
                texts.noAppFoundTitle,
                texts.noAppFoundMessage,
                [
                  {
                    text: texts.noAppFoundCancel,
                    onPress: () => console.log('İptal tıklandı'),
                  },
                  {
                    text: 'Google Play',
                    onPress: () =>
                      Linking.openURL('market://search?q=doc viewer'),
                  },
                ],
                { cancelable: true }
              );
            } else {
              Alert.alert('Dosya açılamadı.');
            }
          });
      } else {
        throw new Error('Dosya indirilemedi.');
      }
    } catch (error) {
      console.error('Dosya indirme ve gösterme hatası:', error);
      Alert.alert('Dosya gösterilemedi.');
    }
  };
  const formatFileName = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');

    if (lastDotIndex === -1) return fileName;

    const namePart = fileName.substring(0, lastDotIndex);
    const extensionPart = fileName.substring(lastDotIndex);

    const shortenedName =
      namePart.length > 17 ? namePart.substring(0, 17) : namePart;

    return `${shortenedName}${extensionPart}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleDownloadAndViewFile}
        style={styles.fileContainer}
      >
        <RenderImage
          type={customizeConfiguration?.fileIcon?.type}
          value={customizeConfiguration?.fileIcon?.value}
          style={styles.icon}
        />
        {renderContent(
          attachment ? formatFileName(attachment.name) : 'FileNameNotFound',
          'subtitle'
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
});
