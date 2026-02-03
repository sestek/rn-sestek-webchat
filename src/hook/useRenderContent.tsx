import React from 'react';
import { Dimensions, View } from 'react-native';
import RenderHTML, {
  TNode,
  HTMLElementModel,
  HTMLContentModel,
} from 'react-native-render-html';
import Markdown from '../plugin/markdown';
import { FontSettings } from '../types/propsCustomizeConfiguration';

const decodeHTMLEntities = (text: string): string => {
  if (!text) return text;

  let decoded = text.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => {
    const codePoint = parseInt(hex, 16);
    return String.fromCodePoint(codePoint);
  });

  decoded = decoded.replace(/&#(\d+);/g, (_, dec) => {
    const codePoint = parseInt(dec, 10);
    return String.fromCodePoint(codePoint);
  });

  const namedEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&cent;': '¢',
    '&hearts;': '♥',
    '&diams;': '♦',
    '&clubs;': '♣',
    '&spades;': '♠',
  };

  Object.entries(namedEntities).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  });

  return decoded;
};

const useRenderContent = (
  text: string,
  messageColor: string | undefined,
  fontSettings: FontSettings | undefined,
  textType: string,
  WebView?: any
) => {
  const decodedText = decodeHTMLEntities(text);

  const shouldRenderAsHTML = (text: string) => {
    const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;
    return htmlTagPattern.test(text);
  };

  const renderMarkdown = (text: string, textType: string) => {
    return (
      <Markdown
        color={messageColor}
        fontSettings={fontSettings}
        textType={textType}
      >
        {text}
      </Markdown>
    );
  };

  const renderHTMLContent = (html: string, textType: string) => {
    let fontSize = fontSettings?.descriptionFontSize || 13;
    if (textType === 'title') fontSize = fontSettings?.titleFontSize || 18;
    if (textType === 'subtitle')
      fontSize = fontSettings?.subtitleFontSize || 16;

    const commonStyles = {
      fontSize: fontSize,
      color: messageColor || 'inherit',
      marginTop: 10,
      marginBottom: 10,
    };

    const tagsStyles = {
      p: commonStyles,
      h1: commonStyles,
      h2: commonStyles,
      h3: commonStyles,
      h4: commonStyles,
      h5: commonStyles,
      h6: commonStyles,
      b: { fontSize },
      i: commonStyles,
      a: {
        fontSize: fontSize,
        color: 'blue',
      },
      span: commonStyles,
      div: commonStyles,
      ul: commonStyles,
      li: commonStyles,
      br: commonStyles,
      em: { fontSize },
    };

    const formattedHtml = `<div>${html.replace(/\n/g, '<br/>')}</div>`;
    const customHTMLElementModels = {
      iframe: HTMLElementModel.fromCustomModel({
        tagName: 'iframe',
        contentModel: HTMLContentModel.block,
        mixedUAStyles: {
          width: '100%',
          height: '200px',
        },
      }),
    };

    const renderers = {
      iframe: ({ tnode }: { tnode: TNode }) => {
        const src = tnode.attributes.src;
        const width = parseInt(tnode.attributes.width || '0', 10);
        const height = parseInt(tnode.attributes.height || '0', 10);

        const maxWidth = Dimensions.get('window').width;
        const maxHeight = 400; // Define a maximum height

        const calculatedWidth =
          width > maxWidth || width === 0 ? maxWidth : width;
        const calculatedHeight =
          height > maxHeight || height === 0 ? maxHeight : height;

        if (!src) {
          console.warn('iframe src is missing');
          return null;
        }
        return (
          <WebView
            source={{ uri: src }}
            style={{ height: calculatedHeight, width: calculatedWidth }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            scrollEnabled={false} // Disable scrolling
            onShouldStartLoadWithRequest={(request: any) => {
              // Prevent navigation to other URLs
              return request.url === src;
            }}
          />
        );
      },
    };

    return (
      <View>
        <RenderHTML
          contentWidth={Dimensions.get('window').width}
          source={{ html: formattedHtml }}
          tagsStyles={tagsStyles}
          customHTMLElementModels={customHTMLElementModels}
          renderers={renderers}
        />
      </View>
    );
  };

  try {
    if (shouldRenderAsHTML(decodedText)) {
      return renderHTMLContent(decodedText, textType);
    }
    return renderMarkdown(decodedText, textType);
  } catch (error) {
    console.error('Error rendering content:', error);
    return renderMarkdown(decodedText, textType);
  }
};

export default useRenderContent;
