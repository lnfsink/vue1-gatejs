import Gate from './gate'
import { Guard } from './guard'
import { Transition, HandlerTansition, HandleStatus } from './transition'

export default class Handler {

  private gate: Gate
  private transition: HandlerTansition

  constructor (gate: Gate, transition: Transition, context: Object = {}) {
    this.gate = gate
    this.transition = new HandlerTansition(transition, context)
  }

  private async handle (guard: Guard, iterator: Iterator<Guard>) {
    try {
      let result = await guard.canActivate(this.transition)
      return this.handleResult(result, iterator)
    } catch (error) {
      return this.gate.error(this.transition, error)
    }
  }

  private async handleResult (result: any, iterator: Iterator<Guard>) {
    let status = this.transition.status
    if (status === HandleStatus.UNRESOLVED) {
      if (iterator) {
        let { value: nextGuard, done } = iterator.next()
        return done ? result : await this.handle(nextGuard, iterator)
      }
      return result
    }

    switch (status) {
      case HandleStatus.RESOLVED: return true
      case HandleStatus.REJECT: return false
      case HandleStatus.PENDING: return
      default: return result
    }
  }

  exec (guards: Guard[], defaultResult = true) {
    let iterator = guards[Symbol.iterator]()
    return this.handleResult(defaultResult, iterator)
  }
}
