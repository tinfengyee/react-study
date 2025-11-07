React 组件应该始终具有 纯粹的渲染逻辑。这意味着如果其 props、state 和 context 没有改变，则必须返回相同的输出。通过使用 memo，你告诉 React 你的组件符合此要求，因此只要其 props 没有改变，React 就不需要重新渲染。即使使用 memo，如果它自己的 state 或正在使用的 context 发生更改，组件也会重新渲染。

> 注意
>
> React 编译器 会自动为所有组件应用与 memo 等价的优化，从而减少手动记忆化的需要。你可以使用编译器自动处理组件记忆化。

```tsx
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```