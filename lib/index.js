"use strict";

const skygear = require("@skygear/node-client").default;
// const axios = require("axios").default;

module.exports = {
  provider: "strapi-provider-upload-skygear-asset",
  name: "Strapi Provider Upload Skygear Asset",
  auth: {
    masterKey: {
      label: "Skygear Master Key",
      type: "text"
    },
    endpoint: {
      label: "Skygear Endpoint",
      type: "text"
    }
  },
  init: config => {
    skygear.configure({
      apiKey: config.masterKey,
      endpoint: config.endpoint
    });

    // ## Sign url ourselves
    // const url = (await skygear.apiClient._presignUploadForm()).url;
    // var form = new FormData();
    // form.append("file", file.buffer);

    // const resp = await axios({
    //   url: url,
    //   method: "post",
    //   data: form
    // }).catch(error => {
    //   console.log(error.message);
    // });

    // ## call skygear asset directly
    return {
      upload: file => {
        file.url = `/uploads/${file.hash}`; //valid format for `upload_file` db

        return skygear.asset
          .upload(file.buffer, {
            access: "public"
          })
          .then(assetName => {
            console.log("assetName", assetName);
          })
          .catch(error => {
            console.log("ERROR", error);
            console.log("MESSAGE", error.message);
          });
      },
      delete: () => {}
    };
  }
};
