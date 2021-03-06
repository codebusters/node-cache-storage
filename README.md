# cache-storage

Advanced cache storage inspired by cache in [Nette framework](http://doc.nette.org/en/caching).

Can be also used in browser for example with [simq](https://npmjs.org/package/simq).

## Installing

```
$ npm install cache-storage
```

## Creating cache

```
var Cache = require('cache-storage');
var FileStorage = require('cache-storage/Storage/FileStorage');

var cache = new Cache(new FileStorage('./temp'), 'namespace');
```

You have to set storage which you want to use (their list below) and name of namespace for cache, because you can use
more than one independent caches.

## Available storages

* FileStorage (cache-storage/Storage/FileStorage - saving data to json files)
* BrowserLocalStorage (cache-storage/Storage/BrowserLocalStorage - saving data to HTML5 local storage)
* DevNullStorage (cache-storage/Storage/DevNullStorage - does not save anything and load always null)
* MemoryStorage (cache-storage/Storage/MemoryStorage - saving data just into storage's class property)

More storages will be added in future.

### Only node storages

* FileStorage

### Only browser storages

* BrowserLocalStorage

## Loading & saving

```
var data = cache.load('some_data');

if (data === null) {
	// let's save data to cache
	data = cache.save('some_data', 'some value of some_data');
}

console.log(data);		// output: some value of some_data
```

There is also other more simple way to save data to cache if they are not in cache already.

```
var data = cache.load('some_data', function() {
	return 'some value of some_data';
});
```

When no data were found, then fallback anonymous function is called and data from return statement are used.
Cache.save function always return given data.

## Removing

```
if (cache.load('some_data') !== null) {
	cache.remove('some_data');

	// other way: cache.save('some_data', null);
}
```

## Expiration

You can set some conditions and information for every data which will be used for auto expiration or for your manual
expiration.

```
cache.save('some_data', 'some value of some_data', {
	files: ['./images.txt', './info.txt'],		// expiration by files
	tags: ['image', 'article'],					// tags for manual expiration
	expire: '2015-12-24 18:00',					// expire data in given date (other examples below)
	items: ['some_other_data'],					// expire if other data in cache expires
	priority: 50								// example below
});
```

### Expiration by files

If you set files to save function, then that item will expire when some of given files is changed.

This type of expiration can be used also in browser, but only with [simq](https://npmjs.org/package/simq) and with allowed
option `filesStats`. See at documentation of [simq](https://npmjs.org/package/simq).

### Expiration by tags

```
cache.clean({
	tags: ['image']
});
```

Now every item in cache with tag image will be removed.

### Expiration by date

There are two ways to expire data by date. First way is to set exact date in YYYY-MM-DD HH:mm format. Second way is to
set literal object with information about adding date to actual date.

```
cache.save('some_data', 'some value of some_data', {
	expire: {days: 1}
});
```

Now some_data will expire tomorrow. You can see full documentation in moment.js [documentation](http://momentjs.com/docs/#/manipulating/add/).

### Items expiration

Every cache item can also depend on other cached items. If some of these other items is invalidated, then also this main
is invalidated.

### Expiration by priority

```
cache.clean({
	priority: 100
});
```

All items with priority 100 or below will expire.

## Removing all in namespace

```
cache.clean(Cache.ALL);		// or cache.clean('all');
```

## Tests

```
$ npm test
```

## Changelog

* 1.4.1
	+ Can not use some js reserved words

* 1.4.0
	+ Bug with tests
	+ Added support for invalidating cache in browser by files (only with [simq](https://npmjs.org/package/simq))

* 1.3.0
	+ Added DevNullStorage
	+ Added MemoryStorage
	+ FileStorage throws an error on browser
	+ Refactoring storages

* 1.2.4
	+ Rewritten tests
	+ Added tests for browser
	+ Refactoring storages
	+ Bad encoding in FileStorage

* 1.2.3
	+ Shortcut for base Storage class

* 1.2.2
	+ Cache throw error if storage is not instance of Storage class

* 1.2.1
	+ FileStorage throw error if path does not exists or if it is a directory

+ 1.2.0
	+ Bugs in dependencies parser
	+ Written some mocha tests
	+ Added changelog

+ 1.1.2
	+ Added MIT license

* 1.1.1
	+ Renamed repository (cache-storage => node-cache-storage)

* 1.1.0
	+ Added support for HTML5 local storage

* 1.0.2
	+ Removed dependency on crypto

* 1.0.1
	+ Removed hard dependencies on fs and path
	+ Trying other hash methods usable in browser


* 1.0.0
	+ Initial version