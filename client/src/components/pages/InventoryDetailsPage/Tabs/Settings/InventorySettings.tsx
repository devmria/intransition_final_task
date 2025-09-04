import { InventoryDetail, InventoryUpdate } from "@intransition/shared-types";
import { Box, Typography, Alert, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Button } from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { TagAutocomplete } from "~components/molecules/TagAutocomplete";
import { useCategories } from "~context/CategoryContext";
import { InventoryService } from "~services/Inventory/InventoryService";

type InventorySettingsProps = {
  inventory: InventoryDetail;
  onChange: (inventory: InventoryDetail) => void;
};

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

export const InventorySettings = ({ inventory, onChange }: InventorySettingsProps) => {
  const { categories } = useCategories();

  const initialValues: InventoryUpdate = {
    id: inventory.id,
    title: inventory.title,
    description: inventory.description,
    category: inventory.category,
    tags: inventory.tags || [],
    isPublic: inventory.isPublic,
    imageUrl: inventory.imageUrl || null,
  };

  const handleSubmit = async (values: InventoryUpdate, { setSubmitting }: FormikHelpers<InventoryUpdate>) => {
    try {
      setSubmitting(true);
      const submitData: InventoryUpdate = {
        ...values,
        title: values.title.trim(),
        description: values.description?.trim(),
        tags: (values.tags || []).map(tag => tag.trim()),
        imageUrl: values.imageUrl?.trim() || null,
      };

      const newInventory = await InventoryService.updateInventory(inventory.id, submitData);
      const changedInventory = await InventoryService.getInventory(newInventory.id);

      toast.success('Inventory successfully edited');
      onChange(changedInventory);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create inventory');
    } 
    setSubmitting(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="h4" gutterBottom>General settings</Typography>
        <Typography variant="h5" gutterBottom>Inventory update form</Typography>
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
                loading={isSubmitting}
              >
                Update inventory
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};