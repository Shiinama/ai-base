import { SinglePlacement } from './typings';

export const getReversePosition = (
  position: SinglePlacement
): SinglePlacement => {
  const map: Record<SinglePlacement, SinglePlacement> = {
    bottom: 'top',
    top: 'bottom',
    left: 'right',
    right: 'left',
  };
  return map[position];
};

export default getReversePosition;
