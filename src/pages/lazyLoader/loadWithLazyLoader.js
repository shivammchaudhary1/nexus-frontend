import React, { lazy, Suspense } from "react";

// References:
// https://react.dev/reference/react/lazy
// https://reactjs.org/docs/code-splitting.html
// https://www.geeksforgeeks.org/lazy-loading-in-react-and-how-to-implement-it/
// https://stackoverflow.com/questions/53174915/what-is-lazy-in-react

function loadWithLazyLoader(loaderFun) {
  async function lazyLoaderWithReload() {
    try {
      return await loaderFun();
    } catch (error) {
      window.location.reload();
    }
  }

  const LazyComponent = lazy(lazyLoaderWithReload);

  const LazyRouteWithFallback = (props) => (
    <Suspense fallback={null}>
      <LazyComponent {...props} />
    </Suspense>
  );
  return LazyRouteWithFallback;
}

export default loadWithLazyLoader;
