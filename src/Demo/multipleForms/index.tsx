import { useActionState, useState, useEffect, startTransition } from 'react';

// 定义状态类型
type State = {
  message: string | null;
};

// 模拟添加到购物车的异步操作
async function addToCart(_prevState: State, formData: FormData): Promise<State> {
  const itemID = formData.get('itemID') as string;
  const itemTitle = formData.get('itemTitle') as string;

  try {
    // 模拟API调用 - 根据商品ID设置不同的延时
    const delay = (parseInt(itemID) + 1) * 500; // ID为1的等1秒，ID为2的等1.5秒，以此类推
    const startTime = Date.now();
    console.log(`[${new Date().toLocaleTimeString()}] [表单${itemID}] 开始添加商品: ${itemTitle} - 预计等待 ${delay}ms`);

    await new Promise(resolve => setTimeout(resolve, delay));

    const endTime = Date.now();
    const actualDelay = endTime - startTime;
    console.log(`[${new Date().toLocaleTimeString()}] [表单${itemID}] 完成添加商品: ${itemTitle} - 实际等待 ${actualDelay}ms`);

    return { message: `✅ 表单${itemID}: ${itemTitle} 已成功添加到购物车！(等待了 ${actualDelay}ms)` };
  } catch (error) {
    return { message: `❌ 表单${itemID}: 添加失败: ${error instanceof Error ? error.message : '未知错误'}` };
  }
}

function AddToCartForm({ itemID, itemTitle }: { itemID: string; itemTitle: string }) {
  const [state, formAction, isPending] = useActionState(addToCart, { message: null });
  const [clickTime, setClickTime] = useState<string | null>(null);
  const [completeTime, setCompleteTime] = useState<string | null>(null);
  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9)); // 唯一实例ID

  const handleClick = () => {
    const time = new Date().toLocaleTimeString();
    setClickTime(time);
    setCompleteTime(null); // 重置完成时间
    console.log(`[${time}] 表单 ${itemID} (实例: ${instanceId}) 被点击`);
  };

  // 当状态更新时记录完成时间
  useEffect(() => {
    if (state.message && !completeTime) {
      const time = new Date().toLocaleTimeString();
      setCompleteTime(time);
      console.log(`[${time}] 表单 ${itemID} (实例: ${instanceId}) 状态更新:`, state);
    }
  }, [state.message, completeTime, itemID, instanceId]);

  return (
    <div className="p-4 border rounded-lg mb-4">
      <form action={formAction} className="space-y-3">
        <h3 className="text-lg font-semibold">{itemTitle} (ID: {itemID})</h3>
        <p className="text-xs text-gray-400">实例ID: {instanceId}</p>
        <input type="hidden" name="itemID" value={itemID} />
        <input type="hidden" name="itemTitle" value={itemTitle} />

        <button
          type="submit"
          disabled={isPending}
          onClick={handleClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? '添加中...' : '加入购物车'}
        </button>

        {clickTime && (
          <p className="text-xs text-blue-600">点击时间: {clickTime}</p>
        )}

        {completeTime && (
          <p className="text-xs text-green-600">完成时间: {completeTime}</p>
        )}

        {isPending && (
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
} export default function MultipleFormsDemo() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        多个表单演示：useActionState 的独立性
      </h1>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">演示说明</h2>
        <p className="text-sm text-gray-700 mb-2">
          这个演示展示了当页面有多个表单时，每个 <code>useActionState</code> 实例都是独立的。
        </p>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          <li>每个表单有自己的状态管理和 pending 状态</li>
          <li>一个表单的提交不会阻塞其他表单</li>
          <li>可以同时提交多个表单</li>
          <li>每个表单独立处理成功/错误状态</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <AddToCartForm itemID="1" itemTitle="JavaScript：权威指南" />
        <AddToCartForm itemID="2" itemTitle="JavaScript：优点荟萃" />
        <AddToCartForm itemID="3" itemTitle="React 实战" />
        <AddToCartForm itemID="4" itemTitle="TypeScript 入门" />
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold mb-2">测试步骤</h3>
        <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
          <li>依次点击"加入购物车"按钮，注意观察点击时间显示</li>
          <li>查看控制台日志，了解每个操作的开始和完成时间</li>
          <li>预期顺序：表单1(1秒) → 表单2(1.5秒) → 表单3(2秒) → 表单4(2.5秒)</li>
          <li>每个表单显示自己的完成时间，证明异步操作是独立的</li>
        </ol>
        <p className="text-sm text-gray-700 mt-2">
          <strong>如果仍然看起来同时完成：</strong> 请检查您是否真的依次点击（间隔1秒以上），并查看控制台的详细时间戳。
        </p>
      </div>
    </div>
  );
}