import { useState, useDeferredValue, useMemo } from 'react';

/**
 * useDeferredValue 使用案例
 * 
 * 用途：延迟更新一个值，使 UI 保持响应
 * 场景：搜索、过滤列表等需要处理大量数据的场景
 */

interface SearchResult {
  id: number;
  title: string;
}

// 模拟一个大列表
const ITEMS: SearchResult[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  title: `Item ${i + 1}`,
}));

// 模拟耗时的搜索操作
function slowSearch(query: string): SearchResult[] {
  const startTime = performance.now();

  // 模拟耗时操作
  while (performance.now() - startTime < 300) {
    // 空转
  }

  if (!query) {
    return ITEMS;
  }

  return ITEMS.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
}

interface DeferredSearchProps {
  title: string;
  description: string;
}

/**
 * 使用 useDeferredValue 的搜索组件
 */
function DeferredSearch({ title, description }: DeferredSearchProps) {
  const [searchInput, setSearchInput] = useState('');

  // 延迟更新搜索值，UI 响应立即更新，搜索结果异步更新
  const deferredSearchInput = useDeferredValue(searchInput);

  // 根据延迟的搜索值计算结果
  const searchResults = useMemo(() => {
    return slowSearch(deferredSearchInput);
  }, [deferredSearchInput]);

  const isStale = searchInput !== deferredSearchInput;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="搜索项目..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isStale && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-700">
            搜索词: <span className="font-mono font-semibold">"{deferredSearchInput}"</span>
          </p>
          <p className="text-sm text-gray-700 mt-1">
            找到 <span className="font-semibold text-blue-600">{searchResults.length}</span> 条结果
          </p>
          {isStale && (
            <p className="text-sm text-orange-600 mt-1">
              ⏳ 正在更新...
            </p>
          )}
        </div>

        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded">
          {searchResults.length > 0 ? (
            <ul className="divide-y">
              {searchResults.slice(0, 20).map((item) => (
                <li key={item.id} className="px-4 py-2 hover:bg-gray-100 text-sm">
                  {item.title}
                </li>
              ))}
              {searchResults.length > 20 && (
                <li className="px-4 py-2 text-sm text-gray-500 bg-gray-50 text-center">
                  ... 还有 {searchResults.length - 20} 条结果
                </li>
              )}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              没有找到匹配的结果
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 对比：不使用 useDeferredValue
 */
function NormalSearch() {
  const [searchInput, setSearchInput] = useState('');

  // 直接使用输入值
  const searchResults = useMemo(() => {
    return slowSearch(searchInput);
  }, [searchInput]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">普通搜索（没有延迟）</h3>
      <p className="text-sm text-gray-600 mb-4">输入时会卡顿，因为要等待搜索完成</p>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="搜索项目..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-700">
            搜索词: <span className="font-mono font-semibold">"{searchInput}"</span>
          </p>
          <p className="text-sm text-gray-700 mt-1">
            找到 <span className="font-semibold text-red-600">{searchResults.length}</span> 条结果
          </p>
        </div>

        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded">
          {searchResults.length > 0 ? (
            <ul className="divide-y">
              {searchResults.slice(0, 20).map((item) => (
                <li key={item.id} className="px-4 py-2 hover:bg-gray-100 text-sm">
                  {item.title}
                </li>
              ))}
              {searchResults.length > 20 && (
                <li className="px-4 py-2 text-sm text-gray-500 bg-gray-50 text-center">
                  ... 还有 {searchResults.length - 20} 条结果
                </li>
              )}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              没有找到匹配的结果
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * useDeferredValue 演示组件
 */
export default function UseDeferredValueDemo() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            useDeferredValue Hook 演示
          </h1>
          <p className="text-gray-600 text-lg">
            延迟更新值，保持 UI 响应性 - 适合处理大数据量的搜索、过滤等场景
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <DeferredSearch
            title="✨ 使用 useDeferredValue"
            description="搜索框立即响应，搜索结果在后台延迟更新"
          />
          <NormalSearch />
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">何时使用 useDeferredValue?</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ 搜索框实时搜索大数据量</li>
            <li>✅ 过滤列表导致重新渲染卡顿</li>
            <li>✅ 分页数据加载</li>
            <li>✅ 输入框触发复杂计算</li>
            <li>✅ 提升用户体验，让 UI 保持响应</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
