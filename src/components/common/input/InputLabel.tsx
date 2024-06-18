interface InputLabelProps {
  name: string;
  label?: string;
  required?: boolean;
  icon?: string;
}

const InputLabel: React.FC<InputLabelProps> = (props) => {
  const { name, label, required, icon } = props;
  return (
    <>
      <label className="block text-sm lg:text-base mb-1" htmlFor={name}>
        {icon}
        {label}
        {required && <span className="text-error">*</span>}
      </label>
    </>
  );
};

export default InputLabel;
