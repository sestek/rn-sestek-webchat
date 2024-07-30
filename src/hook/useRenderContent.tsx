import React from 'react';
import { Dimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import Markdown from '../plugin/markdown';
import { FontSettings } from '../types/propsCustomizeConfiguration';

const useRenderContent = (
  text: string,
  messageColor: string | undefined,
  fontSettings: FontSettings | undefined,
  textType: string
) => {
  const shouldRenderAsHTML = (text: string) => {
    const htmlTagPattern = /<\/?[a-z][\s\S]*>/i; 
    return htmlTagPattern.test(text);
  };

  const renderMarkdown = (text: string, textType: string) => (
    <Markdown color={messageColor} fontSettings={fontSettings} textType={textType}>
      {text}
    </Markdown>
  );

  const renderHTMLContent = (html: string, textType: string) => {
    let fontSize = fontSettings?.descriptionFontSize || 13;
    if (textType === 'title') fontSize = fontSettings?.titleFontSize || 18;
    if (textType === 'subtitle')
      fontSize = fontSettings?.subtitleFontSize || 16;

    const commonStyles = {
      fontSize: fontSize,
      lineHeight: 20,
      color: messageColor || 'inherit',
    };

    const tagsStyles = {
      p: commonStyles,
      h1: commonStyles,
      h2: commonStyles,
      h3: commonStyles,
      h4: commonStyles,
      h5: commonStyles,
      h6: commonStyles,
      b: {
        fontSize: fontSize,
        lineHeight: 25,
      },
      i: commonStyles,
      a: {
        fontSize: fontSize,
        lineHeight: 25,
        color: 'blue',
      },
      span: commonStyles,
      div: commonStyles,
      ul: commonStyles,
      li: commonStyles,
      br: commonStyles,
      em:{
        fontSize: fontSize,
        lineHeight: 25,
      },
    };

    const formattedHtml = `<div>${html.replace(/\n/g, '<br/>')}</div>`;

    return (
      <RenderHTML
        contentWidth={Dimensions.get('window').width}
        source={{ html: formattedHtml }}
        tagsStyles={tagsStyles}
      />
    );
  };

  try {
    if (shouldRenderAsHTML(text)) {
      return renderHTMLContent(text, textType);
    }
    return renderMarkdown(text, textType);
  } catch (error) {
    return renderMarkdown(text, textType);
  }
};

export default useRenderContent;
