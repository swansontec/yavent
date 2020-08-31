export type Callback<T> = (payload: T) => void
export type Unsubscribe = () => void

// Standalone events:
export type OnEvent<T> = (callback: Callback<T>) => Unsubscribe
export type EmitEvent<T> = (payload: T) => void
export type Event<T> = [OnEvent<T>, EmitEvent<T>]

// Named events:
export type OnEvents<T> = <Name extends keyof T>(
  name: Name,
  callback: Callback<T[Name]>
) => Unsubscribe
export type EmitEvents<T> = <Name extends keyof T>(
  name: Name,
  payload: T[Name]
) => void
export type Events<T> = [OnEvents<T>, EmitEvents<T>]

/**
 * Create a standalone event.
 * Returns a subscriber function and an emitter function.
 */
export function makeEvent<T>(): Event<T> {
  let callbacks: Array<Callback<T>> = []
  let callbacksBusy = false
  let emitting = false

  // Clone the callback list if necessary,
  // so the changes will only apply on the next emit.
  function cloneCallbacks(): void {
    if (callbacksBusy) {
      callbacksBusy = false
      callbacks = callbacks.slice()
    }
  }

  const on: OnEvent<T> = callback => {
    cloneCallbacks()
    callbacks.push(callback)

    let subscribed = true
    return function unsubscribe() {
      if (subscribed) {
        subscribed = false
        cloneCallbacks()
        callbacks.splice(callbacks.indexOf(callback), 1)
      }
    }
  }

  const emit: EmitEvent<T> = payload => {
    if (emitting) {
      throw new Error('An event handler recursively emitted the same event')
    }

    emitting = true
    callbacksBusy = true
    for (let i = 0; i < callbacks.length; ++i) {
      callbacks[i](payload)
    }
    callbacksBusy = false
    emitting = false
  }

  return [on, emit]
}

type EventMap<T> = {
  [Name in keyof T]?: Event<T[Name]>
}

export function makeEvents<T>(): Events<T> {
  const events: EventMap<T> = {}

  const on: OnEvents<T> = (name, callback) => {
    let event = events[name]
    if (event == null) event = events[name] = makeEvent()
    return event[0](callback)
  }

  const emit: EmitEvents<T> = (name, payload) => {
    const event = events[name]
    if (event != null) event[1](payload)
  }

  return [on, emit]
}
