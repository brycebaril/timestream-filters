var test = require("tape").test

var spigot = require("stream-spigot")
var concat = require("concat-stream")

var filters = require("../")

test("init", function (t) {
  t.equals(typeof filters.range, "function", "range is a function")
  t.equals(typeof filters.rtrim, "function", "rtrim is a function")
  t.equals(typeof filters.ltrim, "function", "ltrim is a function")
  t.equals(typeof filters.scrub, "function", "scrub is a function")
  t.equals(typeof filters.filter, "function", "filter is a function")

  t.end()
})

test("range empty", function (t) {
  t.plan(1)

  function check(records) {
    var expected = [ ]
    t.deepEquals(records, expected, "Got empty result")
  }

  var stream = spigot({objectMode: true}, [ ])

  stream.pipe(filters.range("v", 120, 500)).pipe(concat(check))
})

test("range", function (t) {
  t.plan(1)

  function check(records) {
    var expected = [
      {v: 150, foo: 1150},
      {v: 250, foo: 1250},
      {v: 500, foo: 1500},
    ]
    t.deepEquals(records, expected, "Got expected records")
  }

  var stream = spigot({objectMode: true}, [
    {v: 50, foo: 150},
    {v: 100, foo: 1100},
    {v: 150, foo: 1150},
    {v: 250, foo: 1250},
    {v: 500, foo: 1500},
    {v: 550, foo: 1550},
  ])

  stream.pipe(filters.range("v", 120, 500)).pipe(concat(check))
})

test("rtrim empty", function (t) {
  t.plan(1)

  function check(records) {
    var expected = [ ]
    t.deepEquals(records, expected, "Got empty result")
  }

  var stream = spigot({objectMode: true}, [ ])

  stream.pipe(filters.rtrim(3)).pipe(concat(check))
})

test("rtrim", function (t) {
  t.plan(1)

  function check(records) {
    var expected = [
      {v: 250, foo: 1250},
      {v: 500, foo: 1500},
      {v: 550, foo: 1550},
    ]
    t.deepEquals(records, expected, "Got expected records")
  }

  var stream = spigot({objectMode: true}, [
    {v: 50, foo: 150},
    {v: 100, foo: 1100},
    {v: 150, foo: 1150},
    {v: 250, foo: 1250},
    {v: 500, foo: 1500},
    {v: 550, foo: 1550},
  ])

  stream.pipe(filters.rtrim(3)).pipe(concat(check))
})

test("ltrim empty", function (t) {
  t.plan(1)

  function check(records) {
    var expected = [ ]
    t.deepEquals(records, expected, "Got empty result")
  }

  var stream = spigot({objectMode: true}, [ ])

  stream.pipe(filters.ltrim(3)).pipe(concat(check))
})

test("ltrim", function (t) {
  t.plan(1)

  function check(records) {
    var expected = [
      {v: 50, foo: 150},
      {v: 100, foo: 1100},
      {v: 150, foo: 1150},
    ]
    t.deepEquals(records, expected, "Got expected records")
  }

  var stream = spigot({objectMode: true}, [
    {v: 50, foo: 150},
    {v: 100, foo: 1100},
    {v: 150, foo: 1150},
    {v: 250, foo: 1250},
    {v: 500, foo: 1500},
    {v: 550, foo: 1550},
  ])

  stream.pipe(filters.ltrim(3)).pipe(concat(check))
})

test("scrub emtpy", function (t) {
  t.plan(1)

  function check(records) {
    var expected = [ ]
    t.deepEquals(records, expected, "Got expected records")
  }

  var stream = spigot({objectMode: true}, [ ])

  stream.pipe(filters.scrub()).pipe(concat(check))
})

test("scrub", function (t) {
  t.plan(1)

  function check(records) {
    var expected = [
      {v: 50, foo: 150},
      {v: 150, foo: 1150},
      {v: 500, foo: 1500},
    ]
    t.deepEquals(records, expected, "Got expected records")
  }

  var stream = spigot({objectMode: true}, [
    {v: 50, foo: 150},
    {v: 100},
    {v: 150, foo: 1150},
    {v: 250},
    {v: 500, foo: 1500},
    {v: 550},
  ])

  stream.pipe(filters.scrub()).pipe(concat(check))
})

test("filter empty", function (t) {
  t.plan(1)

  function check(records) {
    var expected = [ ]
    t.deepEquals(records, expected, "Got empty result")
  }

  var stream = spigot({objectMode: true}, [ ])

  function fn(record) {
    return ((record.foo / 50) % 2) == 0
  }

  stream.pipe(filters.filter(fn)).pipe(concat(check))
})

test("filter", function (t) {
  t.plan(1)

  function check(records) {
    var expected = [
      {v: 100, foo: 1100},
      {v: 500, foo: 1500},
    ]
    t.deepEquals(records, expected, "Got expected records")
  }

  var stream = spigot({objectMode: true}, [
    {v: 50, foo: 150},
    {v: 100, foo: 1100},
    {v: 150, foo: 1150},
    {v: 250, foo: 1250},
    {v: 500, foo: 1500},
    {v: 550, foo: 1550},
  ])

  function fn(record) {
    return ((record.foo / 50) % 2) == 0
  }

  stream.pipe(filters.filter(fn)).pipe(concat(check))
})
