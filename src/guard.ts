import Gate from './gate'
import { HandlerTansition } from './transition'

interface GuardCallback {
  is: BaseCallback
  not: BaseCallback
  equal: ValueCallback
  error: ErrorCallback
}

export type BaseCallback = (transition: HandlerTansition) => void | boolean | Promise<boolean | void>

export type ValueCallback = (transition: HandlerTansition, val: any) => void | boolean | Promise<boolean | void>

export type ErrorCallback = (transition: HandlerTansition, error: Error) => void | boolean | Promise<boolean | void>

export interface GuardConstructor {
  new (gate: Gate, canActivate?: BaseCallback): Guard
}

export class Guard {
  
  static DEFAULT_EQUAL: Symbol = Symbol('default equal callback')

  protected gate: Gate
  private equals: Map<any, Function> = new Map()
  private cb: GuardCallback
  
  public canActivate: BaseCallback = () => true

  constructor (gate: Gate, canActivate?: BaseCallback) {
    this.gate = gate
    this.equals = new Map<string, Function>()
    this.cb = initGuardCallback(gate)

    canActivate && (this.canActivate = canActivate)
  }

  is (cb: BaseCallback): Guard {
    this.cb.is = this._bind(cb)
    return this
  }

  not (cb: BaseCallback): Guard {
    this.cb.not = this._bind(cb)
    return this
  }

  equal (value: any = Guard.DEFAULT_EQUAL, cb: ValueCallback): Guard {
    cb = this._bind(cb)
    if (Array.isArray(value)) {
      value.forEach(val => this.equals.set(val, cb))
    } else {
      this.equals.set(value, cb)
    }
    return this
  }

  error (cb: ErrorCallback): Guard {
    this.cb.error = this._bind(cb)
    return this
  }

  end (): Gate {
    return this.gate
  }

  _bind (cb: Function) {
    if (!cb || typeof cb !== 'function') {
      throw new Error(`${cb} is not a function`)
    }
    return cb.bind(this.gate)
  }
}

function initGuardCallback (gate: Gate): GuardCallback {
  return {
    is: () => true,
    not: () => true,
    error: gate.error,
    equal: (transition, val) => {
      if (this.equals.has(val)) {
        return this.equals.get(val)(transition, val)
      } else if (this.equals.has(Guard.DEFAULT_EQUAL)) {
        return this.equals.get(Guard.DEFAULT_EQUAL)(transition, val)
      } else {
        return true
      }
    }
  }
}
