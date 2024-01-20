import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { Formik, Form, FormikProps } from 'formik';
import InputField from './InputField';
import { ProfileCardState } from '../../src/store/ProfileStore';
import useProfileStore from '../../src/store/ProfileStore';
import MotionButton from './MotionButton';

interface ProfileEditProps {
  className?: string;
  onButtonClick: (value: boolean) => void;
}

export interface ProfileEditMethods {
  handleButtonClick: () => void;
}

const isEmail = (str: string) => {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(str);
};
function emptyFn() {}

const ProfileEdit = forwardRef<ProfileEditMethods, ProfileEditProps>(({ className, onButtonClick }, ref) => {
  const formikRef = useRef<FormikProps<any>>(null);
  const profileInfo = useProfileStore((state) => state.profileInfo);
  const setProfileInfo = useProfileStore((state) => state.setProfileInfo);

  const handleButtonClick = async () => {
    if (formikRef.current) {
      await formikRef.current?.submitForm();
      if (formikRef.current.isValid) {
        setProfileInfo(formikRef.current.values);
      }
      return formikRef.current.isValid;
    }
  };

  useImperativeHandle(ref, () => ({
    handleButtonClick,
  }));

  return (
    <Box borderWidth={0} p={6} className={`${className} flex flex-col items-center w-full h-full justify-between`}>
      <Formik
        className="w-full"
        innerRef={formikRef}
        initialValues={profileInfo}
        validate={(values: ProfileCardState) => {
          let errors: Partial<ProfileCardState> = {};

          if (!values.name) {
            errors.name = 'Name is required';
          }

          if (!values.email) {
            errors.email = 'Email is required';
          } else if (!isEmail(values.email)) {
            errors.email = 'Please enter the correct email format';
          }

          if (!values.phone) {
            errors.phone = 'Phone number is required';
          }

          if (!values.avatar) {
            errors.avatar = 'Avatar URL is required';
          }

          return errors;
        }}
        onSubmit={emptyFn}>
        <Form className="space-y-10 w-full">
          <Heading as="h2" size="xl">
            Edit Profile
          </Heading>
          <InputField name="name" label="Name" />
          <InputField name="email" label="Email" />
          <InputField name="avatar" label="Avatar URL" />
          <InputField name="phone" label="Phone number" />
        </Form>
      </Formik>
      <MotionButton onClick={() => onButtonClick(true)}>Save</MotionButton>
    </Box>
  );
});

export default ProfileEdit;
