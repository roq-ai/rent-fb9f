import * as yup from 'yup';

export const carValidationSchema = yup.object().shape({
  name: yup.string().required(),
  daily_rental_price: yup.number().integer().required(),
  company_id: yup.string().nullable().required(),
});
