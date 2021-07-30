// @flow

export type Callback<T> = (payload: T) => void
export type Unsubscribe = () => void

// Standalone events:
export type OnEvent<T> = (callback: Callback<T>) => Unsubscribe
export type EmitEvent<T> = (payload: T) => void
export type Event<T> = [OnEvent<T>, EmitEvent<T>]

// Named events:
export type OnEvents<T> = {
  <Name: $Keys<T>>(
    name: Name,
    callback: Callback<$ElementType<T, Name>>
  ): Unsubscribe,

  all: (
    callback: <Name: $Keys<T>>(
      name: Name,
      payload: $ElementType<T, Name>
    ) => void
  ) => Unsubscribe
}
export type EmitEvents<T> = <Name: $Keys<T>>(
  name: Name,
  payload: $ElementType<T, Name>
) => void
export type Events<T> = [OnEvents<T>, EmitEvents<T>]

declare export function makeEvent<T>(): Event<T>
declare export function makeEvents<T>(): Events<T>
