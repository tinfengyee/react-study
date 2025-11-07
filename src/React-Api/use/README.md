use 是一个 React API，它可以让你读取类似于 Promise 或 context 的资源的值。

处理 rejected Promise 
在某些情况下，传递给 use 的 Promise 可能会被拒绝（rejected）。可以通过以下方式处理 rejected Promise：

使用错误边界向用户显示错误信息。
使用 Promise.catch 提供替代值。