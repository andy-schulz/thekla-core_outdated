export const checkClientName = (clientName: string): void => {
    if (!clientName)
        throw new Error(`invalid client name '${clientName}'`);

    const regex = /^[a-zA-Z0-9_\-]+$/;
    if (!clientName.match(regex))
        throw new Error(`client name '${clientName}' contains invalid characters. Allowed characters are: [a-z]*[A-Z]*[_-]*[0-9]*`);
};