export interface Annotator<WD> {
    reset(driver: WD): Promise<WD>;
    hideTM(client: WD): Promise<WD>;
    displayTM(driver: WD, testMessage: string): Promise<WD>;
    hlight(driver: WD, element: object): Promise<void>;
}