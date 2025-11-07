/**
 * prefetchDNS 使用示例
 *
 * 演示如何使用 React DOM 的 prefetchDNS API 来优化网络性能
 */

import { prefetchDNS } from 'react-dom';
import { useState, useEffect } from 'react';

// ============================================
// 示例 1: 基本用法 - 预获取图片 CDN
// ============================================
function BasicExample() {
  // 在组件渲染时预获取 CDN 的 DNS
  prefetchDNS('https://images.unsplash.com');

  return (
    <div className="basic-example">
      <h2>基本用法示例</h2>
      <img
        src="https://images.unsplash.com/photo-1"
        alt="示例图片"
        loading="lazy"
      />
    </div>
  );
}

// ============================================
// 示例 2: 批量预获取多个域名
// ============================================
const EXTERNAL_DOMAINS = [
  'https://fonts.googleapis.com',
  'https://cdn.jsdelivr.net',
  'https://api.github.com',
  'https://avatars.githubusercontent.com',
] as const;

function BatchPrefetchExample() {
  // 一次性为所有外部域名预获取 DNS
  EXTERNAL_DOMAINS.forEach(domain => {
    prefetchDNS(domain);
  });

  return (
    <div className="batch-example">
      <h2>批量预获取示例</h2>
      <p>已为 {EXTERNAL_DOMAINS.length} 个域名预获取 DNS</p>
      <ul>
        {EXTERNAL_DOMAINS.map(domain => (
          <li key={domain}>{domain}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// 示例 3: 事件驱动的预获取
// ============================================
function EventDrivenExample() {
  const [showContent, setShowContent] = useState(false);

  const handleShowContent = () => {
    // 在用户交互时预获取即将需要的资源的 DNS
    prefetchDNS('https://api.example.com');
    prefetchDNS('https://cdn.example.com');

    setShowContent(true);
  };

  return (
    <div className="event-driven-example">
      <h2>事件驱动预获取示例</h2>
      {!showContent ? (
        <button onClick={handleShowContent}>
          加载内容 (点击时预获取 DNS)
        </button>
      ) : (
        <div>
          <p>内容已加载!</p>
          {/* 这里会从预获取的域名加载资源 */}
        </div>
      )}
    </div>
  );
}

// ============================================
// 示例 4: 路由预获取
// ============================================
function RouteBasedPrefetch() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'profile' | 'settings'>('home');

  const navigateTo = (route: typeof currentRoute) => {
    // 根据目标路由预获取相应的资源
    if (route === 'profile') {
      prefetchDNS('https://avatars.githubusercontent.com');
      prefetchDNS('https://api.github.com');
    } else if (route === 'settings') {
      prefetchDNS('https://api.stripe.com');
    }

    setCurrentRoute(route);
  };

  return (
    <div className="route-example">
      <h2>路由预获取示例</h2>
      <nav>
        <button onClick={() => navigateTo('home')}>首页</button>
        <button onClick={() => navigateTo('profile')}>个人资料</button>
        <button onClick={() => navigateTo('settings')}>设置</button>
      </nav>
      <div className="content">
        当前路由: {currentRoute}
      </div>
    </div>
  );
}

// ============================================
// 示例 5: 条件预获取
// ============================================
function ConditionalPrefetch({ userType }: { userType: 'free' | 'premium' }) {
  // 根据用户类型有条件地预获取不同的资源
  if (userType === 'premium') {
    prefetchDNS('https://premium-cdn.example.com');
    prefetchDNS('https://premium-api.example.com');
  } else {
    prefetchDNS('https://cdn.example.com');
    prefetchDNS('https://api.example.com');
  }

  return (
    <div className="conditional-example">
      <h2>条件预获取示例</h2>
      <p>用户类型: {userType}</p>
      <p>已为 {userType} 用户预获取相应的 DNS</p>
    </div>
  );
}

// ============================================
// 示例 6: 与 Suspense 结合使用
// ============================================
function SuspenseWithPrefetch() {
  // 在 Suspense 边界处预获取可能需要的资源
  prefetchDNS('https://api.example.com');

  return (
    <div className="suspense-example">
      <h2>Suspense 预获取示例</h2>
      {/* 当组件开始加载数据时,DNS 已经解析完成 */}
      <p>DNS 预获取有助于减少 Suspense 的等待时间</p>
    </div>
  );
}

// ============================================
// 示例 7: 图片画廊优化
// ============================================
interface Image {
  id: string;
  url: string;
  title: string;
}

function ImageGalleryExample() {
  // 为图片 CDN 预获取 DNS
  prefetchDNS('https://picsum.photos');

  const images: Image[] = [
    { id: '1', url: 'https://picsum.photos/200/300?random=1', title: '图片 1' },
    { id: '2', url: 'https://picsum.photos/200/300?random=2', title: '图片 2' },
    { id: '3', url: 'https://picsum.photos/200/300?random=3', title: '图片 3' },
    { id: '4', url: 'https://picsum.photos/200/300?random=4', title: '图片 4' },
  ];

  return (
    <div className="gallery-example">
      <h2>图片画廊预获取示例</h2>
      <div className="gallery-grid">
        {images.map(image => (
          <div key={image.id} className="gallery-item">
            <img src={image.url} alt={image.title} loading="lazy" />
            <p>{image.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 示例 8: 视频播放器优化
// ============================================
function VideoPlayerExample() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    // 在用户点击播放时预获取视频 CDN
    prefetchDNS('https://cdn.videoservice.com');
    setIsPlaying(true);
  };

  return (
    <div className="video-example">
      <h2>视频播放器预获取示例</h2>
      {!isPlaying ? (
        <div className="video-placeholder">
          <button onClick={handlePlay}>
            ▶️ 播放视频 (将预获取视频 CDN)
          </button>
        </div>
      ) : (
        <video
          controls
          autoPlay
          src="https://cdn.videoservice.com/sample.mp4"
        >
          您的浏览器不支持视频标签
        </video>
      )}
    </div>
  );
}

// ============================================
// 示例 9: 第三方服务集成
// ============================================
function ThirdPartyServicesExample() {
  useEffect(() => {
    // 为常用的第三方服务预获取 DNS
    const thirdPartyServices = [
      'https://www.google-analytics.com',
      'https://cdn.segment.com',
      'https://js.stripe.com',
      'https://connect.facebook.net',
    ];

    thirdPartyServices.forEach(service => {
      prefetchDNS(service);
    });
  }, []); // 只在组件挂载时执行一次

  return (
    <div className="third-party-example">
      <h2>第三方服务预获取示例</h2>
      <p>已为分析、支付等第三方服务预获取 DNS</p>
    </div>
  );
}

// ============================================
// 示例 10: 完整的应用示例
// ============================================
function CompleteAppExample() {
  // 应用启动时预获取所有关键域名
  const criticalDomains = [
    'https://api.myapp.com',           // API 服务器
    'https://cdn.myapp.com',           // 静态资源 CDN
    'https://images.myapp.com',        // 图片 CDN
    'https://fonts.googleapis.com',    // 字体服务
    'https://www.google-analytics.com', // 分析服务
  ];

  criticalDomains.forEach(domain => {
    prefetchDNS(domain);
  });

  return (
    <div className="complete-app-example">
      <h2>完整应用示例</h2>
      <p>已为 {criticalDomains.length} 个关键域名预获取 DNS</p>

      <div className="app-content">
        <header>
          <h3>应用头部</h3>
        </header>

        <main>
          <p>这是一个完整的应用示例,展示如何在实际项目中使用 prefetchDNS</p>
        </main>

        <footer>
          <p>应用底部</p>
        </footer>
      </div>
    </div>
  );
}

// ============================================
// 主演示组件
// ============================================
export default function PrefetchDNSDemo() {
  const [activeExample, setActiveExample] = useState<number>(1);

  const examples = [
    { id: 1, name: '基本用法', component: <BasicExample /> },
    { id: 2, name: '批量预获取', component: <BatchPrefetchExample /> },
    { id: 3, name: '事件驱动', component: <EventDrivenExample /> },
    { id: 4, name: '路由预获取', component: <RouteBasedPrefetch /> },
    { id: 5, name: '条件预获取', component: <ConditionalPrefetch userType="premium" /> },
    { id: 6, name: 'Suspense', component: <SuspenseWithPrefetch /> },
    { id: 7, name: '图片画廊', component: <ImageGalleryExample /> },
    { id: 8, name: '视频播放器', component: <VideoPlayerExample /> },
    { id: 9, name: '第三方服务', component: <ThirdPartyServicesExample /> },
    { id: 10, name: '完整应用', component: <CompleteAppExample /> },
  ];

  return (
    <div className="prefetch-dns-demo">
      <h1>prefetchDNS API 示例集合</h1>

      <nav className="example-nav">
        {examples.map(example => (
          <button
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            className={activeExample === example.id ? 'active' : ''}
          >
            {example.id}. {example.name}
          </button>
        ))}
      </nav>

      <div className="example-content">
        {examples.find(ex => ex.id === activeExample)?.component}
      </div>

      <div className="explanation">
        <h3>💡 提示</h3>
        <ul>
          <li>打开浏览器开发者工具的网络面板查看实际效果</li>
          <li>在 HTML 的 &lt;head&gt; 中查看生成的 &lt;link rel="dns-prefetch"&gt; 标签</li>
          <li>相同的域名多次调用只会生成一个标签</li>
          <li>prefetchDNS 是一个提示,浏览器可能会选择忽略</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================
// 工具函数:检查是否已预获取
// ============================================
export function checkDNSPrefetch(href: string): boolean {
  const links = document.querySelectorAll('link[rel="dns-prefetch"]');
  return Array.from(links).some(link => link.getAttribute('href') === href);
}

// ============================================
// 工具函数:获取所有已预获取的域名
// ============================================
export function getAllPrefetchedDomains(): string[] {
  const links = document.querySelectorAll('link[rel="dns-prefetch"]');
  return Array.from(links)
    .map(link => link.getAttribute('href'))
    .filter((href): href is string => href !== null);
}
