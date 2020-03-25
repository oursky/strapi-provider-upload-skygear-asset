/* eslint-disable no-unused-vars */
import skygear, { UploadAssetOptions } from "@skygear/web";

export interface Config {
  SKYGEAR_APIKEY: string;
  SKYGEAR_ENDPOINT: string;
}

export interface ProviderInterface {
  upload: (blob: Blob, options?: UploadAssetOptions) => Promise<string>;
}

class SkygearProvider {
  provider: string = "strapi-provider-upload-skygear-asset";
  name: string = "Strapi Provider Upload Skygear Asset";

  static init(config: Config): ProviderInterface {
    skygear.configure({
      apiKey: config.SKYGEAR_APIKEY,
      endpoint: config.SKYGEAR_ENDPOINT
    });

    return {
      upload: (blob, options) => {
        return skygear.asset.upload(blob, options);
      }
    };
  }
}

export default SkygearProvider;
