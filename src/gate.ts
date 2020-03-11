import Handler from './handler'
import { Transition } from './transition'
import { Guard, GuardConstructor, BaseCallback, ErrorCallback } from './guard'

interface GateOptions {
  name?: string,
  error?: ErrorCallback,
  context?: object
}

interface Processor extends Function {
  before(cb: BaseCallback): Processor
  after(cb: BaseCallback): Processor
}

export default class Gate {

  static Guard: GuardConstructor = Guard

  private guards: Guard[] = []
  private context: object

  public name: string
  public error: ErrorCallback
  public options: GateOptions

  constructor(options: GateOptions) {
    this.name = options.name
    this.context = options.context || {}
    this.error = options.error || function (transition, error) {
      console.error(error)
      transition.abort(error)
    }
    this.options = options
  }

  static register(name: string, Ctor: GuardConstructor) {
    Object.defineProperty(Gate.prototype, name, {
      get() {
        let guard = new Ctor(this)
        this.guards.push(guard)
        return guard
      }
    })
  }

  build(context = {}): Processor {
    let pipelines = this.guards
    this.guards = []
    let beforeActions: Guard[] = []
    let afterActions: Guard[] = []

    let processor: any = (transition: Transition) => {
      let handler = new Handler(this, transition, { ...this.context, ...context })
      let guards = beforeActions.concat(pipelines).concat(afterActions)
      return handler.exec(guards)
    }

    processor.before = (callback: BaseCallback) => {
      beforeActions.push(new Guard(this, callback))
      return processor
    }

    processor.after = (callback: BaseCallback) => {
      afterActions.push(new Guard(this, callback))
      return processor
    }

    return processor
  }
}
