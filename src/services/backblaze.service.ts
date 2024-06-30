import B2 from "backblaze-b2";
import dotenv from "dotenv";
import ApiError from "../utils/api-error.utils";
import generateUniqueName from "../utils/generate-unique-name.utils";

dotenv.config();

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID as string,
  applicationKey: process.env.B2_APPLICATION_KEY as string,
});

export async function uploadFile({
  fileType,
  file,
  originalname,
}: {
  fileType: string;
  file: Express.Multer.File;
  originalname: string;
}) {
  try {
    const authResponse = await b2.authorize();
    const { downloadUrl } = authResponse.data;

    const response = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID as string,
    });

    const { authorizationToken, uploadUrl } = response.data;

    // File name with unique name like category/aaaa.png
    const fileName = `${fileType}/${generateUniqueName()}.${
      originalname.split(".")[1]
    }`;

    const newResponse = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName,
      data: file.buffer,
    });

    return {
      url: `${downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${fileName}`,
      data: newResponse.data,
    };
  } catch (e) {
    throw new ApiError({
      message: "Sorry, file upload doesn't work right now.",
      statusCode: 400,
      name: "B2_ERROR",
    });
  }
}

export async function deleteFile({
  fileId,
  fileName,
}: {
  fileId: string;
  fileName: string;
}) {
  try {
    await b2.authorize();
    const response = await b2.deleteFileVersion({
      fileId,
      fileName,
    });

    return response.data;
  } catch (e) {
    console.log(e);

    throw new ApiError({
      message: "Sorry, file upload doesn't work right now.",
      statusCode: 400,
      name: "B2_ERROR",
    });
  }
}
