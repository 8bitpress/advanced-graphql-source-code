import cloudinary from "../config/cloudinary";

function onReadStream(stream) {
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on("error", error => reject(error));
    stream.on("data", data => buffers.push(data));
    stream.on("end", () => {
      const contents = Buffer.concat(buffers);
      resolve(contents);
    });
  });
}

export async function readNestedFileStreams(variables) {
  const varArr = Object.entries(variables || {});

  for (let i = 0; i < varArr.length; i++) {
    if (Boolean(varArr[i][1] && typeof varArr[i][1].then === "function")) {
      const { createReadStream, encoding, filename, mimetype } = await varArr[
        i
      ][1];
      const readStream = createReadStream();
      const buffer = await onReadStream(readStream);
      variables[varArr[i][0]] = { buffer, encoding, filename, mimetype };
    }

    if (varArr[i][1] !== null && varArr[i][1].constructor.name === "Object") {
      await readNestedFileStreams(varArr[i][1]);
    }
  }

  return variables;
}

export function uploadStream(buffer, options) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      })
      .end(buffer);
  });
}
