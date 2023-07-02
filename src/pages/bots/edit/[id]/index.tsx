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
import { getBotById, updateBotById } from 'apiSdk/bots';
import { Error } from 'components/error';
import { botValidationSchema } from 'validationSchema/bots';
import { BotInterface } from 'interfaces/bot';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ServerInterface } from 'interfaces/server';
import { getServers } from 'apiSdk/servers';

function BotEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BotInterface>(
    () => (id ? `/bots/${id}` : null),
    () => getBotById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BotInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBotById(id, values);
      mutate(updated);
      resetForm();
      router.push('/bots');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BotInterface>({
    initialValues: data,
    validationSchema: botValidationSchema,
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
            Edit Bot
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
            <FormControl id="nickname" mb="4" isInvalid={!!formik.errors?.nickname}>
              <FormLabel>Nickname</FormLabel>
              <Input type="text" name="nickname" value={formik.values?.nickname} onChange={formik.handleChange} />
              {formik.errors.nickname && <FormErrorMessage>{formik.errors?.nickname}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<ServerInterface>
              formik={formik}
              name={'server_id'}
              label={'Select Server'}
              placeholder={'Select Server'}
              fetcher={getServers}
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
    entity: 'bot',
    operation: AccessOperationEnum.UPDATE,
  }),
)(BotEditPage);
