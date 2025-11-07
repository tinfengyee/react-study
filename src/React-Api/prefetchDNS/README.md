# prefetchDNS

`prefetchDNS` 是 React DOM 提供的一个用于优化网络性能的函数,它允许你提前解析即将加载资源的服务器的 DNS。

## 基本概念

### 什么是 DNS Prefetch?

DNS Prefetch (DNS 预获取) 是一种浏览器优化技术,它允许浏览器在后台提前解析域名的 IP 地址,而不需要等到实际请求资源时才进行 DNS 查询。这可以显著减少加载外部资源时的延迟。

### 为什么需要 prefetchDNS?

当浏览器需要从外部服务器加载资源时,通常需要经历以下步骤:
1. **DNS 解析** - 将域名解析为 IP 地址
2. **建立连接** - 与服务器建立 TCP 连接
3. **发送请求** - 发送 HTTP 请求
4. **接收响应** - 接收并处理响应

DNS 解析虽然通常只需要几十毫秒,但在某些情况下可能会更长。通过提前进行 DNS 解析,可以消除这个延迟。

## API 用法

```typescript
import { prefetchDNS } from 'react-dom';

function MyComponent() {
  // 在组件渲染期间调用
  prefetchDNS('https://example.com');

  return <div>...</div>;
}
```

### 参数

- **`href`** (string): 要预获取 DNS 的服务器 URL

### 返回值

- 无返回值

## 使用场景

### 1. 在组件渲染时调用

当你知道子组件将会从外部服务器加载资源时:

```typescript
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  // 提前解析图片 CDN 的 DNS
  prefetchDNS('https://cdn.example.com');

  return (
    <div>
      <UserProfile />
    </div>
  );
}

function UserProfile() {
  return <img src="https://cdn.example.com/avatar.jpg" alt="Avatar" />;
}
```

### 2. 在事件处理器中调用

当用户操作可能导致需要从外部服务器加载资源时:

```typescript
import { prefetchDNS } from 'react-dom';

function SearchButton() {
  const handleClick = () => {
    // 在用户点击搜索按钮时,提前解析 API 服务器的 DNS
    prefetchDNS('https://api.example.com');
    // 后续会发起搜索请求...
  };

  return <button onClick={handleClick}>搜索</button>;
}
```

### 3. 为多个第三方域名预获取

```typescript
import { prefetchDNS } from 'react-dom';

function App() {
  // 为多个第三方服务预获取 DNS
  prefetchDNS('https://fonts.googleapis.com');
  prefetchDNS('https://cdn.jsdelivr.net');
  prefetchDNS('https://api.analytics.com');

  return <div>...</div>;
}
```

## 实现原理

### 核心机制

`prefetchDNS` 的实现基于浏览器原生的 `<link rel="dns-prefetch">` 标签。当调用这个函数时,React 会:

1. **检查去重** - 检查是否已经存在相同 href 的 DNS prefetch 标签
2. **创建标签** - 创建 `<link rel="dns-prefetch" href="..." />` 标签
3. **插入 DOM** - 将标签插入到文档的 `<head>` 中

### 生成的 HTML

调用 `prefetchDNS('https://example.com')` 会在 HTML 中生成:

```html
<link rel="dns-prefetch" href="https://example.com" />
```

### 去重机制

React 会确保每个唯一的 href 只会插入一次 DNS prefetch 标签。多次调用相同的 URL 不会产生重复的标签:

```typescript
// 这三次调用只会生成一个 <link> 标签
prefetchDNS('https://example.com');
prefetchDNS('https://example.com');
prefetchDNS('https://example.com');
```

## 源码解析

### 1. 函数定义

```javascript
// packages/react-dom/src/shared/ReactDOMFloat.js
export function prefetchDNS(href: string) {
  // 参数验证
  if (__DEV__) {
    if (typeof href !== 'string' || !href) {
      console.error('prefetchDNS expects a non-empty string argument');
    }
  }

  // 调用内部 dispatcher
  ReactDOMSharedInternals.d /* ReactDOMCurrentDispatcher */
    .D(/* prefetchDNS */ href);
}
```

