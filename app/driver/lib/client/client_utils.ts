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