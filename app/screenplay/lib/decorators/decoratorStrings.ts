export const stringReplace = function (output: string) {
    return function () {
        const replacer = (match: string) => {
            const newMatch = match.replace("<<", "").replace(">>", "");
            // @ts-ignore
            return this[newMatch] ? (this[newMatch].constructor.name === "Object" ? JSON.stringify(this[newMatch]) : this[newMatch].toString()) : "<<not found>>"
        };

        // /(/(?<=<<)([a-z]*[A-Z]*)*(?=>>)/g
        return output.replace(/<<([a-z]*[A-Z]*)*>>/g, replacer);
    }
};