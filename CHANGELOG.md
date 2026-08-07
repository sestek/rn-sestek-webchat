# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.3] - 2026-08-07

### Added — New Architecture (Fabric) support

The SDK is pure JS and receives native capabilities through the `modules` prop.
It now **auto-detects and adapts** New-Architecture-compatible packages internally,
so a single integration works on both the old and the new architecture.

- **File selection** — `modules.RNFileSelector` now accepts **either**
  `react-native-document-picker` (legacy) **or** `@react-native-documents/picker`
  (New Arch). The SDK detects which API was passed and adapts the new one
  (`isErrorWithCode`/`errorCodes`, `keepLocalCopy` for Android `content://` URIs)
  to the contract it expects. No prop/API change for existing integrations.
- **File viewing** — when `modules.fileViewer` is **not** provided, the SDK opens
  downloaded files through the already-injected `react-native-blob-util`
  (`modules.RNFS`): Android `actionViewIntent`, iOS `openDocument`. No separate
  file-viewer package is required on New Arch.
- **Audio** — `modules.nitroSound` accepts `react-native-nitro-sound` (New Arch).
  The SDK derives the playback/recording adapters, a drop-in for the legacy
  `AudioRecorderPlayer` + `Record` modules.
- **Storage** — `modules.asyncStorage` accepts AsyncStorage **v3** as well as v2;
  the v3 `getMany`/`setMany`/`removeMany` API is adapted internally.
- **Safe area (Android edge-to-edge)** — optional `modules.SafeAreaContext`
  accepts the `react-native-safe-area-context` module. The chat modal renders
  inside a native `<Modal>`, a separate window that inherits neither the app's
  `SafeAreaProvider` context nor the Activity's `adjustResize` setting; when the
  module is injected the SDK mounts its own provider inside the modal and applies
  the top inset to the header and the bottom inset to the footer. Omit it and the
  layout stays exactly as before.
- The adapter factories are also exported for manual use:
  `createNitroAudioModules`, `createDocumentsPickerModule`,
  `createBlobUtilFileViewer`.

### Added — ChatHub session contract

- The server now issues `conversationId` and `sessionToken`; the SDK adopts them
  from `StartConversation` / `SendMessageAsync`, attaches them to every outgoing
  frame, sends `sessionToken` with audio and attachment uploads, and persists them
  so a conversation survives an app restart (`startStorageSession`).

### Added — Automation testing support

- `testID` and `accessibilityLabel` (plus `accessibilityRole="button"`) can now be
  set on the header hide/close buttons, the close-confirmation dialog and its
  Yes/No buttons, and the footer attachment / voice / send buttons via the
  existing icon configuration; the message input accepts `bottomInputTestID` and
  `bottomInputAccessibilityLabel`. All optional — omit them and nothing changes.

### Fixed

- **Conversation lifecycle** — `EndConversation` is now awaited and confirmed
  before the message list is cleared, and the socket is really closed afterwards.
  Ending and reopening a chat starts a clean conversation again.
- **Message list integrity** — button messages no longer appear twice (the sent
  value and the displayed title are reconciled into a single message), reconnects
  and history syncs no longer produce duplicates, and history is rendered in the
  exact order the server returns it.
- **Background / reconnect synchronization** — returning from background or
  recovering a dropped socket now re-syncs with history and fills in the messages
  that were missed, without duplicating or reordering anything.
- **Socket stability** — a reconnect no longer leaves stale connections and
  duplicate handlers behind (previously a single message could be processed more
  than once, and one `EndConversation` could reach the server twice).
- **History loading speed** — audio attachments in history are no longer
  downloaded up front; a file is fetched the first time the user plays it.
- **File download** — downloads fetch in memory and write via `RNFS` instead of
  streaming to a path, fixing `Download interrupted` against HTTP/2 file endpoints.
- **Audio playback (Android)** — player stop/start no longer throws on an
  unprepared player, and a failed download no longer breaks the player.
- An `AppState` listener leak is fixed; background transitions no longer multiply
  the work the SDK does.

### Changed

- Added `defaultConfiguration.disablePreviousButtons` (default `true`): once a new
  message arrives (or a button is tapped), only the latest message's buttons stay
  active; earlier buttons are disabled. Set `false` to keep the previous behavior.
- `endConversation()` and `startStorageSession()` now resolve to a `boolean`
  reporting whether the operation succeeded / whether a stored session was
  resumed. Existing callers that ignore the result are unaffected.

### Compatibility

- Fully backward compatible: existing (old-architecture) integrations keep working
  unchanged — legacy audio / document-picker / file-viewer packages are used as-is
  when provided, and every new configuration field is optional.

[1.4.3]: https://www.npmjs.com/package/rn-sestek-webchat
