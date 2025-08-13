import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';

interface IUploadParams<T = Uint8Array> {
  fileName: string;
  fileData: T;
  contentType: string;
  metadata?: Record<string, string>
}

export class S3Service {
  private s3: S3Client;

  constructor(private bucketName: string) {
    // Initialize the S3 client
    this.s3 = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  async get(fileName: string) {
    const params = {
        Bucket: this.bucketName,
        Key: fileName,
      };
  
      try {
        const s3Object = await this.s3.send(new GetObjectCommand(params));
        return s3Object;
      } catch (error) {
        console.error(error);
        throw error;
      }
  }

  async upload({ fileData, fileName, contentType, metadata }: IUploadParams) {
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileData,
      ContentType: contentType,
      ContentEncoding: 'base64',
      Metadata: metadata
    };

    const uploadCommand = new PutObjectCommand(params);
    try {
        const putObjectResponse = await this.s3.send(uploadCommand);
        console.info(`Successfully uploaded ${fileName} to ${this.bucketName}`);
        return putObjectResponse;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteFile(Key: string) {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key,
        })
      );
      return `${Key} deleted`;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async listFiles(prefix: string) {
    return await this.s3.send(
        new ListObjectsCommand({
          Bucket: this.bucketName,
          Prefix: prefix,
        })
    );
  }
}
