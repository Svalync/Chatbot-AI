
import { FileGlobal } from '@/app/components/FileUploaderInput';
import configEnv from '@/config';
import ImageKit from 'imagekit';
import { UploadResponse } from 'imagekit/dist/libs/interfaces';
import IKResponse from 'imagekit/dist/libs/interfaces/IKResponse';

export default class imageKitInstance {
  imagekit: any;
  userId: string = '';

  constructor() {
    this.imagekit = new ImageKit({
      publicKey: configEnv.imageKit.publicKey,
      privateKey: configEnv.imageKit.privateKey,
      urlEndpoint: 'https://ik.imagekit.io/dwn97duqt',
    });
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  async uploadInvoices(file: Uint8Array, fileName: string): Promise<IKResponse<UploadResponse>> {
    const base64 = this.uint8ArrayToBase64(file);
    let folderLocation = 'invoices';

    if (configEnv.nextEnv === 'dev') {
      folderLocation = 'testInvoices';
    }
    const fileUpload = await this.imagekit.upload({
      file: base64, //required
      fileName: fileName,
      folder: folderLocation,
    });
    return fileUpload;
  }

  async uploadDocument(file: ArrayBuffer, fileName: string): Promise<IKResponse<UploadResponse>> {
    let folderLocation = this.userId;

    if (configEnv.nextEnv === 'dev') {
      folderLocation = folderLocation + '/test';
    }
    const fileUpload = await this.imagekit.upload({
      file: file, //required
      fileName: fileName,
      folder: folderLocation,
    });
    return fileUpload;
  }

  async uploadDocuments(files: FileGlobal[]) {
    try {
      let folderLocation = this.userId;
      if (configEnv.nextEnv === 'dev') {
        folderLocation = folderLocation + '/test';
      }

      let finalURL: IKResponse<UploadResponse>[] = [];
      for (let file of files) {
        const response: IKResponse<UploadResponse> = await this.imagekit.upload({
          file: file.file, // Path to the file
          fileName: file.filename, // Extract file name from path
          folder: folderLocation,
        });
        finalURL.push(response);
      }
      return finalURL;
    } catch (e: any) {
      throw e;
    }
  }

  async uploadImageforProfile(file: ArrayBuffer, fileName: string) {
    let folderLocation = this.userId;

    if (configEnv.nextEnv === 'dev') {
      folderLocation = folderLocation + '/test/userCredentials';
    }
    const fileUpload = await this.imagekit.upload({
      file: file, //required
      fileName: fileName,
      folder: folderLocation,
    });
    return fileUpload;
  }

  private uint8ArrayToBase64(uint8Array: Uint8Array): string {
    return Buffer.from(uint8Array).toString('base64'); // Convert Uint8Array to Base64
  }
}
