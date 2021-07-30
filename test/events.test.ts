/* global describe, it */

import { makeAssertLog } from 'assert-log'

import { AllCallbacks, Events, makeEvents } from '../src'

interface MyEvents {
  message: string
  cancel: undefined
}

describe('makeEvents', function () {
  it('creates a simple event', function () {
    const log = makeAssertLog()

    // Create a subscriber & emitter pair for our events:
    const [on, emit]: Events<MyEvents> = makeEvents()

    // Should do nothing:
    emit('message', 'nobody home')

    type OnAll = AllCallbacks<MyEvents>[keyof MyEvents]
    const onAll: OnAll = (name: any, payload: any) => {
      switch (name) {
        case 'message':
          console.log(payload)
          break
        case 'cancel':
          console.log(payload)
          break
      }
    }

    // Subscribe:
    const unsubscribes = [
      on('message', message => log('a: ' + message)),
      on('message', message => log('b: ' + message)),
      on('cancel', () => log('c')),
      on.all(onAll),
      on.all(onAll)
    ]

    // Emit some events:
    emit('message', 'ping')
    log.assert('a: ping', 'b: ping')
    emit('cancel', undefined)
    log.assert('c')

    // Unsubscribe:
    unsubscribes.forEach(f => f())
    emit('message', 'silence')
    log.assert()
  })
})
