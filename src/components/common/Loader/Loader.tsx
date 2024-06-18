interface LoaderProps {
  size?: number;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ className }) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className={`${className} animate-spin rounded-full border-t-2 border-b-2 h-5 w-5 border-white`}
      ></div>
    </div>
  );
};
