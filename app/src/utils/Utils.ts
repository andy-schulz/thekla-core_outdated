export class Utils {
    public static wait(timeToWait: number) {
        return new Promise((fulfill, reject) => {
            setTimeout(() => {
                fulfill(`Time waited: ${timeToWait}`)
            }, timeToWait);
        })
    }
}