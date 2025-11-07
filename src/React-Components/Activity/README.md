当 Activity 的边界被隐藏时，React 会使用 CSS 属性 display: "none" 来隐藏其子元素 。同时，它还会销毁这些子元素的 Effects，并清除所有活动的订阅。

当边界再次可见时，React 将恢复子元素之前的状态，并重新创建它们的 Effects。

