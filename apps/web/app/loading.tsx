import React from 'react';
import { Sticker } from '../components/common/loader/sticker';

const Loading = () => {
  return (
    <div className={`h-dvh w-dvw flex items-center justify-center`}>
      <Sticker />
    </div>
  );
};

export default Loading;
