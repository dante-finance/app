import React, { ChangeEventHandler, FormEventHandler, ReactNode, useCallback, useState } from 'react';
import { TextField, Button, Slider } from '@material-ui/core';
import { useComponentId } from '../../../hooks/useUniqueId';
import { Alert } from '@material-ui/lab';
import { useMutation } from 'react-query';

interface VaultsAmountFormProps {
  inputMax: number;
  inputLabel: string;
  inputDesc: ReactNode;

  submitLabel: string;

  handleSubmitRequest: (amount: number) => Promise<void>;

  onSuccess: () => void;
  onError: () => void;
}

export function VaultsAmountForm(props: VaultsAmountFormProps): JSX.Element {
  const { inputMax, inputLabel, inputDesc, submitLabel, handleSubmitRequest, onSuccess, onError } = props;

  const htmlID = useComponentId();

  const [amount, setAmount] = useState(0);

  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    let value = Number(event.target.value);
    setAmount(Number.isNaN(value) ? 0 : value);
  }, []);

  const handleSliderChange = useCallback<React.ComponentProps<typeof Slider>['onChange']>((_event, value) => {
    setAmount(Number.isNaN(value) ? 0 : (value as number));
  }, []);

  const updateMutation = useMutation(handleSubmitRequest, {
    onSuccess() {
      setSubmitSuccess(true);
      onSuccess();
    },
    onError() {
      setSubmitError(true);
      onError();
    },
  });
  const { mutate } = updateMutation;

  const handleSubmit = useCallback<FormEventHandler>(
    (event) => {
      event.preventDefault();
      setSubmitSuccess(false);
      setSubmitError(false);
      mutate(amount);
    },
    [amount, mutate],
  );

  return (
    <form onSubmit={handleSubmit}>
      {submitSuccess && <Alert>Submit success!</Alert>}

      {submitError && <Alert severity="error">Submit error!</Alert>}

      {inputDesc}

      <div>
        <TextField
          id={htmlID}
          type="number"
          value={amount}
          aria-label={inputLabel}
          disabled={inputMax === 0}
          inputProps={{ min: 0, max: inputMax }}
          onChange={handleChange}
        />
      </div>
      <Slider aria-label={inputLabel} aria-hidden value={amount} min={0} max={inputMax} onChange={handleSliderChange} />

      <Button type="submit" disabled={inputMax === 0 || !amount || updateMutation.isLoading}>
        {submitLabel}
      </Button>
    </form>
  );
}
