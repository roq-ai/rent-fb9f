import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRentalById, updateRentalById } from 'apiSdk/rentals';
import { Error } from 'components/error';
import { rentalValidationSchema } from 'validationSchema/rentals';
import { RentalInterface } from 'interfaces/rental';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { CarInterface } from 'interfaces/car';
import { getUsers } from 'apiSdk/users';
import { getCars } from 'apiSdk/cars';

function RentalEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RentalInterface>(
    () => (id ? `/rentals/${id}` : null),
    () => getRentalById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RentalInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRentalById(id, values);
      mutate(updated);
      resetForm();
      router.push('/rentals');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RentalInterface>({
    initialValues: data,
    validationSchema: rentalValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Rental
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="start_date" mb="4">
              <FormLabel>Start Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.start_date ? new Date(formik.values?.start_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('start_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="end_date" mb="4">
              <FormLabel>End Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.end_date ? new Date(formik.values?.end_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('end_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="total_cost" mb="4" isInvalid={!!formik.errors?.total_cost}>
              <FormLabel>Total Cost</FormLabel>
              <NumberInput
                name="total_cost"
                value={formik.values?.total_cost}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('total_cost', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.total_cost && <FormErrorMessage>{formik.errors?.total_cost}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<CarInterface>
              formik={formik}
              name={'car_id'}
              label={'Select Car'}
              placeholder={'Select Car'}
              fetcher={getCars}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'rental',
    operation: AccessOperationEnum.UPDATE,
  }),
)(RentalEditPage);
