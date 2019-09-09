// eslint-disable-next-line quotes
export type ActivityLogEntryType = "Task" | "Interaction";

export interface ActivityLogNode {
    name: string;
    description: string;
    activityNodes: ActivityLogNode[];
}

export class ActivityLogEntry {
    private subEntries: ActivityLogEntry[] = [];

    public constructor(
        private activityName: string,
        private activityDescription: string,
        private activityType: ActivityLogEntryType,
        public parent: ActivityLogEntry | null
    ) {

    }

    public addActivityLogEntry(entry: ActivityLogEntry): void {
        this.subEntries.push(entry);
    }

    public getLogTree(): ActivityLogNode {
        return {
            name: this.activityName,
            description: this.activityDescription,
            activityNodes: this.subEntries.map((logEntry: ActivityLogEntry): ActivityLogNode => {
                return logEntry.getLogTree();
            })
        }
    }
}