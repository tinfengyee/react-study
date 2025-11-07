import { useActionState } from 'react';

// 定义状态类型
type State = {
  data: string | null;
  error: string | null;
};

// 异步操作函数：模拟表单提交
async function submitForm(_prevState: State, formData: FormData): Promise<State> {
  try {
    const name = formData.get('name') as string;

    // 模拟异步操作（如API调用）
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模拟错误情况
    if (name.toLowerCase() === 'error') {
      throw new Error('提交失败：无效输入');
    }

    // 返回成功结果
    return { data: `欢迎，${name}！表单提交成功。`, error: null };
  } catch (error) {
    // 处理错误
    return { data: null, error: error instanceof Error ? error.message : '未知错误' };
  }
}

export default function UseActionStateDemo() {
  // 使用 useActionState Hook
  // 参数：action 函数，初始状态
  // 返回：当前状态，表单 action 函数，是否正在进行中
  const [state, formAction, isPending] = useActionState(submitForm, { data: null, error: null });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        useActionState Hook 演示
      </h1>

      {/* 表单：使用 formAction 作为 action */}
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            姓名
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="输入您的姓名"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isPending}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? '提交中...' : '提交表单'}
        </button>
      </form>

      {/* 显示结果 */}
      {state.error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-medium">错误：</p>
          <p>{state.error}</p>
        </div>
      )}

      {state.data && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <p className="font-medium">成功：</p>
          <p>{state.data}</p>
        </div>
      )}

      {/* 说明 */}
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>提示：</strong> 输入 "error" 来模拟错误情况。</p>
      </div>
    </div>
  );
}