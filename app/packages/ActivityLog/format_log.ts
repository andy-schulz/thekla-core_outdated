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

const htmlStyle = `
<style>
ul, #ActivityLog {
  list-style-type: none;
}

#ActivityLog {
  margin: 0;
  padding: 0;
}

.task {
  cursor: pointer;
  -webkit-user-select: none; /* Safari 3.1+ */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none;
}

.task::before {
  /*content: "\\25B6"; */
  content: "\\25B6";
  color: black;
  display: inline-block;
  margin-right: 6px;
}

.task-open::before {
  -ms-transform: rotate(90deg); /* IE 9 */
  -webkit-transform: rotate(90deg); /* Safari */'
  transform: rotate(90deg);  
}

.nested {
  display: none;
}

.active {
  display: block;
}

.interaction::before {
  content: "\\25B7";
  margin-right: 6px;
}

.logMessage.fail {
    color: red;
}

.activityName {
  color: #ff0bb1;
}

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