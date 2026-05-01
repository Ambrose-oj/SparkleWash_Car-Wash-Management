import { useState, useCallback } from 'react';
import type { ContactFormData, FormErrors } from '../types';

const INITIAL_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  businessType: '',
};

type FormState = 'idle' | 'loading' | 'success' | 'error';

function validate(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Please enter your full name';
  }

  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone.trim() || !/^[\+\d\s\-()]{7,20}$/.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!data.businessType) {
    errors.businessType = 'Please select your business type';
  }

  return errors;
}

export function useContactForm(onSubmit: (data: ContactFormData) => void) {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<FormState>('idle');

  const handleChange = useCallback(
    (field: keyof ContactFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      // Clear error on change
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validate(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setState('loading');

      // Simulate API call
      await new Promise((res) => setTimeout(res, 1400));

      onSubmit(form);
      setState('success');
      setForm(INITIAL_FORM);
      setErrors({});
    },
    [form, onSubmit]
  );

  const reset = useCallback(() => {
    setState('idle');
    setForm(INITIAL_FORM);
    setErrors({});
  }, []);

  return { form, errors, state, handleChange, handleSubmit, reset };
}
