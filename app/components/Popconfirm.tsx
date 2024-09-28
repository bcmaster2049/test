import React, { useState, useCallback } from 'react';
import styles from './SelfPopover.module.css';

type PopoverProps = {
  children: React.ReactNode;
  trigger?: 'click' | 'hover';
  headImg: string;
  count: number;
  position?: string;
};

const SelfPopover: React.FC<PopoverProps> = ({ children, trigger = 'hover', headImg, count, position }) => {
  const [visible, setVisible] = useState(false);

  const handleTrigger = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    console.log('hover enter')
    if (trigger === 'click') {
      setVisible((prevVisible) => !prevVisible);
    } else if (trigger === 'hover') {
      setVisible(true);
    }

    event.stopPropagation();
  }, [trigger]);

  const handleHide = useCallback(() => {
    console.log('hover leave')
    if (trigger === 'hover') {
      setVisible(false);
    }
  }, [trigger]);
  
  return (
    <div
      className={styles.popoverWrapper}
      onMouseEnter={handleTrigger}
      onMouseLeave={handleHide}
      onClick={trigger === 'click' ? handleTrigger : undefined}
    >
      {children}
      {visible && (
        <div className={`${styles.popoverContent} pos${position}`}>
          <img className='w-12 mx-auto' src={`/images/${headImg}`} alt="" />
          <p>Congrats on the INFECTION mission!</p>
          <p>Now keep on infecting!</p>
          <p>Every {count} more person you infected, you will earn a {count} virus!</p>
        </div>
      )}
    </div>
  );
};

export default SelfPopover;