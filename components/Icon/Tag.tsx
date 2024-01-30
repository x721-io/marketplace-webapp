import { classNames } from "@/utils/string";
import { IconProps } from "./index";

export default function TagIcon({
  color,
  className,
  width,
  height,
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={classNames(`text-${color}`, className)}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 2C1.5 1.44772 1.94772 1 2.5 1H12.5C12.7652 1 13.0196 1.10536 13.2071 1.29289L21.7992 9.885C22.358 10.4471 22.6716 11.2074 22.6716 12C22.6716 12.7926 22.358 13.5529 21.7992 14.115L21.7971 14.1171L14.6275 21.2867C14.6274 21.2868 14.6276 21.2866 14.6275 21.2867C14.349 21.5655 14.0178 21.787 13.6538 21.9379C13.2896 22.0889 12.8992 22.1666 12.505 22.1666C12.1108 22.1666 11.7204 22.0889 11.3562 21.9379C10.9921 21.787 10.6613 21.5658 10.3827 21.2869C10.3826 21.2869 10.3828 21.287 10.3827 21.2869L1.79331 12.7075C1.60552 12.5199 1.5 12.2654 1.5 12V2ZM3.5 3V11.5854L11.7967 19.8725L11.7975 19.8733C11.8904 19.9663 12.0007 20.04 12.1221 20.0903C12.2435 20.1407 12.3736 20.1666 12.505 20.1666C12.6364 20.1666 12.7665 20.1407 12.8879 20.0903C13.0093 20.04 13.1196 19.9663 13.2125 19.8733L20.3808 12.705C20.3811 12.7047 20.3814 12.7044 20.3817 12.7041C20.5674 12.5168 20.6716 12.2638 20.6716 12C20.6716 11.7362 20.5674 11.4832 20.3817 11.2959C20.3814 11.2956 20.3811 11.2953 20.3808 11.295L12.0858 3H3.5Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 7C6.5 6.44772 6.94772 6 7.5 6H7.51C8.06228 6 8.51 6.44772 8.51 7C8.51 7.55228 8.06228 8 7.51 8H7.5C6.94772 8 6.5 7.55228 6.5 7Z"
        fill="currentColor"
      />
    </svg>
  );
}
