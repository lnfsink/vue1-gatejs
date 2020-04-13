import Gate from './gate';
import { HandlerTansition } from './transition';
export declare type BaseCallback = (transition: HandlerTansition) => void | boolean | Promise<boolean | void>;
export declare type ValueCallback = (transition: HandlerTansition, val: any) => void | boolean | Promise<boolean | void>;
export declare type ErrorCallback = (transition: HandlerTansition, error: Error) => void | boolean | Promise<boolean | void>;
export interface GuardConstructor {
    new (gate: Gate, canActivate?: BaseCallback): Guard;
}
export declare class Guard {
    static DEFAULT_EQUAL: Symbol;
    protected gate: Gate;
    private equals;
    private cb;
    canActivate: BaseCallback;
    constructor(gate: Gate, canActivate?: BaseCallback);
    is(cb: BaseCallback): Guard;
    not(cb: BaseCallback): Guard;
    equal(value: any, cb: ValueCallback): Guard;
    error(cb: ErrorCallback): Guard;
    end(): Gate;
    _bind(cb: Function): any;
}
