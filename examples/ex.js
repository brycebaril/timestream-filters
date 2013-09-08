var spigot = require("stream-spigot")
var concat = require("concat-stream")

var filters = require("../")

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
stream().pipe(filters.rtrim(3)).pipe(concat(console.log))
stream().pipe(filters.ltrim(3)).pipe(concat(console.log))

function fifties(record) {
  return ((record.foo / 50) % 2) == 0
}

stream().pipe(filters.filter(fifties)).pipe(concat(console.log))