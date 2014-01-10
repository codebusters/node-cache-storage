(function() {
  var RedisStorage, Storage, Cache, client
          __hasProp = {}.hasOwnProperty,
          __extends = function(child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key))
        child[key] = parent[key];
    }
    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  };

  Storage = require('./Storage');

  Cache = require('../Cache');

  HiredisSimple = require('hiredis-simple');

  RedisStorage = (function(_super) {
    __extends(RedisStorage, _super);

    RedisStorage.prototype.data = null;

    RedisStorage.prototype.meta = null;

    RedisStorage.prototype.client = null;

    function RedisStorage(redisStorageConfig) {
      this.data = {};
      this.meta = {};
      this.client = new HiredisSimple.Client();
      this.host = "127.0.0.1" || redisStorageConfig.host;
      this.port = 6379 || redisStorageConfig.port;
      this.prefix = {
        root: "cache-storages:",
        data: "data:",
        meta: "meta:"
      } || redisStorageConfig.prefix;
    }

    RedisStorage.prototype.getKey = function(prefix, key) {
      var returnKey = this.prefix.root + this.cache.namespace + ":" + this.prefix[prefix] + key;
      return returnKey;
    }

    RedisStorage.prototype.read = function(key) {
      this.data = this.getData(key);
      if (typeof this.data[key] === 'undefined') {
        return null;
      } else {
        if (this.verify(this.findMeta(key))) {
          return this.data[key];
        } else {
          this.remove(key);
          return null;
        }
      }
    }

    RedisStorage.prototype.getData = function(key) {
      if (this.data[key]) {
        return this.data;
      }
      this.client.connect(this.host, this.port);
      var reply = this.client.get(this.getKey("data", key));
      this.client.disconnect();
      if (reply) {
        this.data[key] = JSON.parse(reply);
      }
      return this.data;
    };

    RedisStorage.prototype.getMeta = function(key) {
      if (this.meta[key]) {
        return this.meta[key];
      }
      this.client.connect(this.host, this.port);
      var reply = this.client.get(this.getKey("meta", key));
      this.client.disconnect();
      if (reply) {
        this.meta[key] = JSON.parse(reply);
      }
      return this.meta;
    };

    RedisStorage.prototype.write = function(key, data, dependencies) {
      if (dependencies === null) {
        dependencies = {};
      }
      this.data[key] = data;
      this.meta[key] = dependencies;
      this.client.connect(this.host, this.port);
      this.client.set(this.getKey("data", key), JSON.stringify(data));
      this.client.set(this.getKey("meta", key), JSON.stringify(dependencies));
      this.client.disconnect();
      return this;
    };

    return RedisStorage;

  })(Storage);

  module.exports = RedisStorage;

}).call(this);
