import { Box, TextField, Button, Typography, Link as MuiLink, Divider, InputAdornment } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import * as yup from "yup";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '~context/AuthContext';
import { LoginRequest } from '@intransition/shared-types';
import { toast } from 'react-toastify';
import { Formik, FormikHelpers, Form } from 'formik';

export const loginSchema = yup.object({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const SignInForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const initialValues: LoginRequest = { email: '', password: '' };

  const handleSubmit = async (values: LoginRequest, {setSubmitting}: FormikHelpers<LoginRequest>) => {
    try {
      setSubmitting(true);
      await login(values);
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } 
    setSubmitting(false);
  };

  return (
    <Formik 
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={loginSchema}
      enableReinitialize={true}
    >
    {({ values, errors, touched, isSubmitting, handleChange, handleBlur }) => (
      <Form>
      <Box mb={3} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">Welcome back</Typography>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">Administrator account: admin@mail.com (password: 1)</Typography>
        <Typography variant="body2" >Sign in to access your inventory management system</Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          fullWidth
          type="email"
          label="Email address"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          autoComplete="email"
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              )
            }
          }}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          autoComplete="current-password"
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              )
            }
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ mt: 2, py: 1.5 }}
        >
          <Typography>Sign In</Typography>
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

        <Box textAlign="center">
          <Typography>Don't have an account?</Typography>
          <MuiLink
            component={Link}
            to="/auth/register"
            sx={{ fontWeight: 600 }}
          >
            Sign Up
          </MuiLink>
        </Box>
      </Form>
      )}
    </Formik>
  );
};
