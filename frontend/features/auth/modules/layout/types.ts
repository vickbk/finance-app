export type FormResponse = {
  success: boolean;
  error?: string;
  message?: string;
};

export type CommonFormAction = (
  _: unknown,
  form: FormData,
) => Promise<FormResponse>;

export type FormProps = {
  title: string;
  submitButton: {
    text: string;
    loadingText?: string;
  };
  action: CommonFormAction;
};
