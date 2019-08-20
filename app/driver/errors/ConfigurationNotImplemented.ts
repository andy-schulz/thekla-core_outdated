
class ConfigurationNotImplementedError extends Error {
    public  constructor(framework: string, property: string, value: string) {
        super(`
        ${framework} configuration for Property: '${property}' not implemented.
        passed value: '${value}'
        `);
        Error.captureStackTrace(this, ConfigurationNotImplementedError)
    }
}

export class ConfigurationNotImplemented {

    private property: string = ``;

    public static forFramework(framework: string): ConfigurationNotImplemented {
        return new ConfigurationNotImplemented(framework)
    }

    public andProperty(property: string): ConfigurationNotImplemented {
        this.property = property;
        return this;
    }

    public withValue(value: string): ConfigurationNotImplementedError {
        return new ConfigurationNotImplementedError(this.framework, this.property, value);
    }

    private constructor(private framework: string) {

    }
}

