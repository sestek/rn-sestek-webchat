/**
 * @react-native-async-storage/async-storage v3, v2'nin toplu (multi) API'sini
 * kaldirip yerine yeni isimler koydu:
 *
 *   v2 (<=2.x)                      v3 (>=3.x)
 *   multiGet(keys)  -> [k,v][]      getMany(keys)    -> Record<k, v|null>
 *   multiSet([k,v][])               setMany(Record<k, v>)
 *   multiRemove(keys)               removeMany(keys)
 *   getItem/setItem/removeItem      (degismedi)
 *
 * SDK ici kod v2 kontratini kullaniyor. Burada hangi surum verilirse verilsin
 * ayni kontrata normalize ediyoruz:
 *   - v2 nesnesi gelirse OLDUGU GIBI donuyoruz (davranis birebir korunur),
 *   - v3 nesnesi gelirse v2 imzalarini v3 metotlari uzerine kuruyoruz.
 *
 * Boylece eski RN / eski AsyncStorage kullanan entegrasyonlar hicbir sekilde
 * etkilenmez; yeni surum kullananlarda da "multiSet is not a function"
 * TypeError'i olusmaz.
 */

type LegacyEntry = [string, string | null];

const resolveModule = (input: any) => input?.default ?? input;

export const isLegacyAsyncStorageApi = (storage: any): boolean =>
  typeof storage?.multiGet === 'function' &&
  typeof storage?.multiSet === 'function' &&
  typeof storage?.multiRemove === 'function';

export const isModernAsyncStorageApi = (storage: any): boolean =>
  typeof storage?.getMany === 'function' &&
  typeof storage?.setMany === 'function' &&
  typeof storage?.removeMany === 'function';

export const createAsyncStorageModule = (input: any) => {
  const storage = resolveModule(input);

  if (!storage) {
    return undefined;
  }

  // v1/v2: SDK'nin bekledigi kontratin ta kendisi -> dokunma.
  if (isLegacyAsyncStorageApi(storage)) {
    return storage;
  }

  // Tanimadigimiz bir sey (ya da yalnizca getItem/setItem sunan bir shim):
  // sarmalamak fayda saglamaz, oldugu gibi gecir.
  if (!isModernAsyncStorageApi(storage)) {
    return storage;
  }

  return {
    getItem: (key: string): Promise<string | null> => storage.getItem(key),

    setItem: (key: string, value: string): Promise<void> =>
      storage.setItem(key, value),

    removeItem: (key: string): Promise<void> => storage.removeItem(key),

    getAllKeys: (): Promise<string[]> => storage.getAllKeys(),

    clear: (): Promise<void> => storage.clear(),

    // v2 imzalari -> v3 metotlari
    multiGet: async (keys: string[]): Promise<LegacyEntry[]> => {
      const record = await storage.getMany(keys);
      // v2 her zaman istenen anahtar sirasinda [key, value|null] cifti doner.
      return keys.map((key) => [key, record?.[key] ?? null] as LegacyEntry);
    },

    multiSet: async (entries: LegacyEntry[]): Promise<void> => {
      const record: Record<string, string> = {};
      (entries || []).forEach(([key, value]) => {
        if (key != null && value != null) {
          record[key] = value;
        }
      });
      await storage.setMany(record);
    },

    multiRemove: (keys: string[]): Promise<void> => storage.removeMany(keys),

    // v3 isimleri de acikta kalsin (tuketici dogrudan kullanmak isterse).
    getMany: (keys: string[]) => storage.getMany(keys),
    setMany: (entries: Record<string, string>) => storage.setMany(entries),
    removeMany: (keys: string[]) => storage.removeMany(keys),
  };
};

export default createAsyncStorageModule;
