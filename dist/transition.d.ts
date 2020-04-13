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
    matched: any[];
    params: object;
    query: object;
}
export interface Transition {
    to: Route | null;
    from: Route | null;
    next: (param?: any) => void;
    abort: (reason?: object | Error) => void;
    redirect: (route: object | string) => void;
}
export declare class HandlerTansition implements Transition {
    private transition;
    status: HandleStatus;
    context: object;
    constructor(transition: Transition, context: object);
    get to(): Route;
    get from(): Route;
    get isNotResolved(): boolean;
    next: (route: any) => void;
    abort: (reason: any) => void;
    redirect: (route: string | object) => void;
    pending: () => void;
}
