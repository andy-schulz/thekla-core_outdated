export class Utils {
    public static wait(timeToWait: number): Promise<string> {
        return new Promise((fulfill): void => {
            setTimeout((): void => {
                fulfill(`Time waited: ${timeToWait}`)
            }, timeToWait);
        })
    }
}