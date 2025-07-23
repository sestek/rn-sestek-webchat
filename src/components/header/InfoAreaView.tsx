import { useModules } from '../../context/ModulesContext';
import { useCustomizeConfiguration } from '../../context/CustomizeContext';
import useRenderContent from '../../hook/useRenderContent';
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

interface InfoAreaViewProps {
  markdown: string;
  background?: string;
}

export const InfoAreaView: React.FC<InfoAreaViewProps> = ({
  markdown,
  background = '#fff',
}) => {
  const { customizeConfiguration } = useCustomizeConfiguration();
    const { modules } = useModules();

  const WebView = modules?.RNWebView;

  const messageColor =
    customizeConfiguration?.chatBotMessageBoxTextColor || 'black';
  const renderContent = (text: string, textType: string) =>
    useRenderContent(
      text,
      messageColor,
      customizeConfiguration?.fontSettings,
      textType,
      WebView
    );
  return (
    <View style={[infoStyles.container, { backgroundColor: background }]}>
      <ScrollView contentContainerStyle={infoStyles.content}>
        {renderContent(markdown, 'title')}
      </ScrollView>
    </View>
  );
};

const infoStyles = StyleSheet.create({
  container: { flex: 1, width: '100%' },
  content: { padding: 16 },
});
