import { GuardConstructor, BaseCallback, ErrorCallback } from './guard';
interface GateOptions {
    name?: string;
    error?: ErrorCallback;
    context?: object;
}
interface Processor extends Function {
    before(cb: BaseCallback): Processor;
    after(cb: BaseCallback): Processor;
}
export default class Gate {
    static Guard: GuardConstructor;
    private guards;
    private context;
    name: string;
    error: ErrorCallback;
    options: GateOptions;
    constructor(options: GateOptions);
    static register(name: string, Ctor: GuardConstructor): void;
    build(context?: {}): Processor;
}
export {};
