export default interface PropsAudio {
  url: string;
  position?: string;
  key?: string;
  /**
   * History'den gelen ses ekleri icin tembel indirici. Verilmisse dosya
   * yalnizca ilk oynatmada (kullanici bastiginda) indirilir; verilmemisse
   * `url` zaten kullanilabilir kabul edilir.
   */
  resolveAudio?: () => Promise<string>;
}
