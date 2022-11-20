import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
    signatureVersion: 'v4',
});

export function createLogoPresignedUrl(objectId: string): string {
    return s3.getSignedUrl('putObject', {
        Bucket: process.env.LOGO_S3_BUCKET,
        Key: objectId,
        Expires: 300,
    });
}
