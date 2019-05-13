export class NoSuchAbilityError extends Error {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public constructor(...args: any[]) {
        super(...args);
        Error.captureStackTrace(this, NoSuchAbilityError)
    }
}