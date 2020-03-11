export declare enum HandleStatus {
    REJECT = 0,
    RESOLVED = 1,
    PENDING = 2,
    UNRESOLVED = 3
}
export interface Route {
    name: string;
    path: String;
    fullPath: string;
    matched: Array<any>;
    params: Object;
    query: Object;
}
export interface Transition {
    to: Route | null;
    from: Route | null;
    next: () => void;
    abort: (reason?: Object | Error) => void;
    redirect: (route: Object | string) => void;
}
export declare class HandlerTansition implements Transition {
    private transition;
    status: HandleStatus;
    context: Object;
    constructor(transition: Transition, context: Object);
    get to(): Route;
    get from(): Route;
    get isNotResolved(): boolean;
    next(): void;
    abort(reason: any): void;
    redirect(route: string | Object): void;
    pending(): void;
}
