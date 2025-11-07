// 减缓渲染速度的工具函数
export function slowRender(ms: number = 100) {
  let now = performance.now();
  while (performance.now() - now < ms) {
    // 不做任何事情...
  }
}
// 延迟一段时间的工具函数
export function delay(ms: number = 2000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}


