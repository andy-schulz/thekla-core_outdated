export class NoSuchAbilityError extends Error {
    constructor(...args: any[]) {
        super(...args)
        Error.captureStackTrace(this, NoSuchAbilityError)
    }
}