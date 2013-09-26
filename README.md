timestream-filters
=====

[![NPM](https://nodei.co/npm/timestream-filters.png)](https://nodei.co/npm/timestream-filters/)


[![david-dm](https://david-dm.org/brycebaril/timestream-filters.png)](https://david-dm.org/brycebaril/timestream-filters/)
[![david-dm](https://david-dm.org/brycebaril/timestream-filters/dev-status.png)](https://david-dm.org/brycebaril/timestream-filters#info=devDependencies/)

Filter functions for sequential objectMode data, e.g. timeseries data.

```javascript
var spigot = require("stream-spigot")
var concat = require("concat-stream")

var filters = require("timestream-filters")

function stream() {
  return spigot({objectMode: true}, [
    {v: 50, foo: 150},
    {v: 100, foo: 1100},
    {v: 150, foo: 1150},
    {v: 250, foo: 1250},
    {v: 500, foo: 1500},
    {v: 550, foo: 1550},
  ])
}

stream().pipe(filters.range("v", 120, 500)).pipe(concat(console.log))

/*
[ { v: 150, foo: 1150 },
  { v: 250, foo: 1250 },
  { v: 500, foo: 1500 } ]
 */

stream().pipe(filters.rtrim(3)).pipe(concat(console.log))

/*
[ { v: 250, foo: 1250 },
  { v: 500, foo: 1500 },
  { v: 550, foo: 1550 } ]
 */

stream().pipe(filters.ltrim(3)).pipe(concat(console.log))

/*
[ { v: 50, foo: 150 },
  { v: 100, foo: 1100 },
  { v: 150, foo: 1150 } ]
 */

function fifties(record) {
  return ((record.foo / 50) % 2) == 0
}

stream().pipe(filters.filter(fifties)).pipe(concat(console.log))

/*
[ { v: 100, foo: 1100 },
  { v: 500, foo: 1500 } ]
 */


```

API
===

`timestream-filters` provides four filtering transforms for ordered objectMode streams.

  * range
  * rtrim
  * ltrim
  * scrub
  * filter

`range(seqKey, start, end)`
---

Only forward records where the sequence key `seqKey` is between `start` and `end` *inclusively* to downstream.

`rtrim(n)`
---

Trim the stream to `n` records from the right, e.g. the latest `n` records.

`ltrim(n)`
---

Trim the stream to `n` records from the left, e.g. the first `n` records.

`scrub()`
---

Remove any records that are "empty", that is they have no data beyond the timestamp.

`filter(fn)`
---

Generically filter the stream. Provide a function `fn(record)` that returns true to keep the record for false to discard it.

LICENSE
=======

MIT
