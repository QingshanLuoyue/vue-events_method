# vue-events_method
vue 中关于事件的实例方法以及模拟实现


# usage
```javascript
import VueEvent from './index.js'
let ev = new VueEvent()
```

### test $on
```javascript
// test $on
ev.$on('onEv', function(emitParam) {
  console.log('test $on: ', emitParam)
  console.log('onEv on')
  console.log('\n************\n')
})
setTimeout(() => {
  ev.$emit('onEv', 'emit 1')
}, 0)
setTimeout(() => {
  ev.$emit('onEv', 'emit 2')
}, 1000)
// 输出
// test $on:  emit 1
// onEv on

// ************

// test $on:  emit 2
// onEv on
```


### test $once
```javascript
// test $once
ev.$once('onceEv', function(emitParam) {
  console.log('test $once: ', emitParam)
  console.log('onceEv on')
  console.log('\n************\n')
})
setTimeout(() => {
  ev.$emit('onceEv', 'emit 3')
}, 2000)
setTimeout(() => {
  ev.$emit('onceEv', 'emit 4')
}, 3000)
// 输出
// test $once:  emit 3
// onceEv on
```


### test $off
```javascript
// test $off
ev.$on('offEv', function(emitParam) {
  console.log('test $off: ', emitParam)
  console.log('offEv on')
  console.log('\n************\n')
})
setTimeout(() => {
  ev.$emit('offEv', 'emit 5')
}, 4000)
setTimeout(() => {
  ev.$emit('offEv', 'emit 6')
  ev.$off('offEv')
}, 5000)
setTimeout(() => {
  ev.$emit('offEv', 'emit 7')
}, 6000)
// 输出
// test $off:  emit 5
// offEv on

// ************

// test $off:  emit 6
// offEv on
```