import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup.string().min(1, 'Name must be at least 1 characters').max(50, 'Name must be at most 50 characters').required('Name is required'),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(1, 'Password must be at least 1 characters').required('Password is required'),
});

export const loginSchema = yup.object({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});