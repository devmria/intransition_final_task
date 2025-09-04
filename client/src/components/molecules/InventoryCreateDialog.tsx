import { TagAutocomplete } from '~components/molecules/TagAutocomplete';
import { InventoryService } from '~services/Inventory/InventoryService';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Box, Alert, Typography, Dialog } from '@mui/material';
import { InventoryCreateRequest, InventoryListItem } from '@intransition/shared-types';
import { useCategories } from '~context/CategoryContext';
import * as yup from "yup";
import { Form, Formik, FormikHelpers } from 'formik';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (inventory: InventoryListItem) => void;
}

const validationSchema = yup.object({
  title: yup.string()
    .trim()
    .required('Title is required')
    .max(50, 'Title must not exceed 50 characters'),
  description: yup.string()
    .trim()
    .required('Description is required'),
  category: yup.object({
    id: yup.string().required('Category is required'),
    name: yup.string().required()
  }).required('Category is required'),
  tags: yup.array().of(yup.string()),
  isPublic: yup.boolean(),
  imageUrl: yup.string()
    .url('Image URL must be a valid URL')
    .nullable()
});

export const InventoryCreateDialog = ({ open, onClose, onSuccess }: Props) => {
  const { categories } = useCategories();

  const initialValues: InventoryCreateRequest = {
    title: '',
    description: '',
    category: { id: '', name: '' },
    tags: [],
    isPublic: false,
    imageUrl: '',
  };

  const handleSubmit = async (values:InventoryCreateRequest, {setSubmitting}: FormikHelpers<InventoryCreateRequest>) => {
    try {
      setSubmitting(true);
      const submitData: InventoryCreateRequest = {
        title: values.title.trim(),
        description: values.description?.trim(),
        category: values.category,
        tags: (values.tags || []).map(tag => tag.trim()),
        isPublic: values.isPublic,
        imageUrl: values.imageUrl
      };
      
      const newInventory = await InventoryService.createInventory(submitData)
      onSuccess(newInventory);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create inventory');
    } 
    setSubmitting(false);
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <Box display="flex" flexDirection="column" gap={3} p={4}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h4" gutterBottom>New Inventory</Typography>
        <Typography variant="h5" gutterBottom>Create a new inventory</Typography>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, errors, touched, isSubmitting, handleChange, handleBlur, setFieldValue }) => (
          <Form>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                name="title"
                label="Title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
                required
                fullWidth
                autoFocus
                disabled={isSubmitting}
              />

              <TextField
                name="description"
                label="Description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                required
                fullWidth
                multiline
                rows={4}
                disabled={isSubmitting}
              />

              <FormControl 
                required 
                fullWidth 
                disabled={isSubmitting}
                error={touched.category && Boolean(errors.category)}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={values.category?.id || ''}
                  label="Category"
                  onChange={(event) => {
                    const categoryId = event.target.value;
                    const selectedCategory = categories.find(cat => cat.id === categoryId);
                    setFieldValue('category', selectedCategory || { id: '', name: '' });
                  }}
                  onBlur={handleBlur}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.category && errors.category && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                    {typeof errors.category === 'string' ? errors.category : 'Category is required'}
                  </Typography>
                )}
              </FormControl>

              <TagAutocomplete
                value={values.tags || []}
                onChange={(newTags) => setFieldValue('tags', newTags)}
                disabled={isSubmitting}
              />

              <TextField
                name="imageUrl"
                label="Image URL"
                value={values.imageUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.imageUrl && Boolean(errors.imageUrl)}
                helperText={'Optional: add an image to represent this inventory'}
                fullWidth
                disabled={isSubmitting}
              />

              <FormControlLabel
                control={
                  <Switch
                    name="isPublic"
                    checked={values.isPublic}
                    onChange={(event) => setFieldValue('isPublic', event.target.checked)}
                    disabled={isSubmitting}
                  />
                }
                label="Make this inventory public"
                sx={{ alignSelf: 'flex-start' }}
              />
              
              {values.isPublic && (
                <Alert severity="info">
                  Public inventories can be viewed by anyone, but only authorized users can make changes.
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create inventory'}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
      </Box>
    </Dialog>
  );
};