"use client";

type Props = {
  checked: boolean;
  onChange: () => void;
  id?: string;
  value: string;
};

const MyRadio: React.FC<Props> = ({ checked, onChange, id, value }) => {
  return <input id={id} type="radio" checked={checked} onClick={onChange} />;
};

export default MyRadio;
