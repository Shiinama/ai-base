import React, { memo } from 'react';
import { useField, FieldConfig, FieldValidator } from 'formik';
import { FormControl, FormControlProps, FormLabel, Input, InputProps, FormErrorMessage } from '@chakra-ui/react';

interface InputFieldProps extends FieldConfig {
  label: string;
  formControlProps?: FormControlProps;
  inputProps?: InputProps;
  className?: string;
  labelClassName?: string;
  validate?: FieldValidator;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  formControlProps,
  inputProps,
  className,
  labelClassName,
  ...props
}) => {
  const [field, meta] = useField(props.name);
  const error = meta.touched && meta.error ? meta.error : null;
  return (
    <FormControl className={className} {...formControlProps} isInvalid={!!error}>
      <FormLabel className={`mb-2 ${labelClassName}`}>{label}</FormLabel>
      <Input
        borderColor={'#1a1b29'}
        _hover={{
          color: '#1a1b29',
        }}
        {...inputProps}
        {...field}
      />
      <FormErrorMessage position="absolute">{error}</FormErrorMessage>
    </FormControl>
  );
};

export default memo(InputField);
