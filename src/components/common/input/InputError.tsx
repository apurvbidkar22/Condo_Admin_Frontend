const InputError: React.FC<{ errorMessage: string }> = ({ errorMessage }) => {
  return <div className="p-1 text-left text-error text-xs">{errorMessage}</div>;
};

export default InputError;
