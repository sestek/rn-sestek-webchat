import React from 'react';
import { Dimensions, View } from 'react-native';
import RenderHTML, {
  TNode,
  HTMLElementModel,
  HTMLContentModel,
} from 'react-native-render-html';
import Markdown from '../plugin/markdown';
import { FontSettings } from '../types/propsCustomizeConfiguration';

const NAMED_ENTITIES: Record<string, string> = {
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

const NAMED_ENTITY_PATTERN = new RegExp(
  Object.keys(NAMED_ENTITIES).join('|'),
  'g'
);
const HEX_ENTITY_PATTERN = /&#x([0-9A-Fa-f]+);/g;
const DEC_ENTITY_PATTERN = /&#(\d+);/g;
const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const decodeHTMLEntities = (text: string): string => {
  if (!text) return text;

  if (text.indexOf('&') === -1) return text;

  return text
    .replace(HEX_ENTITY_PATTERN, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(DEC_ENTITY_PATTERN, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10))
    )
    .replace(NAMED_ENTITY_PATTERN, (match) => NAMED_ENTITIES[match] ?? match);
};

const shouldRenderAsHTML = (text: string) => HTML_TAG_PATTERN.test(text);

const CUSTOM_HTML_ELEMENT_MODELS = {
  iframe: HTMLElementModel.fromCustomModel({
    tagName: 'iframe',
    contentModel: HTMLContentModel.block,
    mixedUAStyles: {
      width: '100%',
      height: '200px',
    },
  }),
};

const tagsStylesCache = new Map<string, any>();

const getTagsStyles = (fontSize: number, color: string) => {
  const key = `${fontSize}|${color}`;
  const cached = tagsStylesCache.get(key);
  if (cached) return cached;

  const commonStyles = {
    fontSize,
    color,
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
    a: { fontSize, color: 'blue' },
    span: commonStyles,
    div: commonStyles,
    ul: commonStyles,
    li: commonStyles,
    br: commonStyles,
    em: { fontSize },
  };

  tagsStylesCache.set(key, tagsStyles);
  return tagsStyles;
};

const useRenderContent = (
  text: string,
  messageColor: string | undefined,
  fontSettings: FontSettings | undefined,
  textType: string,
  WebView?: any
) => {
  const decodedText = decodeHTMLEntities(text);

  const renderMarkdown = (markdownText: string, type: string) => {
    return (
      <Markdown color={messageColor} fontSettings={fontSettings} textType={type}>
        {markdownText}
      </Markdown>
    );
  };

  const renderHTMLContent = (html: string, type: string) => {
    let fontSize = fontSettings?.descriptionFontSize || 13;
    if (type === 'title') fontSize = fontSettings?.titleFontSize || 18;
    if (type === 'subtitle') fontSize = fontSettings?.subtitleFontSize || 16;

    const tagsStyles = getTagsStyles(fontSize, messageColor || 'inherit');
    const formattedHtml = `<div>${html.replace(/\n/g, '<br/>')}</div>`;

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
          customHTMLElementModels={CUSTOM_HTML_ELEMENT_MODELS}
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