### 2. 核心流程

#### 开发环境验证
- 检查 `href` 是否为非空字符串
- 检查参数数量是否正确
- 警告不支持 `crossOrigin` 配置(因为浏览器不使用 CORS 进行 DNS 查询)

#### 调度器分发
函数通过 `ReactDOMSharedInternals` 访问当前的 dispatcher,并调用 `.D` 方法(prefetchDNS 调度方法)。

### 3. SSR vs 客户端行为

#### 服务端渲染 (SSR)
在 SSR 环境中:
- 在初始 Shell 和后续刷新中,`<link rel="dns-prefetch">` 标签会在大部分内容之前输出
- 每个唯一的 href 只会输出一次
- 优先级高,确保浏览器尽早开始 DNS 解析

#### 客户端渲染
在客户端:
- **在 render 阶段调用**:立即将 link 标签插入文档(不等待 commit 阶段)
- **去重检查**:如果文档中已存在匹配的元素,则跳过插入
- **静默失败**:如果环境不支持,静默忽略而不是抛出错误

### 4. 实现特点

```javascript
// 伪代码展示核心逻辑
function prefetchDNSImpl(href) {
  // 1. 规范化 URL
  const normalizedHref = normalizeURL(href);

  // 2. 检查是否已存在
  if (document.querySelector(`link[rel="dns-prefetch"][href="${normalizedHref}"]`)) {
    return; // 已存在,直接返回
  }

  // 3. 创建 link 元素
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = normalizedHref;

  // 4. 插入到 head
  document.head.appendChild(link);
}
```

## 注意事项

### 1. 与当前域名相同的情况

为当前页面所在的同一域名调用 `prefetchDNS` 不会带来任何好处,因为浏览器已经解析过该域名:

```typescript
// ❌ 没有意义 - 当前页面已经在 example.com 上
prefetchDNS('https://example.com');

// ✅ 有意义 - 不同的域名
prefetchDNS('https://cdn.example.com');
```

### 2. prefetchDNS vs preconnect

- **prefetchDNS**: 只进行 DNS 解析,开销小
- **preconnect**: DNS 解析 + TCP 连接 + TLS 握手,开销大但更彻底

选择建议:
- 当需要推测性地连接**多个域名**时,使用 `prefetchDNS`
- 当**确定**会使用某个域名时,使用 `preconnect`

```typescript
// 推测性连接多个可能用到的 CDN - 使用 prefetchDNS
prefetchDNS('https://cdn1.example.com');
prefetchDNS('https://cdn2.example.com');
prefetchDNS('https://cdn3.example.com');

// 确定要使用的 API 服务器 - 使用 preconnect
preconnect('https://api.example.com', { crossOrigin: 'anonymous' });
```

### 3. SSR 的特殊行为

在服务端渲染时,只有在**组件渲染期间**调用才有效:

```typescript
// ✅ 有效 - 在组件渲染时
function App() {
  prefetchDNS('https://example.com');
  return <div>...</div>;
}

// ❌ 无效 - 在 useEffect 中(仅在客户端执行)
function App() {
  useEffect(() => {
    prefetchDNS('https://example.com'); // SSR 时不会输出
  }, []);
  return <div>...</div>;
}
```

### 4. 浏览器支持

DNS Prefetch 是一个**提示 (hint)**,不是强制指令:
- 浏览器可以选择忽略这个提示
- 不同浏览器的实现可能有差异
- 应该作为性能优化手段,而不是功能依赖

## 性能影响

### Bundle 大小

根据 PR #26237 的数据:
- 关键 bundle 增加: +0.41-0.49% (未压缩), +0.31-0.41% (gzip)
- 服务端 bundle 增加: +1.2-1.5%

