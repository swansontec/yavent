# yavent

[![Build Status](https://travis-ci.com/swansontec/yavent.svg?branch=main)](https://travis-ci.com/swansontec/yavent)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> A lightweight & flexible event library.

This library makes it easy to create ad-hoc events. Just call either `makeEvent` or `makeEvents` to create a pair of subscriber and emitter functions. The subscriber function hooks callbacks up to the event, and the emitter function triggers those callbacks. Here is an example (using Typescript):

```typescript
import { Event, makeEvent } from 'yavent'

// Create a subscriber & emitter pair:
const [onMessage, emitMessage]: Event<string> = makeEvent()

// Subscribe:
const unsubscribe = onMessage(message => {
  console.log(message)
})

// Emit:
emitMessage('Hello, world!')

// Unsubscribe:
unsubscribe()
```

The subscriber and emitter returned from `makeEvent` only manage a single event. If you would like to use multiple named events with the same subscriber and emitter pair, just use `makeEvents` instead:

```typescript
import { Events, makeEvents } from 'yavent'

// Gives the payload type for each event:
interface MyEvents {
  message: string
  cancel: undefined
}

// Create a subscriber & emitter pair for our events:
const [on, emit]: Events<MyEvents> = makeEvents()

// Subscribe:
const unsubscribes = [
  on('message', message => console.log(message)),
  on('cancel', () => console.log('bye!'))
]

// Emit some events:
emit('message', 'Hello, world!')
emit('cancel', undefined)

// Unsubscribe:
unsubscribes.forEach(f => f())
```

That is the entire library.

- Zero external dependencies
- 100% test coverage
- Built-in definitions for Typescript & Flow
- 0.3K minified + gzip

## Why yet another event library?

Minimalism isn't about doing less; it's about doing a few things really, really well. Yavent is the simplest, highest-quality event library I know how to write.
