const skygear = require("./skygear");

const trimParam = (str) => (typeof str === "string" ? str.trim() : undefined);

module.exports = {
  provider: "skygear-asset",
  name: "Skygear Asset",
  auth: {
    skygearEndpoint: {
      label: "Skygear API Endpoint",
      type: "text",
    },
    skygearMasterKey: {
      label: "Skygear Master Key",
      type: "text",
    },
    assetAccess: {
      label: "Access",
      type: "enum",
      values: ["public", "private"],
    },
    expire: {
      label: "Expire time",
      type: "number",
    },
  },
  init: (config) => {
    return {
      upload: async (file) => {
        const skygearMasterKey = trimParam(config.skygearMasterKey);
        const skygearEndpoint = trimParam(config.skygearEndpoint);
        const assetName = await skygear.uploadAsset(
          skygearMasterKey,
          skygearEndpoint,
          file,
          config.assetAccess
        );
        const asset = await skygear.signAsset(
          skygearMasterKey,
          skygearEndpoint,
          assetName,
          config.assetAccess,
          config.expire
        );
        file.provider_metadata = {
          assetName,
        };
        file.url = asset.url;
      },
      delete: () => {
        // We won't remove asset from skygear
        return Promise.resolve();
      },
    };
  },
};
