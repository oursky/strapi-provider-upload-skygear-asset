const nodeFetch = require("node-fetch").default;
const { NodeContainer } = require("@skygear/node-client");
const FormData = require("form-data");

function decodeError(err) {
  // Construct SkygearError if it looks like one.
  if (
    err != null &&
    !(err instanceof Error) &&
    typeof err.name === "string" &&
    typeof err.reason === "string" &&
    typeof err.message === "string"
  ) {
    return new Error(
      `${err.message}: ${err.name}: ${err.reason}, ${JSON.stringify(err.info)}`
    );
  }
  // If it is an Error, just return it.
  if (err instanceof Error) {
    return err;
  }
  // If it has message, construct an Error from the message.
  if (err != null && typeof err.message === "string") {
    return new Error(err.message);
  }
  // If it can be turned into string, use it as message.
  if (err != null && typeof err.toString === "function") {
    return new Error(err.toString());
  }
  // Otherwise cast it to string and use it as message.
  return new Error(String(err));
}

async function uploadForm(url, req, file) {
  const form = new FormData();
  if (req.prefix != null) {
    form.append("prefix", req.prefix);
  }
  if (req.access != null) {
    form.append("access", req.access);
  }
  if (req.headers != null) {
    for (const name of Object.keys(req.headers)) {
      const value = req.headers[name];
      form.append(name, value);
    }
  }
  form.append("file", file.buffer, `filename.${file.ext}`);

  const jsonBody = await nodeFetch(url, {
    method: "POST",
    body: form,
  }).then((r) => r.json());

  if (jsonBody["result"]) {
    return jsonBody["result"]["asset_name"];
  } else if (jsonBody["error"]) {
    throw decodeError(jsonBody["error"]);
  } else {
    throw decodeError();
  }
}

module.exports = {
  uploadAsset: async (skygearMasterKey, skygearEndpoint, file, access) => {
    const container = new NodeContainer();
    await container.configure({
      apiKey: skygearMasterKey,
      endpoint: skygearEndpoint,
    });
    const { url } = await container.apiClient._presignUploadForm();
    const presignRequest = {
      access,
    };
    const assetName = await uploadForm(url, presignRequest, file);
    return assetName;
  },

  signAsset: async (
    skygearMasterKey,
    skygearEndpoint,
    assetName,
    access,
    expire
  ) => {
    if (access === "public") {
      return {
        asset_name: assetName,
        url: `${skygearEndpoint}/_asset/get/${assetName}`,
      };
    }

    const body = {
      assets: [
        {
          asset_name: assetName,
          expire,
        },
      ],
    };

    const signedAssets = await nodeFetch(
      `${skygearEndpoint}/_asset/get_signed_url`,
      {
        method: "POST",
        headers: {
          "X-Skygear-Api-Key": skygearMasterKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    ).then((r) => r.json());
    const { assets } = signedAssets && signedAssets.result;
    if (!assets || assets.length === 0) {
      throw new Error("Cannot sign asset");
    }
    return assets[0];
  },
};
