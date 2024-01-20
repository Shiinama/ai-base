import { Icon, IconProps } from '@chakra-ui/react';

const CloseSmall = (props: IconProps) => (
  <Icon viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g>
      <g>
        <rect
          fillOpacity="0.01"
          fill="#FFFFFF"
          x="0"
          y="0"
          width="48"
          height="48"
          strokeWidth="4"
          stroke="none"
          fillRule="evenodd"
        />
        <path
          d="M14,14 L34,34"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          fillRule="evenodd"
        />
        <path
          d="M14,34 L34,14"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          fillRule="evenodd"
        />
      </g>
    </g>
  </Icon>
);

export default CloseSmall;
