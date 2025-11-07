React 只会在非紧急更新期间阻止不必要的后备方案。这意味着它不会阻止紧急更新的 fallback。你必须使用 startTransition 或 useDeferredValue 这样的 API 来选择性的优化。

如果你的路由集成了 Suspense，它将会自动将更新包装到 startTransition 中。