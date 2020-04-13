export enum HandleStatus {
  REJECT,
  RESOLVED,
  PENDING,
  UNRESOLVED
}

export interface Route {
  name: string,
  path: String
  fullPath: string,
  matched: any[],
  params: object,
  query: object
}

export interface Transition {
  to: Route | null,
  from: Route | null,
  next: (param?: any) => void,
  abort: (reason?: object | Error) => void,
  redirect: (route: object | string) => void
}

export class HandlerTansition implements Transition {

  private transition: Transition

  public status: HandleStatus

  public context: object

  constructor(transition: Transition, context: object) {
    this.context = JSON.parse(JSON.stringify(context))
    this.transition = transition
    this.status= HandleStatus.UNRESOLVED
  }

  get to() {
    return this.transition.to
  }

  get from() {
    return this.transition.from
  }

  get isNotResolved() {
    return this.status === HandleStatus.UNRESOLVED
  }

  next = (route: any) => {
    if (this.isNotResolved) {
      this.status = HandleStatus.RESOLVED
      this.transition.next(route)
    }
  }

  abort = (reason: any) => {
    if (this.isNotResolved) {
      this.status = HandleStatus.REJECT
      reason ? this.transition.abort(reason) : this.transition.abort()
    }
  }

  redirect = (route: string | object) => {
    if (this.isNotResolved) {
      this.status = HandleStatus.REJECT
      this.transition.redirect(route)
    }
  }

  pending = () => {
    if (this.isNotResolved) {
      this.status = HandleStatus.PENDING
    }
  }
}
