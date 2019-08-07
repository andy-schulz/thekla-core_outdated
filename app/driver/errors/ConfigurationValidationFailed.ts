
class ConfigurationValidationFailedError extends Error {
    public  constructor(attribute: string, givenValue: string, expectedValue: string) {
        super(`
        Did not understand the configuration for attribute: '${attribute}'.
        got: '${givenValue}'
        expected: ${expectedValue}
        `);
        Error.captureStackTrace(this, ConfigurationValidationFailedError)
    }
}

export class ConfigurationValidationFailed {

    private givenValue: string = ``;

    public static forAttribute(attribute: string): ConfigurationValidationFailed {
        return new ConfigurationValidationFailed(attribute)
    }

    public got(givenValue: string): ConfigurationValidationFailed {
        this.givenValue = givenValue;
        return this;
    }

    public expected(expectedValue: string) {
        return new ConfigurationValidationFailedError(this.attribute, this.givenValue, expectedValue);
    }

    private constructor(private attribute: string) {

    }
}

