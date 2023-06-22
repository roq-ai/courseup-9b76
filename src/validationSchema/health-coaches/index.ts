import * as yup from 'yup';

export const healthCoachValidationSchema = yup.object().shape({
  user_id: yup.string().nullable(),
  provider_id: yup.string().nullable(),
});
