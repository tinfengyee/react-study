useFormStatus 是一个提供上次表单提交状态信息的 Hook。

useFormStatus 仅会返回父级 <form> 的状态信息。

如果调用 useFormStatus 的组件未嵌套在 <form> 中，status.pending 总是返回 false。请验证 useFormStatus 是否在 <form> 元素的子组件中调用。

useFormStatus 不会追踪同一组件中渲染的 <form> 的状态。参阅 陷阱 以了解更多详细信息。