### 性能收益

在理想情况下,DNS 预获取可以节省:
- DNS 查询时间: 20-120ms (取决于网络状况)
- 在移动网络或高延迟环境下收益更明显

## 实际案例

### 案例 1: 图片 CDN 优化

```typescript
import { prefetchDNS } from 'react-dom';

function ImageGallery() {
  // 提前解析图片 CDN 的 DNS
  prefetchDNS('https://images.unsplash.com');

  const images = [
    'https://images.unsplash.com/photo-1',
    'https://images.unsplash.com/photo-2',
    'https://images.unsplash.com/photo-3',
  ];

  return (
    <div className="gallery">
      {images.map(src => (
        <img key={src} src={src} alt="Gallery" />
      ))}
    </div>
  );
}
```

### 案例 2: 第三方脚本优化

```typescript
import { prefetchDNS } from 'react-dom';

function AnalyticsLayout({ children }) {
  // 为分析和监控服务预获取 DNS
  prefetchDNS('https://www.google-analytics.com');
  prefetchDNS('https://cdn.segment.com');
  prefetchDNS('https://api.mixpanel.com');

  return <div>{children}</div>;
}
```

### 案例 3: 条件预获取

```typescript
import { prefetchDNS } from 'react-dom';
import { useState } from 'react';

function VideoPlayer() {
  const [showVideo, setShowVideo] = useState(false);

  const handlePlayClick = () => {
    // 用户点击播放时才预获取视频 CDN
    prefetchDNS('https://video-cdn.example.com');
    setShowVideo(true);
  };

  return (
    <div>
      {!showVideo ? (
        <button onClick={handlePlayClick}>播放视频</button>
      ) : (
        <video src="https://video-cdn.example.com/video.mp4" controls />
      )}
    </div>
  );
}
```

## 最佳实践

### 1. 早期调用
尽可能早地调用 `prefetchDNS`,让浏览器有足够时间进行 DNS 解析:

```typescript
// ✅ 在根组件中调用
function App() {
  prefetchDNS('https://cdn.example.com');
  return <Router>...</Router>;
}
```

### 2. 批量预获取
一次性预获取所有需要的域名:

```typescript
const EXTERNAL_DOMAINS = [
  'https://fonts.googleapis.com',
  'https://cdn.jsdelivr.net',
  'https://api.stripe.com',
];

function App() {
  EXTERNAL_DOMAINS.forEach(domain => prefetchDNS(domain));
  return <div>...</div>;
}
```

### 3. 与其他优化技术结合

```typescript
import { prefetchDNS, preconnect, preload } from 'react-dom';

function OptimizedApp() {
  // 1. 预获取多个可能用到的域名
  prefetchDNS('https://cdn1.example.com');
  prefetchDNS('https://cdn2.example.com');

  // 2. 预连接确定要用的域名
  preconnect('https://api.example.com', { crossOrigin: 'anonymous' });

  // 3. 预加载关键资源
  preload('https://cdn1.example.com/critical.js', { as: 'script' });

  return <div>...</div>;
}
```

## 相关 API

- [`preconnect`](../preconnect/README.md) - DNS 解析 + TCP 连接 + TLS 握手
- [`preload`](../preload/README.md) - 预加载具体资源
- [`preinit`](../preinit/README.md) - 预初始化样式表或脚本

## 参考资源

- [React 官方文档 - prefetchDNS](https://react.dev/reference/react-dom/prefetchDNS)
- [MDN - dns-prefetch](https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch)
- [React PR #26237 - 实现详情](https://github.com/facebook/react/pull/26237)
- [Web.dev - Resource Hints](https://web.dev/articles/preconnect-and-dns-prefetch)

## 版本信息

- **引入版本**: React 18.3.0+
- **相关 PR**: [#26237](https://github.com/facebook/react/pull/26237)
- **合并日期**: 2023年2月25日
