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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createBot } from 'apiSdk/bots';
import { Error } from 'components/error';
import { botValidationSchema } from 'validationSchema/bots';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ServerInterface } from 'interfaces/server';
import { getServers } from 'apiSdk/servers';
import { BotInterface } from 'interfaces/bot';

function BotCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BotInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBot(values);
      resetForm();
      router.push('/bots');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BotInterface>({
    initialValues: {
      nickname: '',
      server_id: (router.query.server_id as string) ?? null,
    },
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
            Create Bot
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(BotCreatePage);
