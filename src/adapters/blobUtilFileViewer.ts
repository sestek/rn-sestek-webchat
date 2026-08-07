import { Platform } from 'react-native';

const MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  txt: 'text/plain',
  csv: 'text/csv',
  rtf: 'application/rtf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  ogg: 'audio/ogg',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  zip: 'application/zip',
  json: 'application/json',
};

const guessMime = (path: string): string => {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  return MIME_BY_EXT[ext] ?? '*/*';
};

export const createBlobUtilFileViewer = (blobUtil: any) => ({
  open: (path: string): Promise<any> => {
    const cleanPath = path?.replace?.(/^file:\/\//, '') ?? path;
    if (Platform.OS === 'android') {
      return blobUtil.android.actionViewIntent(cleanPath, guessMime(cleanPath));
    }

    return Promise.resolve(blobUtil.ios.openDocument(cleanPath));
  },
});

export default createBlobUtilFileViewer;
