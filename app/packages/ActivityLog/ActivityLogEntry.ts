/* eslint-disable quotes */
export type ActivityLogEntryType = "Task" | "Interaction";
export type ActivityStatus = "running" | "failed" | "passed";

export interface ActivityLogNode {
    name: string;
    description: string;
    logType: ActivityLogEntryType;
    status: ActivityStatus;
    activityNodes: ActivityLogNode[];
}

export class ActivityLogEntry {
    private subEntries: ActivityLogEntry[] = [];

    public constructor(
        private activityName: string,
        private activityDescription: string,
        private activityType: ActivityLogEntryType,
        private activityStatus: ActivityStatus,
        public parent: ActivityLogEntry | null
    ) {

    }

    public set status(status: ActivityStatus) {
        this.activityStatus = status;
    }

    public get status() {
        return this.activityStatus;
    }

    public addActivityLogEntry(entry: ActivityLogEntry): void {
        this.subEntries.push(entry);
    }

    public getSubTreeStatusList(): ActivityStatus[] {
        return this.subEntries.map((node: ActivityLogEntry): ActivityStatus => {
            return node.status
        })
    }

    public getLogTree(): ActivityLogNode {
        return {
            name: this.activityName,
            description: this.activityDescription,
            logType: this.activityType,
            status: this.activityStatus,
            activityNodes: this.subEntries.map((logEntry: ActivityLogEntry): ActivityLogNode => {
                return logEntry.getLogTree();
            })
        }
    }
}