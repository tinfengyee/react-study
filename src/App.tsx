
// import { useRef } from 'react';
// import Test from './Test';
// import UseActionStateDemo from './React-Hooks/useActionState';
// import MultipleFormsDemo from './React-Hooks/multipleForms';
// import MultipleFormsWithoutUseActionStateDemo from './React-Hooks/multipleFormsWithoutUseActionState';
// import OptimisticDemo from './React-Hooks/useOptimisticDemo'
// import LayoutEffect from './React-Hooks/useLayoutEffect'
// import FragmentDemo from './React-Components/Fragment';
import UseDeferredValueDemo from './React-Hooks/useDeferredValue';

function App() {
  // const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <UseDeferredValueDemo />
      {/* <LayoutEffect /> */}
      {/* <OptimisticDemo /> */}
      {/* <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            React Hook 演示对比
          </h1>
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">1. useActionState vs 手动实现</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-center">使用 useActionState</h3>
                  <UseActionStateDemo />
                </div>
              </div>
            </div>


            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">3. 多个表单演示对比</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-center">使用 useActionState</h3>
                  <MultipleFormsDemo />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-center">不使用 useActionState</h3>
                  <MultipleFormsWithoutUseActionStateDemo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default App
