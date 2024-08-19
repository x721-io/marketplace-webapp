"use client";

type Props = {
  checked: boolean;
  onChange: () => void;
  id?: string;
};

const MyCheckbox: React.FC<Props> = ({ checked, onChange, id }) => {
  return (
    <input id={id} type="checkbox" checked={checked} onChange={onChange} />
  );
};

export default MyCheckbox;
