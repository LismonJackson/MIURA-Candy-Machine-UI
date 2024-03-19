// pages/about.tsx
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicAbout = dynamic(() => import('../src/AboutComponent'), {
  suspense: true,
  ssr: false,
});

const AboutPage = () => {
  return (
    <Suspense fallback={`Loading...`}>
      <DynamicAbout />
    </Suspense>
  );
};

export default AboutPage;
