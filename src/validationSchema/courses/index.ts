import * as yup from 'yup';

export const courseValidationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  provider_id: yup.string().nullable(),
});
