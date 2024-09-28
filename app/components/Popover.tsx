import React, { useState } from 'react';
import { Popover } from 'antd';

interface IPopoverProps {
  children: React.ReactNode;
  headImg: string;
  firstLine: string;
  secondLine: string;
  position?: string;
  hideHeaderImg?: boolean;
}

const App: React.FC<IPopoverProps> = ({ headImg, firstLine, secondLine, hideHeaderImg=true }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = () => {
    setOpen(!open);
  };

  const handleClick = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    console.log('handleClick');
    console.log('e', e);
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
    console.log('open', open);
  };

  const content = (
    <div className='text-white'>
      {hideHeaderImg && <img className='w-12 mx-auto' src={`/images/${headImg}`} alt="Head Image" />}
      <p className='mb-1'>{firstLine}</p>
      <p className='mb-1'>{secondLine}</p>
    </div>
  );

  return (
    <Popover 
      content={content}
      open={open}
      onOpenChange={handleOpenChange}
      trigger="click"
      overlayStyle={{ zIndex: 9999 }}
    >
      <img 
        className="w-6 pos-right cursor-pointer" 
        src="/images/Infomation.svg" 
        alt="Information Icon" 
        onClick={handleClick}
        onTouchStart={handleClick}
        style={{ touchAction: 'manipulation' }}
      />
    </Popover>
  );
};

export default App;