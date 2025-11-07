import { useState, useEffect } from 'react';

// 定义状态类型
type State = {
  message: string | null;
  isPending: boolean;
};

// 模拟添加到购物车的异步操作
async function addToCart(itemID: string, itemTitle: string): Promise<State> {
  try {
    // 模拟API调用 - 根据商品ID设置不同的延时
    const delay = (parseInt(itemID) + 1) * 500; // ID为1的等1秒，ID为2的等1.5秒，以此类推
    const startTime = Date.now();
    console.log(`[${new Date().toLocaleTimeString()}] [表单${itemID}] 开始添加商品: ${itemTitle} - 预计等待 ${delay}ms`);

    await new Promise(resolve => setTimeout(resolve, delay));

    const endTime = Date.now();
    const actualDelay = endTime - startTime;
    console.log(`[${new Date().toLocaleTimeString()}] [表单${itemID}] 完成添加商品: ${itemTitle} - 实际等待 ${actualDelay}ms`);

    return { message: `✅ 表单${itemID}: ${itemTitle} 已成功添加到购物车！(等待了 ${actualDelay}ms)`, isPending: false };
  } catch (error) {
    return { message: `❌ 表单${itemID}: 添加失败: ${error instanceof Error ? error.message : '未知错误'}`, isPending: false };
  }
}

function AddToCartForm({ itemID, itemTitle }: { itemID: string; itemTitle: string }) {
  const [state, setState] = useState<State>({ message: null, isPending: false });
  const [clickTime, setClickTime] = useState<string | null>(null);
  const [completeTime, setCompleteTime] = useState<string | null>(null);
  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9)); // 唯一实例ID

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const time = new Date().toLocaleTimeString();
    setClickTime(time);
    setCompleteTime(null); // 重置完成时间
    setState({ message: null, isPending: true }); // 设置为pending状态
    console.log(`[${time}] 表单 ${itemID} (实例: ${instanceId}) 被点击`);

    try {
      const result = await addToCart(itemID, itemTitle);
      setState(result);
    } catch (error) {
      setState({ message: `❌ 表单${itemID}: 添加失败: ${error instanceof Error ? error.message : '未知错误'}`, isPending: false });
    }
  };

  // 当状态更新时记录完成时间
  useEffect(() => {
    if (state.message && !completeTime && !state.isPending) {
      const time = new Date().toLocaleTimeString();
      setCompleteTime(time);
      console.log(`[${time}] 表单 ${itemID} (实例: ${instanceId}) 状态更新:`, state);
    }
  }, [state.message, completeTime, state.isPending, itemID, instanceId]);

  return (
    <div className="p-4 border rounded-lg mb-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <h3 className="text-lg font-semibold">{itemTitle} (ID: {itemID})</h3>
        <p className="text-xs text-gray-400">实例ID: {instanceId}</p>

        <button
          type="submit"
          disabled={state.isPending}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.isPending ? '添加中...' : '加入购物车'}
        </button>

        {clickTime && (
          <p className="text-xs text-blue-600">点击时间: {clickTime}</p>
        )}

        {completeTime && (
          <p className="text-xs text-green-600">完成时间: {completeTime}</p>
        )}

        {state.isPending && (
          <p className="text-xs text-orange-600">状态: 处理中...</p>
        )}

        {state.message && (
          <p className={`text-sm mt-2 ${state.message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default function MultipleFormsWithoutUseActionStateDemo() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        多个表单演示：不使用 useActionState
      </h1>

      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">演示说明</h2>
        <p className="text-sm text-gray-700 mb-2">
          这个演示展示了不使用 <code>useActionState</code> 时，如何手动管理多个表单的状态。
        </p>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          <li>使用传统的 <code>useState</code> 管理状态</li>
          <li>手动处理异步操作和错误状态</li>
          <li>每个表单独立管理自己的 pending 状态</li>
          <li>状态更新应该更及时（没有 startTransition 的延迟）</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <AddToCartForm itemID="1" itemTitle="JavaScript：权威指南" />
        <AddToCartForm itemID="2" itemTitle="JavaScript：优点荟萃" />
        <AddToCartForm itemID="3" itemTitle="React 实战" />
        <AddToCartForm itemID="4" itemTitle="TypeScript 入门" />
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold mb-2">对比说明</h3>
        <p className="text-sm text-gray-700 mb-2">
          与使用 <code>useActionState</code> 的版本相比：
        </p>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          <li>状态更新可能更及时，因为没有并发调度的延迟</li>
          <li>需要手动管理 pending 状态和错误处理</li>
          <li>代码更冗长，但控制更精细</li>
          <li>适合需要精确控制更新时机的场景</li>
        </ul>
        <p className="text-sm text-gray-700 mt-2">
          <strong>测试方法：</strong> 依次点击按钮，比较控制台日志中的完成时间和UI更新时间。
        </p>
      </div>
    </div>
  );
}