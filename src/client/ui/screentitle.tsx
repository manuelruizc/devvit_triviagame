import { ACCENT_COLOR3, SECONDARY_COLOR } from '../helpers/colors';

const ScreenTitle = ({ title, className = '' }: { title: string; className?: string }) => {
  return (
    <span
      className={`px-3 py-[2px] justify-center items-center flex rounded-lg border-4 text-base lg:text-xl xl:text-2xl lg:rounded-xl ${className}`}
      style={{ backgroundColor: ACCENT_COLOR3, borderColor: SECONDARY_COLOR }}
    >
      {title}
    </span>
  );
};

export default ScreenTitle;
