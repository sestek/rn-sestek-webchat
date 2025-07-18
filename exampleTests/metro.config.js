const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const pak = require('../package.json');
const root = path.resolve(__dirname, '..');

const moduleNames = [
  pak.name,                              // rn-sestek-webchat
  ...Object.keys(pak.peerDependencies || {}),
  '@babel/runtime'                       // <-- bunu ekliyoruz
];

module.exports = {
  projectRoot: __dirname,
  watchFolders: [ root ],
  resolver: {
    blockList: exclusionList(
      moduleNames.map(m =>
        new RegExp(`^${path.join(root, 'node_modules', m)}\\/.*$`)
      )
    ),
    extraNodeModules: moduleNames.reduce((acc, name) => {
      if (name === pak.name) {
        acc[name] = path.join(root, 'src');
      } else {
        // önce exampleTests/node_modules, yoksa root/node_modules
        acc[name] = path.join(
          __dirname,
          'node_modules',
          name
        );
      }
      return acc;
    }, {}),
    sourceExts: ['js','jsx','ts','tsx','json']
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: { experimentalImportSupport: false, inlineRequires: true },
    }),
  },
};
