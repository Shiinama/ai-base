import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import computed from 'zustand-computed';

export interface ProfileCardState {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

type ProfileState = {
  profileInfo: ProfileCardState;
  screenWidth: number;
  screenHeight: number;
};

type ProfileActions = {
  setProfileInfo: (state: ProfileCardState) => void;
  setWidth(width: number): void;
  setHeight(width: number): void;
};

type ProfileStore = ProfileState & ProfileActions;

const DEFAULT_STATE = {
  profileInfo: {
    name: '',
    email: '',
    phone: '',
    avatar:
      'https://s3-alpha-sig.figma.com/img/5ba5/1428/a152e0ae56613ca2b08182b3f6153cb1?Expires=1701648000&Signature=B1odT~0z7CEhPgEhFS83E~iKNApD5~fj7MckSqphfy8xqndDNrJ7itTpYFvHNMOXUXExw8RLn8HHXWa8CgKnrHMe0DQ2Twk4HjR7Du7awLpLflJmdSh3gI~nRDK8HYwPFp~lPRqiSJ6XwevaNjqcGakv8~xuC9~oKBQvWmOOdUg33jRdAjzDN500nw0qzFwj6VA1uA3qcb6u7JXganpRXgLk9KMaD4ygp9Zu6bfEgkdVIhLxzv~cwWjNqSGdhTimUp27F8cCtEq4uPvWLgqTfEm2i89MQ1uMam1dVCJywplMMpIJyU1UBUfMb7jdFB5cQP0u7e9rQaBwCchOYEtK4A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
  },
  //优先移动端
  screenWidth: 375,
  screenHeight: 600,
};

const profileStore = create<ProfileStore>()(
  computed(
    devtools(
      persist(
        (set) => ({
          ...DEFAULT_STATE,
          setProfileInfo: (state) => {
            set({ profileInfo: state });
          },
          setWidth(screenWidth) {
            set({ screenWidth });
          },
          setHeight(screenHeight) {
            set({ screenHeight });
          },
        }),
        {
          name: 'profile-storage',
        }
      )
    ),
    (state) => ({
      isMd: state.screenWidth <= 768,
    })
  )
);
export default profileStore;
