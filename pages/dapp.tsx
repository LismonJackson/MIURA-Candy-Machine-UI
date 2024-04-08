import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";

const LoadingScreen = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  
  p {
    font-weight: bold;
    font-size: 1.8em;
  }

`;



// Custom loading component
const CustomLoading = () => (
  <LoadingScreen>
    <p>
        Loading...
    </p>
  </LoadingScreen>
);

// Dynamically import DappPage component
const DynamicMain = dynamic(() => import('../src/DappPage'), {
  suspense: true,
  ssr: false
});

// DappPage component
const DappPage = () => {
  return (
    <Suspense fallback={<CustomLoading />}>
      <DynamicMain />
    </Suspense>
  );
};

export default DappPage;
