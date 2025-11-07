import { useRef, useLayoutEffect, useState, type ReactNode } from 'react';

/**
 * 测试案例: 跟踪 Fragment 引用的可见性
 * 
 * 说明:
 * - Fragment 是虚拟容器，不会在 DOM 中渲染实际节点
 * - 通过 ref 可以获取 Fragment 包裹的 DOM 元素集合
 * - 使用 IntersectionObserver API 监听可见性变化
 * - 适用场景：条件渲染、延迟加载、性能监控
 */

interface VisibilityObserverFragmentProps {
  threshold?: number | number[];
  onVisibilityChange?: (isVisible: boolean) => void;
  children?: ReactNode;
}

/**
 * Fragment 可见性观察器组件
 * 
 * 核心特性:
 * 1. 使用 div 包裹多个子元素，模拟 Fragment 行为
 * 2. 通过 ref 获取容器元素及其内的所有 DOM 节点
 * 3. 使用 IntersectionObserver 监听可见性
 * 4. 自动清理观察器
 * 
 * 注意: React Fragment 不支持 ref，所以使用 div 作为容器
 * 通过 display: contents 使容器不影响布局
 */
function VisibilityObserverFragment({
  threshold = 0.5,
  onVisibilityChange,
  children,
}: VisibilityObserverFragmentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) {
      console.warn('Container ref is not available');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        /**
         *  IntersectionObserver 的逻辑：
         element.isIntersecting =
           (元素与root相交) AND
             (元素与所有祖先容器的可见区域相交) AND
               (元素不被任何祖先的 overflow 剪裁)
         */
        // 判断任意元素可见
        // 即使滚动容器本身在视口中完全可见，但当元素被容器的 overflow 剪裁时，也会报告为不可见。
        // 注意: isIntersecting 不仅检查视口，还会考虑所有祖先容器的剪裁
        // 即使滚动容器在视口内，但子元素被容器的 overflow 剪裁也会报告为 false
        console.log('entries :>> ', entries);
        const hasVisibleEntry = entries.some((entry) => entry.isIntersecting);

        // 调用回调函数
        onVisibilityChange?.(hasVisibleEntry);

        // 调试信息
        console.log('Fragment visibility changed:', {
          isVisible: hasVisibleEntry,
          entriesCount: entries.length,
          visibleEntries: entries.filter(e => e.isIntersecting).length,
        });
      },
      { threshold }
    );

    observerRef.current = observer;

    // 获取容器内的所有直接子元素
    const container = containerRef.current;
    const childElements = Array.from(container.children);

    if (childElements.length === 0) {
      console.warn('No child elements found in container');
    }

    // 观察每个子元素
    childElements.forEach((child) => {
      observer.observe(child);
    });

    // 清理函数
    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [threshold, onVisibilityChange]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'contents', // 使容器不影响布局
      }}
    >
      {children}
    </div>
  );
}

/**
 * 示例组件 1: 第三方组件（模拟）
 */
function SomeThirdPartyComponent() {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        margin: '10px 0',
      }}
    >
      <h3>Third Party Component</h3>
      <p>This is a third-party component wrapped in Fragment</p>
    </div>
  );
}

/**
 * 示例组件 2: 另一个组件（模拟）
 */
function AnotherComponent() {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f3e5f5',
        borderRadius: '4px',
        margin: '10px 0',
      }}
    >
      <h3>Another Component</h3>
      <p>Multiple components can be wrapped together</p>
    </div>
  );
}

/**
 * 主测试组件
 * 
 * 功能:
 * - 实时显示 Fragment 的可见性状态
 * - 记录可见性变化日志
 * - 提供滚动容器用于测试
 */
function MyComponent() {
  const [visibilityLog, setVisibilityLog] = useState<
    Array<{ time: string; isVisible: boolean }>
  >([]);
  const [currentVisibility, setCurrentVisibility] = useState(false);

  const handleVisibilityChange = (isVisible: boolean) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(
      `[${timestamp}] Component is ${isVisible ? 'visible' : 'hidden'}`
    );

    // 记录日志
    setVisibilityLog((prev) => [
      ...prev,
      { time: timestamp, isVisible },
    ]);

    // 更新当前状态
    setCurrentVisibility(isVisible);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Fragment 可见性跟踪测试</h1>

      {/* 状态显示 */}
      <div
        style={{
          padding: '15px',
          backgroundColor: currentVisibility ? '#c8e6c9' : '#ffcdd2',
          borderRadius: '4px',
          marginBottom: '20px',
          fontWeight: 'bold',
        }}
      >
        当前状态: {currentVisibility ? '✓ 可见' : '✗ 不可见'}
      </div>

      {/* 可见性观察器容器 */}
      <div
        style={{
          height: '200px',
          overflowY: 'auto',
          border: '2px dashed #666',
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: '#fafafa',
        }}
      >
        {/* 顶部空间 */}
        <div style={{ height: '200px', backgroundColor: '#eeeeee' }}>
          <p style={{ padding: '20px' }}>向下滚动查看组件...</p>
        </div>

        {/* 被监听的 Fragment */}
        <VisibilityObserverFragment
          threshold={[0, 0.5, 1]}
          onVisibilityChange={handleVisibilityChange}
        >
          <SomeThirdPartyComponent />
          <AnotherComponent />
        </VisibilityObserverFragment>

        {/* 底部空间 */}
        <div style={{ height: '200px', backgroundColor: '#eeeeee' }}>
          <p style={{ padding: '20px' }}>继续滚动...</p>
        </div>
      </div>

      {/* 日志显示 */}
      <div>
        <h2>可见性变化日志 ({visibilityLog.length})</h2>
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            backgroundColor: '#fff',
          }}
        >
          {visibilityLog.length === 0 ? (
            <p style={{ color: '#999' }}>尚无日志记录</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {visibilityLog.map((log, index) => (
                <li key={index}>
                  <code>
                    {log.time}: {log.isVisible ? '显示' : '隐藏'}
                  </code>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 说明文本 */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff3e0',
          borderRadius: '4px',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      >
        <strong>测试说明:</strong>
        <ul style={{ marginTop: '10px' }}>
          <li>在滚动容器中向上/向下滚动</li>
          <li>观察状态指示器的颜色变化（绿色=可见，红色=不可见）</li>
          <li>查看日志记录中的可见性变化时间戳</li>
          <li>打开浏览器控制台查看详细的调试信息</li>
          <li>Fragment 中的元素不会添加额外的 DOM 包装层</li>
        </ul>
      </div>
    </div>
  );
}

export default MyComponent;
