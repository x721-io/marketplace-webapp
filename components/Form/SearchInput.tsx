import React from "react";
import Input, { BaseInputProps } from "@/components/Form/Input";
import { Dropdown } from "../X721UIKits/Dropdown";

export default function SearchInput(props: BaseInputProps) {
  return (
    <Dropdown.Root label="" icon={<Input {...props} />}>
      <Dropdown.Item>Dashboard</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item>
      <Dropdown.Item>Earnings</Dropdown.Item>
      <Dropdown.Item>Sign out</Dropdown.Item>
    </Dropdown.Root>
  );
}
