import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { URLS } from '../manage-media/UploadMediaPopup';

const client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION ?? "",
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY ?? "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ?? "",
    },
});

export const generatePresignedUrl = (key: string) => {
    try {
        const command = new GetObjectCommand({ Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET, Key: key });
        const src = getSignedUrl(client, command, { expiresIn: 3600 });
        return src ?? "";
    } catch (error) {
        console.error("Error getting image URL:", error);
        throw error;
    }
};

export const uploadImageToS3 = async (file: File, isImage = true): Promise<URLS> => {
    const name = file.name.substring(0, file.name.lastIndexOf('.'));
    const extension = file.name.substring(file.name.lastIndexOf('.'));
    const timestamp = new Date().toISOString().replace(/[:\-T]/g, '').substring(0, 14); // Generate timestamp
    const key = isImage ? `temp/building/images/${name}_${timestamp}${extension}` : `temp/building/videos/${name}_${timestamp}${extension}`;
    const thumbnailKey = isImage ? `temp/building/images/thumbnails/${name}_${timestamp}.jpg` : `temp/building/videos/thumbnails/${name}_${timestamp}.jpeg`;


    try {
        const fileContent = new Uint8Array(await file.arrayBuffer());
        const command = new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
            Key: key,
            Body: fileContent,
            ContentType: file.type
        });
        await client.send(command)

        let thumbnail
        if (isImage) {
            thumbnail = await generateImageThumbnail(file, 150, 150)
        } else {
            thumbnail = await generateVideoThumbnail(file)
        }

        const thumbnailCommand = new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
            Key: thumbnailKey,
            Body: thumbnail,
        });
        await client.send(thumbnailCommand)

        return { key, thumbnailKey }
    } catch (error) {
        console.error("Error uploading image to S3:", error);
        throw error;
    }
};


export const generateImageThumbnail = (
    file: File,
    maxWidth: number,
    maxHeight: number
): Promise<Uint8Array> => {
    return new Promise<Uint8Array>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate new dimensions while preserving aspect ratio
                let newWidth = image.width;
                let newHeight = image.height;
                if (newWidth > maxWidth) {
                    const ratio = maxWidth / newWidth;
                    newWidth = maxWidth;
                    newHeight *= ratio;
                }
                if (newHeight > maxHeight) {
                    const ratio = maxHeight / newHeight;
                    newHeight = maxHeight;
                    newWidth *= ratio;
                }
                // Set canvas dimensions
                canvas.width = newWidth;
                canvas.height = newHeight;

                // Draw image on canvas
                ctx?.drawImage(image, 0, 0, newWidth, newHeight);

                // Get buffer of thumbnail
                canvas.toBlob((blob) => {
                    if (blob) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            if (reader.result instanceof ArrayBuffer) {
                                const buffer = new Uint8Array(reader.result);
                                resolve(buffer);
                            } else {
                                reject(new Error('Failed to read buffer'));
                            }
                        };
                        reader.readAsArrayBuffer(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                });
            };
            image.onerror = (error) => {
                reject(error);
            };
            if (event.target && typeof event.target.result === 'string') {
                image.src = event.target.result;
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
};

const generateVideoThumbnail = async (file: File, seekTo = 0.1, quality = 0.50): Promise<Uint8Array> => {
    return new Promise<Uint8Array>((resolve, reject) => {
        const player = document.createElement('video');
        player.setAttribute('src', URL.createObjectURL(file));

        player.load();
        player.addEventListener('error', (err: any) => reject(`${file?.name} is an invalid video format.`));

        // load metadata of the video to get video duration and dimensions
        player.addEventListener('loadedmetadata', () => {
            // seek to user defined timestamp (in seconds) if possible
            if (player.duration < seekTo) {
                reject('The video is too short.');
                return;
            }

            // Delay seeking or else 'seeked' event won't fire on Safari
            setTimeout(() => {
                player.currentTime = seekTo;
            }, 500);

            // extract video thumbnail once seeking is complete
            player.addEventListener('seeked', () => {
                // define a canvas to have the same dimension as the video
                const videoCanvas = document.createElement('canvas');
                videoCanvas.width = player.videoWidth;
                videoCanvas.height = player.videoHeight;

                // draw the video frame to canvas
                const videoContext: CanvasRenderingContext2D | null = videoCanvas.getContext('2d');
                if (videoContext) {
                    videoContext.drawImage(player, 0, 0, videoCanvas.width, videoCanvas.height);

                    // return the canvas image as a blob
                    videoContext.canvas.toBlob((blob: Blob | null) => {
                        if (blob) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                if (reader.result instanceof ArrayBuffer) {
                                    const buffer = new Uint8Array(reader.result);
                                    resolve(buffer);
                                } else {
                                    reject(new Error('Failed to read buffer'));
                                }
                            };
                            reader.readAsArrayBuffer(blob);
                        } else {
                            reject(new Error('Failed to create blob'));
                        }
                    }, 'image/jpeg', quality);
                } else {
                    reject(new Error('Failed to get 2d context from canvas'));
                }
            });
        });
    });
};

