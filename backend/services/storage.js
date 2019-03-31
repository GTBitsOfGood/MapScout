const AWS = require("aws-sdk");

const {
    Aborter,
    StorageURL,
    ServiceURL,
    ContainerURL,
    SharedKeyCredential,
    BlockBlobURL,
    uploadStreamToBlockBlob
} = require("@azure/storage-blob");

// A helper method used to read a Node.js readable stream into a buffer,
// which can be sent by express.
async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        var buffs = [];
        var finalBuff = null;
        readableStream.on("data", chunk => {
            buffs.push(chunk);
        });
        readableStream.on("end", () => {
            resolve(Buffer.concat(buffs));
        });
    });
}

class AzureStorage {
    constructor() {
        // Azure config.
        this.AZURE_STORAGE_ACCOUNT_NAME =
            process.env.AZURE_STORAGE_ACCOUNT_NAME;
        this.AZURE_STORAGE_ACCOUNT_ACCESS_KEY =
            process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
        this.ONE_MEGABYTE = 1024 * 1024;
        this.FOUR_MEGABYTES = 4 * this.ONE_MEGABYTE;
        this.ONE_MINUTE = 60 * 1000;
        this.AZURE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;

        this.aborter = Aborter.timeout(30 * this.ONE_MINUTE);

        const credentials = new SharedKeyCredential(
            this.AZURE_STORAGE_ACCOUNT_NAME,
            this.AZURE_STORAGE_ACCOUNT_ACCESS_KEY
        );
        const pipeline = StorageURL.newPipeline(credentials);
        this.serviceURL = new ServiceURL(
            `https://${this.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
            pipeline
        );
        this.containerURL = ContainerURL.fromServiceURL(
            this.serviceURL,
            this.AZURE_CONTAINER_NAME
        );
    }

    async upload(imageID, image) {
        // Returns promise.
        console.log("Uploading: " + imageID);
        const { Readable } = require("stream");
        const stream = new Readable();
        stream.push(image.buffer);
        stream.push(null);

        const blockBlobURL = BlockBlobURL.fromContainerURL(
            this.containerURL,
            imageID
        );
        const uploadOptions = {
            bufferSize: this.FOUR_MEGABYTES,
            maxBuffers: 5
        };
        return await uploadStreamToBlockBlob(
            this.aborter,
            stream,
            blockBlobURL,
            uploadOptions.bufferSize,
            uploadOptions.maxBuffers
        );
    }

    async download(imageID) {
        console.log("fetching image: " + imageID);

        const blockBlobURL = BlockBlobURL.fromContainerURL(
            this.containerURL,
            imageID
        );

        try {
            const downloadResponse = await blockBlobURL.download(
                this.aborter,
                0
            );
            console.log("downloaded response");
            const downloadedContent = await streamToBuffer(
                downloadResponse.readableStreamBody
            );
            console.log("processing response.");
            return downloadedContent;
        } catch (err) {
            // why do I have to catch and rethrow an error?
            // I thought await would make the async function go to th
            // catch statement?
            throw new Error(err);
        }
    }

    async deleteImage(imageID) {
        const blockBlobURL = BlockBlobURL.fromContainerURL(
            this.containerURL,
            imageID
        );
        await blockBlobURL.delete(this.aborter);
    }
}

class AWSStorage {
    constructor() {
        // Amazon s3 config
        this.s3 = new AWS.S3();
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            subregion: process.env.AWS_REGION
        });
    }

    upload(imageID, image) {
        return new Promise((resolve, reject) => {
            s3.putObject(
                {
                    Bucket: "community-legal-services-bucket",
                    Key: imageID,
                    Body: image.buffer
                },
                (err, data) => {
                    reject(err);
                }
            );
            resolve();
        });
    }

    download(imageID) {
        return new Promise((resolve, reject) => {
            reject("getImageAWS unimplemented.");
        });
    }

    deleteImage(imageID) {
        return new Promise((resolve, reject) => {
            s3.deleteObjects(
                {
                    Bucket: "community-legal-services-bucket",
                    Delete: {
                        Objects: imageID
                    }
                },
                (err, data) => {
                    reject({
                        err: err,
                        data: data
                    });
                }
            );
            resolve();
        });
    }
}

module.exports = {
    AzureStorage,
    AWSStorage
};
