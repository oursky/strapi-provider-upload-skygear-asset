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
  },
  init: () => {
    return {
      upload: () => {
        throw new Error("Not implemented");
      },
      delete: () => {
        throw new Error("Not implemented");
      },
    };
  },
};
