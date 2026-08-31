import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { merge, isEqual, isArray } from 'lodash';
import SimpleMarkdown from 'simple-markdown';
import styles from './styles';
import { FontSettings } from 'types/propsCustomizeConfiguration';
interface CustomToken {
  type: string;
  content?: string;
  target?: string;
  href?: string;
  title?: string;
  level?: number;
  text?: string;
  depth?: number;
  children?: CustomToken[];
}

interface MarkdownProps {
  enableLightBox?: boolean;
  navigator?: any;
  imageParam?: any;
  onLink?: any;
  bgImage?: any;
  onImageOpen?: any;
  onImageClose?: any;
  rules?: any;
  color?: string;
  style?: any;
  onLoad?: () => void;
  children: ReactNode;
  fontSettings: FontSettings | undefined;
  textType?: string;
}

const rulesCache = new Map<
  string,
  {
    parse: (source: string) => CustomToken[];
    renderer: (tree: CustomToken[]) => JSX.Element;
  }
>();

const isCacheable = (props: MarkdownProps) =>
  !props.enableLightBox &&
  !props.navigator &&
  !props.imageParam &&
  !props.onLink &&
  !props.bgImage &&
  !props.onImageOpen &&
  !props.onImageClose &&
  !props.rules &&
  !props.style;

const cacheKeyFor = (props: MarkdownProps) =>
  [
    props.color ?? '',
    props.textType ?? '',
    props.fontSettings?.titleFontSize ?? '',
    props.fontSettings?.subtitleFontSize ?? '',
    props.fontSettings?.descriptionFontSize ?? '',
  ].join('|');

class Markdown extends Component<MarkdownProps> {
  parse: (source: string) => CustomToken[];
  renderer: (tree: CustomToken[]) => JSX.Element;

  constructor(props: MarkdownProps) {
    super(props);
    if (props.enableLightBox && !props.navigator) {
      throw new Error(
        'props.navigator must be specified when enabling lightbox'
      );
    }

    const cacheable = isCacheable(props);
    const cacheKey = cacheable ? cacheKeyFor(props) : null;
    if (cacheKey !== null) {
      const cached = rulesCache.get(cacheKey);
      if (cached) {
        this.parse = cached.parse;
        this.renderer = cached.renderer;
        return;
      }
    }

    const opts = {
      enableLightBox: props.enableLightBox,
      navigator: props.navigator,
      imageParam: props.imageParam,
      onLink: props.onLink,
      bgImage: props.bgImage,
      onImageOpen: props.onImageOpen,
      onImageClose: props.onImageClose,
      rules: props.rules,
    };

    const titleFontSize = props?.fontSettings?.titleFontSize;

    let customMarkDownStyle = {
      ...styles,
      heading: {
        fontWeight: '200',
      },
      heading1: {
        fontSize: titleFontSize! + 12,
      },
      heading2: {
        fontSize: titleFontSize! + 6,
      },
      heading3: {
        fontSize: titleFontSize,
      },
      heading4: {
        fontSize: titleFontSize! - 2,
      },
      heading5: {
        fontSize: titleFontSize! - 5,
      },
      heading6: {
        fontSize: titleFontSize! - 9,
      },
    };
    const mergedStyles = merge(
      {},
      { ...customMarkDownStyle, text: { color: props.color, ...props.style } }
    );
    let rules = require('./rules')(
      mergedStyles,
      opts,
      props?.fontSettings,
      props?.textType
    );

    rules = merge({}, SimpleMarkdown.defaultRules, rules, opts.rules);

    const parser = SimpleMarkdown.parserFor(rules);
    this.parse = function (source: string) {
      const blockSource = source + '\n\n';
      return parser(blockSource, { inline: false }) as CustomToken[];
    };
    this.renderer = SimpleMarkdown.outputFor(rules, 'react' as any);

    if (cacheKey !== null) {
      rulesCache.set(cacheKey, {
        parse: this.parse,
        renderer: this.renderer,
      });
    }
  }

  componentDidMount() {
    if (this.props.onLoad) {
      this.props.onLoad();
    }
  }

  shouldComponentUpdate(nextProps: MarkdownProps) {
    return !isEqual(nextProps.children, this.props.children);
  }

  render() {
    const { children } = this.props;

    let child: string;
    if (typeof children === 'string') {
      child = children;
    } else if (isArray(children)) {
      child = children.join('');
    } else {
      child = '';
    }

    const tree = this.parse(child);

    return <View style={[styles.view]}>{this.renderer(tree)}</View>;
  }
}

export default Markdown;
