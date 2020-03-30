module.export = {
  provider: "skygear-asset",
  auth: {
    public: {
      label: "Skygear API Endpoint",
      type: "text"
    },
    private: {
      label: "Skygear Master Key",
      type: "text"
    }
  },
  init: () => {
    return {
      upload: () => {
        throw new Error("Not implemented");
      },
      delete: () => {
        throw new Error("Not implemented");
      }
    };
  }
};
