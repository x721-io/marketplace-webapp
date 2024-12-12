"use client";

import React from "react";

type Props = {
  checked: boolean;
  onChange: () => void;
  id?: string;
  className?: string;
};

const MyCheckbox: React.FC<Props> = ({ checked, onChange, id, className }) => {
  return (
    <input
      className={`${className} hidden-checkbox`}
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />
  );
};

export default MyCheckbox;
