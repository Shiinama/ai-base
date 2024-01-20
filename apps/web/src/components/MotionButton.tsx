import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { MotionProps, motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

type MotionButtonProps = ButtonProps & MotionProps;
const buttonVariants = {
  hover: {
    scale: 1.1,
    textShadow: '0px 0px 8px #b0b3ff',
    boxShadow: '0px 0px 8px #b0b3ff',
  },
  tap: {
    scale: 0.9,
  },
};

const buttonTransition = {
  type: 'spring',
  stiffness: 80,
  damping: 20,
};
const MotionButton: React.FC<MotionButtonProps> = ({ children, className, ...props }) => {
  return (
    <motion.button
      {...props}
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      transition={buttonTransition}
      className={`h-14 w-44 rounded-full bg-gradient-to-br from-[#838bff] to-[#1a1b29] px-5 font-bold text-white shadow hover:shadow-xl focus:outline-none ${className}`}>
      {children}
    </motion.button>
  );
};

export default MotionButton;
