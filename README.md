# Vue Gate base on Vuejs v1

## 项目背景

在使用 vue-router 单页面路由时，在进入页面之前往往需要做一些判断，例如检测用户是否满足某种条件，可能需要有检测多个条件，并且这种检测可能在多个页面使用，本项目就为了解决这个问题。在使用这个库之后，页面判断的形式如下

```js
import gate from 'gate'

export default {
  data: () => ({}),
  // ...
  route: {
    canActivate: gate
      .Logined
        .not(({ redirect }) => redirect({ name: 'login' }))
        .end()
      .Subscribed
        .not(({ redirect }) => redirect({ name: 'subscribe' }))
        .end()
      .build()
  }
}
```

在上述代码中

- 如果用户没有登录，则跳转到登录页面，否则进入下一个流程
- 如果用户没有订阅过本活动，则跳转到活动订阅页面
- 进入本页面

## 如何使用

```js
// path/to/gate.js
import Gate, { Guard } from 'gate'

/**
 * 注册新的 Guard
 *
 * @param {string} guardName
 * @param {class} Ctor
 */
Gate.register('Logined', class extends Guard {
  canActivate (transition) {
    return isLogined()
      ? this.cb.is(transition)
      : this.cb.not(transition)
  }
})

export default new Gate()
```

```js
import gate from 'path/to/gate'

export default {
  data: () => ({}),
  // ...
  route: {
    canActivate: gate
      .Logined
        .not(({ redirect }) => redirect({ name: 'login' }))
        .end()
      .build()
  }
}
```

## Guard 对象

简单来说，上述例子中的 `gate.Follower` 返回的就是一个 `Guard` 对象，该对象注册一些回调函数，是否能生效取决于 注册的 `Guard` 是否支持，下面介绍一下 `Guard` 支持的所有回调

- is(Transition)、not(Transition)

   这两个回调组合使用，相当于平常语法中的 if - else 语法，例如如下例子

   ```js
   import gate from 'path/to/gate'

   export default {
     data: () => ({}),
     // ...
     route: {
       canActivate: gate
         .Logined
           .not(({ redirect }) => redirect({ name: 'login' }))
           .end()
         .build()
     }
   }
   ```

- equal(val, Transition)

   此回调函数可多次调用，相当于平常语法中的 switch-case 语法，例如如下例子

   ```js
   import gate from 'path/to/gate'

   export default {
     data: () => ({}),
     // ...
     route: {
       canActivate: gate
         .UserStatus // switch(userStatus)
           // case 'noRegister': t.redirect('register')
           .equal('noRegister', t => t.redirect('register'))
           // case 'wait': t.redirect('wait')
           .equal('wait', t => t.redirect('wait'))
           // case 'reject': t.redirect('reject')
           .equal('reject', t => t.redirect('reject'))
            // default: t.text()
           .equal(t => t.next())
           .end()
         .build()
     }
   }
   ```

- error(error, Transition)

   当 Guard 执行出错时候的回调函数

> 并不是所有回调都必须注册，如果不注册回调函数，则表示不进行处理，进入到链条的下一步，而如果在链条的某个节点进过了某种处理(调用next, abort, redirect 中的任意一个函数)，则整个链条就会跳出，不会继续往下执行，如果整个链条执行完都没有做任何处理，则默认作为 next 处理

## 前置钩子(before) 和 后置钩子(after)

在对一些常用逻辑进行包装之后，可能我们还有会一些针对特殊情况的小改动，可以使用前置钩子和后置钩子解决

```js
import gate from 'path/to/gate'

export default {
  data: () => ({}),
  // ...
  route: {
    canActivate: gate
      .Logined
        .not(({ redirect }) => redirect({ name: 'login' }))
        .end()
      .build()
      .before(transition => {
        // 前置钩子，在整个 gate 链条执行之前调用
        // 若此函数内执行了 transition 的 next、abort、redirect 方法，则整个链条不会执行
      }).after(transition => {
        // 前置钩子，在整个 gate 链条执行之后调用
        // 若在 gate 链条内不 执行了 transition 的 next、abort、redirect 方法，则 after 钩子不会执行
      });
  }
}
```

> before、after 可以多次调用，注册多个钩子函数

## 上下文对象

有的时候，我们可能存在上一层的逻辑判断会对下一层的逻辑判断产生影响的情况，此时我们可以使用 transition.context 来解决  

transition.context 在整个 gate 执行链中共享，在并在此次页面加载时有效，页面加载完成销毁，下次页面加载时会重新初始化

我们可以在 build 的时候传入一个对象作为 context 的默认值，如果不传入，则 context 默认为 {}

```js
import gate from 'path/to/gate'

export default {
  data: () => ({}),
  // ...
  route: {
    canActivate: gate
      .Logined
        .is(({ context }) => {
          console.log(context.promoName); // 打印 test-promo
          context.logined = true
        })
        .not(({ redirect }) => redirect({ name: 'login' }))
      .Subscribe
        .is(({ next, context }) => {
          if (context.logined) {
            // ...
          } else {
            // ...
          }
          next()
        })
        .not(({ redirect }) => redirect({ name: 'subscribe' }))
      .build({
        promoName: 'test-promo'
      });
  }
}
```
