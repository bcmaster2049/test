import React, { useState } from 'react';
import { Popover } from 'antd';

interface IPopoverProps {
  children?: React.ReactNode;
  headImg: string;
  firstLine: string;
  secondLine: string;
  position?: string;
  hideHeaderImg?: boolean;
  icon?: React.ReactNode; // New prop for custom icon
}

const PopoverCom: React.FC<IPopoverProps> = ({ 
  headImg, 
  firstLine, 
  secondLine, 
  hideHeaderImg=true, 
  icon 
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
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
      {icon ? (
        icon
      ) : (
        <img 
          className="w-6 pos-right cursor-pointer" 
          src="/images/Infomation.svg" 
          alt="Information Icon" 
        />
      )}
    </Popover>
  );
};

export default PopoverCom;