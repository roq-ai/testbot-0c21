import * as yup from 'yup';

export const channelValidationSchema = yup.object().shape({
  name: yup.string().required(),
  type: yup.string().required(),
  server_id: yup.string().nullable(),
});
