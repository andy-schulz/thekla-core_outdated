
export interface ClientCtrls<D> {
    displayTestMessages: boolean | undefined;
    annotateElement: boolean | undefined;
    getFrameWorkClient: () => Promise<D>;
}