import GeneralManager from '../services/general';

// nitro-sound startRecorder'i `fileURL.absoluteString` ile resolve ediyor, yani
// "file:///var/...". SDK'nin Recorder'i (services/recorder.ts) donen degerin
// basina kendisi "file://" ekledigi icin semayi burada soymazsak
// "file://file:///var/..." olusuyor.
const toBarePath = (uri: string): string => {
  if (!uri) {
    return uri;
  }
  const withoutScheme = uri.replace(/^file:\/\//i, '');
  try {
    return decodeURIComponent(withoutScheme);
  } catch {
    return withoutScheme;
  }
};

export const createNitroAudioModules = (nitroSound: any, rnfs: any) => {
  const sound: any = nitroSound?.default ?? nitroSound;
  const createSound: any =
    nitroSound?.createSound ?? sound?.createSound ?? (() => sound);

  class AudioRecorderPlayer {
    constructor() {
      return createSound();
    }
  }
  const Record = {
    _uri: '',
    _audioSet: {} as any,
    _ready: Promise.resolve() as Promise<any>,

    init(options: {
      sampleRate?: number;
      channels?: number;
      bitsPerSample?: number;
      audioSource?: number;
      wavFile?: string;
    }) {
      const fileName = (options.wavFile || 'audio.wav')
        .split('/')
        .pop() as string;
      const dir = rnfs.fs.dirs.DocumentDir + '/sestek_bot_audio';
      this._uri = `${dir}/${fileName}`;
      this._ready = GeneralManager.ensureDir(rnfs, dir).catch(() => {});

      this._audioSet = {
        // iOS -> linear PCM (WAV), 8kHz / mono / 16-bit
        AVFormatIDKeyIOS: 'lpcm',
        AVSampleRateKeyIOS: options.sampleRate ?? 8000,
        AVNumberOfChannelsKeyIOS: options.channels ?? 1,
        AVLinearPCMBitDepthKeyIOS: options.bitsPerSample ?? 16,
        // Android -> en iyi caba
        AudioSamplingRate: options.sampleRate ?? 8000,
        AudioChannels: options.channels ?? 1,
      };
    },

    on(_event: string, _cb: (...args: any[]) => void) {},

    async start() {
      await this._ready;
      // startRecorder istedigimiz uri'yi native tarafta reddedip/degistirip
      // farkli bir yola kaydedebilir; gercekte kaydedilen yolu benimsiyoruz,
      // aksi halde stop() sonrasi okuma yanlis (var olmayan) dosyaya bakar.
      const resolved = await sound.startRecorder(this._uri, this._audioSet);
      if (resolved) {
        // Cikplak mutlak yol olarak sakla: Recorder "file://" onekini kendisi
        // ekliyor, RNFS.readFile ise semasiz yol bekliyor.
        this._uri = toBarePath(resolved);
      }
    },

    async stop(): Promise<string> {
      await sound.stopRecorder();
      return this._uri;
    },
  };

  return { AudioRecorderPlayer, Record };
};

export default createNitroAudioModules;
