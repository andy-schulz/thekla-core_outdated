import * as fs           from "fs";
import {ActivityLogNode} from "./ActivityLogEntry";

const formatToText = (logPrefix: string, repeat: number, logNode: ActivityLogNode) => {
    return `${logPrefix.repeat(repeat)}[${logNode.name}] - ${logNode.description}${(logNode.activityNodes.map((logEntry: ActivityLogNode): string => {

        return `\n` + formatToText(`${logPrefix}`, repeat + 1, logEntry)

    })).join(``)}`
};

const formatLogContentToHtml = (node: ActivityLogNode): string => {
    return `<span class="logMessage"><span class="activityName">[${node.name}]</span> - <span class="activityDescription">${node.description}</span></span>`
};

export const formatNodeToHtml = (logNode: ActivityLogNode): string => {
    if(logNode.logType === `Task`) {
        return `<li><span class="task">${formatLogContentToHtml(logNode)}</span><ul class="nested">${(logNode.activityNodes.map((logEntry: ActivityLogNode) => {
            return formatNodeToHtml(logEntry)
        })).join(``)}</ul></li>`
    } else if (logNode.logType === `Interaction`) {
        return `<li class="interaction">${formatLogContentToHtml(logNode)}</li>`
    } else {
        throw new Error(`Unknown Node Type ${logNode.logType}`)
    }
};

export const encloseInTag = (text: string, tag: string, style?: string) => {
    return `<${tag}${style ? ` style="${style}"` : ``}>${text}</${tag}>`
};

export const formatLogWithHtmlTags = (logNode: ActivityLogNode) => {
    return`<ul id="ActivityLog">${formatNodeToHtml(logNode)}</ul>`
};

export const formatLogAsHtmlTree = (logNode: ActivityLogNode) => {

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return `${htmlStyle} ${formatLogWithHtmlTags(logNode)} ${functionScript} `
};

export const formatLogWithPrefix = (logPrefix: string = ``): (repeat: number) => (logNode: ActivityLogNode) => string => {

    return (repeat: number): (logNode: ActivityLogNode) => string => {
        return (logNode: ActivityLogNode): string => {
            return formatToText(logPrefix, repeat, logNode)
        }
    }
};

export const encodeLog = (encoding: string = ``): (source: string) => string => {
    return (source: string): string => {
        if(!encoding)
            return source;

        return new Buffer(source).toString(encoding)
    }
};

const activityLogStyle = fs.readFileSync(`app/packages/ActivityLog/ActivityLog.css`);

const htmlStyle = `
<style>
${activityLogStyle.toString()}
</style>
`;

const functionScript = `
<script>
var toggler = document.getElementsByClassName("task");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("task-open");
  });
}
</script>

`;