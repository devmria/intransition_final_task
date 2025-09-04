import { RegisterRequest } from "@intransition/shared-types";
import { Person, Email, Lock } from "@mui/icons-material";
import { Box, Link as MuiLink, Typography, TextField, InputAdornment, Button, Divider } from "@mui/material";
import { Form, FormikHelpers, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginSchema } from "~components/molecules/SignInForm";
import { useAuth } from "~context/AuthContext";
import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().min(1, 'Name must be at least 1 characters').max(50, 'Name must be at most 50 characters').required('Name is required'),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(1, 'Password must be at least 1 characters').required('Password is required'),
});

export const SignUpForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const initialValues: RegisterRequest = { name: '', email: '', password: '' };

  const handleSubmit = async (values: RegisterRequest, {setSubmitting}: FormikHelpers<RegisterRequest>) => {
    try {
      setSubmitting(true);
      await register(values);
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
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
        <Typography variant="body2">Sign in to access your inventory management system</Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          fullWidth
          type="name"
          label="Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          autoComplete="email"
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              )
            }
          }}
        />
        
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
          <Typography>Create account</Typography>
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

        <Box textAlign="center">
          <Typography>Already have an account?</Typography>
          <MuiLink
            component={Link}
            to="/auth/login"
            sx={{ fontWeight: 600 }}
          >
            Sign In
          </MuiLink>
        </Box>
      </Form>
      )}
    </Formik>
  );
};