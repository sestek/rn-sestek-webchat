export const isNewDocumentsPickerApi = (picker: any): boolean => {
  const mod: any = picker?.default ?? picker;
  return (
    typeof mod?.isErrorWithCode === 'function' ||
    typeof mod?.keepLocalCopy === 'function' ||
    typeof picker?.isErrorWithCode === 'function' ||
    typeof picker?.keepLocalCopy === 'function'
  );
};

export const createDocumentsPickerModule = (documentsPicker: any) => {
  const mod: any = documentsPicker?.default ?? documentsPicker;
  const pickFn = mod?.pick ?? documentsPicker?.pick;
  const pkgTypes = mod?.types ?? documentsPicker?.types;
  const keepLocalCopy = mod?.keepLocalCopy ?? documentsPicker?.keepLocalCopy;
  const isErrorWithCode =
    mod?.isErrorWithCode ?? documentsPicker?.isErrorWithCode;
  const errorCodes = mod?.errorCodes ?? documentsPicker?.errorCodes;

  return {
    types: { allFiles: pkgTypes?.allFiles ?? '*/*' },

    isCancel: (err: any) => {
      const canceledCode =
        errorCodes?.OPERATION_CANCELED ?? 'OPERATION_CANCELED';
      if (typeof isErrorWithCode === 'function') {
        return isErrorWithCode(err) && err?.code === canceledCode;
      }
      return err?.code === canceledCode;
    },

    pick: async (options: any) => {
      const results = await pickFn(options);
      if (!Array.isArray(results)) {
        return results;
      }

      const mapped = await Promise.all(
        results.map(async (r: any) => {
          let uri = r?.uri;
          if (
            keepLocalCopy &&
            typeof uri === 'string' &&
            uri.startsWith('content://')
          ) {
            try {
              const copies = await keepLocalCopy({
                files: [{ uri: r.uri, fileName: r?.name ?? 'file' }],
                destination: 'documentDirectory',
              });
              const copy = Array.isArray(copies) ? copies[0] : copies;
              if (copy?.status === 'success' && copy?.localUri) {
                uri = copy.localUri;
              }
            } catch {
              // kopyalama basarisiz olursa orijinal uri ile devam et
            }
          }
          return {
            uri,
            name: r?.name,
            type: r?.type,
            size: r?.size,
          };
        })
      );
      return mapped;
    },
  };
};

export default createDocumentsPickerModule;
