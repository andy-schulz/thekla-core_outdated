
export interface ClientCtrls<D> {
    displayTestMessages: boolean | undefined;
    annotateElement: boolean | undefined;
    getFrameWorkClient: () => Promise<D>;
    pointerButtonDown(button: number): (pr: Promise<void>) => Promise<void>;
    pointerButtonUp(button: number): (pr: Promise<void>) => Promise<void>;
    releaseActions(pr: Promise<void>): Promise<void>;
}