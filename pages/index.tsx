import React, { Suspense } from "react";
import dynamic from "next/dynamic";
// src/index.tsx or src/App.tsx


const DynamicMain = dynamic(() => import('../src/main'), {
  suspense: true,
  ssr: false
})

const IndexPage = ({}) => {
  return (
    <Suspense fallback={`Loading...`}>
      <DynamicMain />
    </Suspense>
  );
};

export default IndexPage;
