import * as yup from 'yup';

export const botValidationSchema = yup.object().shape({
  nickname: yup.string().required(),
  server_id: yup.string().nullable(),
});
