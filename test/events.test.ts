/* global describe, it */

import { makeAssertLog } from 'assert-log'

import { Events, makeEvents } from '../src'

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

    // Subscribe:
    const unsubscribes = [
      on('message', message => log('a: ' + message)),
      on('message', message => log('b: ' + message)),
      on('cancel', () => log('c'))
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
