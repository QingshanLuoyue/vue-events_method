class VueEvent {
    constructor() {
        this._events = Object.create(null)
    }
    $on(event, fn) {
        const vm = this
        //   先判断传进来的 event 是否是个数组
        if (Array.isArray(event)) {
            // 是数组，则循环进行事件注册
            // 多个事件名可以绑定同个函数
            for (let i = 0, l = event.length; i < l; i++) {
                vm.$on(event[i], fn)
            }
        } else {
            // 先判断 vm._events[event] 是否存在， 不存在则设置为空数组 []
            ;(vm._events[event] || (vm._events[event] = [])).push(fn)
        }
        return vm
    }
    $once(event, fn) {
        const vm = this
        // 将目标函数 fn 包装起来
        // 注册时候使用包装的 on 函数注册
        // 这样 on 函数被执行一次时，首先把自己从注册事件列表中销毁
        // 然后执行实际的目标函数 fn

        // 如果是一开始就使用目标函数 fn 注册
        // 然后在目标函数 fn 执行时候，销毁fn，做不到在fn里面做销毁自己的动作，所以需要把fn进行一次包装
        function on() {
            vm.$off(event, on)
            fn.apply(vm, arguments)
        }
        on.fn = fn // 因为对目标函数做了包装，此处是方便销毁事件时候做判断是否有事件要销毁以及要销毁的是哪个 fn
        vm.$on(event, on)
        return vm
    }
    $off(event, fn) {
        const vm = this

        //   如果没有参数，则将vm_events 设置为空，表示销毁全部事件
        if (!arguments.length) {
            vm._events = Object.create(null)
            return vm
        }

        //   如果event 是个数组，则遍历event，对每个事件进行销毁
        if (Array.isArray(event)) {
            for (let i = 0, l = event.length; i < l; i++) {
            vm.$off(event[i], fn)
            }
            return vm
        }

        // 上面两个是特殊情况，这里才是正常销毁逻辑
        // 先通过传入的 event 字符串从 _events 对象中去取值
        // 判断该 事件名底下是否有绑定的目标函数，没有则返回当前组件实例，啥也不做
        const cbs = vm._events[event]
        if (!cbs) {
            return vm
        }

        // 或者没有传入之前注册时候的目标函数
        // 那么就将 event 对应的所有目标函数都销毁
        // vm._events[event] = null
        if (!fn) {
            vm._events[event] = null
            return vm
        }

        // 如果有传入 目标函数
        // 对取出的 event 对应的 目标函数进行倒序遍历
        // vm._events[event]的值，经过前面的过滤，到这里一定是个数组
        // 倒序遍历一个个数组元素，判断每一个元素与传入要销毁的目标函数是否相等
        // 相等，则使用splice 进行删除
        // 删除数组的操作使用倒序处理，不至于在删除元素的时候，后续的元素序号向前进位，导致处理结果有误
        let cb
        let i = cbs.length
        while (i--) {
            cb = cbs[i]
            if (cb === fn || cb.fn === fn) {
            cbs.splice(i, 1)
                break
            }
        }
        return vm
    }
    $emit(event) {
        const vm = this
        //   通过传入的 event 从 _events对象中获取目标函数
        let cbs = vm._events[event]
        if (cbs) {
            // 如果有相应的目标函数
            // 获取除了第一个事件名之外的其他参数
            const args = Array.prototype.slice.call(arguments, 1)
            // 对得到的目标函数进行遍历，并传入相关参数
            for (let i = 0, l = cbs.length; i < l; i++) {                
                // 这里就不做 promise 的处理了，直接调用
                cbs[i].apply(vm, args)
            }
        }
        return vm
    }
}

let ev = new VueEvent()
ev.$on('console', function(emitParam) {
    console.log('console on')
    console.log('emitParam: ', emitParam)
    emitParam()
})

setTimeout(() => {
    ev.$emit('console', 'emit 1')
}, 1000)
setTimeout(() => {
    ev.$emit('console', 'emit 2')
}, 2000)