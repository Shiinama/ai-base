import React from 'react';
import useProfileStore from '../../src/store/ProfileStore';
import MotionButton from './MotionButton';
import { AspectRatio, Image } from '@chakra-ui/react';

export const isEmpty = (object, fields) => {
  return fields.every((field) => !object[field] || object[field].trim().length === 0);
};

const Empty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-transparent text-4xl text-center px-8 py-4  rounded-xl bg-300% group">
        <div className="bg-clip-text bg-gradient-to-r group-hover:bg-gradient-to-l from-[#b1b7ff]  to-[#1a1e5d] text-transparent">
          Click the button below to edit your personal information
        </div>
      </div>
    </div>
  );
};

const ProfilePreview = ({ onButtonClick }: { onButtonClick: (value: boolean) => void }) => {
  const profileInfo = useProfileStore((state) => state.profileInfo);
  const isProfileEmpty = isEmpty(profileInfo, ['name', 'email', 'phone']);
  return (
    <div className="flex w-full h-full pb-6 flex-col justify-between items-center">
      {isProfileEmpty ? (
        <Empty />
      ) : (
        <div className="w-full">
          <AspectRatio className="w-full bg-gradient-custom" ratio={1}>
            <Image className="md:rounded-t-lg" alt="avatar" src={profileInfo.avatar} />
          </AspectRatio>
          <div className="space-y-4 my-6 flex flex-col items-center">
            <p className="text-4xl">{profileInfo.name}</p>
            <p className="text-xl text-[#676767]">{profileInfo.email}</p>
            <p className="text-xl text-[#676767]">{profileInfo.phone}</p>
          </div>
        </div>
      )}

      <MotionButton onClick={() => onButtonClick(false)}>Edit</MotionButton>
    </div>
  );
};

export default ProfilePreview;
