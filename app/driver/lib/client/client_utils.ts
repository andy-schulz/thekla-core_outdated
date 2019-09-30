import {ScreenshotOptions, ScreenshotSize} from "../../interface/Browser";
import Jimp from 'jimp';

export const parseBrowserVersion = (browserVersion?: string): {major: number; minor: number; patch: number} => {
    const version = {
        major: 0,
        minor: 0,
        patch: 0,
    };

    if(!browserVersion)
        return version;

    const majorStringVersion = browserVersion.split(`.`);

    if(majorStringVersion.length < 1)
        return version;

    if(majorStringVersion.length > 0)
        version.major = !isNaN(parseInt(majorStringVersion[0])) ? parseInt(majorStringVersion[0]) : 0;

    if(majorStringVersion.length > 1)
        version.minor = !isNaN(parseInt(majorStringVersion[1])) ? parseInt(majorStringVersion[1]) : 0;

    if(majorStringVersion.length > 2)
        version.patch = !isNaN(parseInt(majorStringVersion[2])) ? parseInt(majorStringVersion[2]) : 0;

    return version;
};

const resizeScreenshot = (data: string, size: ScreenshotSize): Promise<string> => {

    if(size.width || size.height) {
        const bitmap = new Buffer(data, `base64`);
        return new Promise((resolve, reject) => {
            Jimp.read(bitmap)
                .then((image) => {
                    image.resize(size.width ? size.width : Jimp.AUTO, size.height ? size.height : Jimp.AUTO)
                        .getBase64(Jimp.MIME_PNG, (err,imageData) => {
                            if(err)
                                reject();
                            resolve(imageData.replace(`data:image/png;base64,`,``))
                        })
                })
        });
    }

    return Promise.resolve(data)
};

// data is passed as base64 encoded image
export const processScreenshot = (options?: ScreenshotOptions): (data: string) => Promise<string> => {
    return (data: string): Promise<string> => {
        if(options && options.size)
            return resizeScreenshot(data, options.size);

        return Promise.resolve(data)
    }
};

