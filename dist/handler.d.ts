import Gate from './gate';
import { Guard } from './guard';
import { Transition } from './transition';
export default class Handler {
    private gate;
    private transition;
    constructor(gate: Gate, transition: Transition, context?: Object);
    private handle;
    private handleResult;
    exec(guards: Guard[], defaultResult?: boolean): any;
}
