import { TagService } from '~services/Tag/TagService';
import { Autocomplete, TextField, Chip, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { TagResponse } from '@intransition/shared-types';
import { useDebounce } from 'use-debounce';
import React from 'react';

interface TagAutocompleteProps {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export const TagAutocomplete = ({ value, onChange, disabled = false }: TagAutocompleteProps) => {
  const [availableTags, setAvailableTags] = useState<TagResponse[]>([]);
  const [tagInputValue, setTagInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false)

  const [debouncedValue] = useDebounce(tagInputValue, 300);

  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoading(true);
        const data = await TagService.getTags(tagInputValue.trim());
        setAvailableTags(data.tags);
      } catch (error) {
        console.error('Failed to load tags:', error);
        setAvailableTags([]);
      }
      setLoading(false);
    };
    loadTags();
  }, [debouncedValue]);

  const tryAddTag = () => {
    const trimmedValue = tagInputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setTagInputValue('');
      setOpen(false);
    }
  };
  
  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && tagInputValue.trim()) {
      event.preventDefault();
      tryAddTag();
    }
  };
  
  const handleInputBlur = () => {
    tryAddTag();
  };

  const handleChange = (_:any, value: string[]) => {
    onChange(value);
    setOpen(false);
  }

  return (
    <Autocomplete
      multiple
      freeSolo
      value={value}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onChange={(_, newValue) => handleChange(_, newValue)}
      inputValue={tagInputValue}
      onInputChange={(_, newInputValue) => setTagInputValue(newInputValue)}
      options={availableTags.map(tag => tag.name)}
      disabled={disabled}
      loading={loading}
      filterOptions={(options) => options}
      fullWidth
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      renderValue={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip key={key} variant="outlined" label={option} {...tagProps} />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tags"
          placeholder="Start typing to search tags..."
          helperText="Type to search existing tags or press Enter to create new ones"
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};