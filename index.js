module.exports.range = range
module.exports.rtrim = rtrim
module.exports.ltrim = ltrim
module.exports.scrub = scrub
module.exports.filter = filter

var through2 = require("through2")
var throughFilter = require("through2-filter")

function range(key, start, end) {
  return through2({objectMode: true}, function (record, encoding, callback) {
    if (record[key] >= start && record[key] <= end)
      this.push(record)
    return callback()
  })
}

function rtrim(n) {
  var count = 0
  return through2({objectMode: true}, function (record, encoding, callback) {
    if (this._queue == null) this._queue = []
    this._queue.push(record)
    if (this._queue.length > n) this._queue.shift()
    return callback()
  }, function (callback) {
    var self = this
    this._queue.map(function (r) { self.push(r) })
    return callback()
  })
}

function ltrim(n) {
  var count = 0
  return through2({objectMode: true}, function (record, encoding, callback) {
    if (count++ < n) this.push(record)
    return callback()
  })
}

function ltrim(n) {
  var count = 0
  return through2({objectMode: true}, function (record, encoding, callback) {
    if (count++ < n) this.push(record)
    return callback()
  })
}

function scrub(fn) {
  return throughFilter({objectMode: true}, function (record) {
    return Object.keys(record).length > 1
  })
}

function filter(fn) {
  return throughFilter({objectMode: true}, fn)
}