"use client"
import Button from '@/components/Button';
import Input from '@/components/Form/Input';
import Text from '@/components/Text';
import React from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  email : string
}

export default function AccountStep({ email} : Props) {
  const {register} = useForm<Props>()
  return (
    <div className="flex gap-8 mb-8 flex-col">
      <div className="desktop:mt-5 mt-7 flex gap-8 w-full flex-col">
        <div className="flex gap-1 flex-col">
          <label className="block text-base font-semibold text-primary">Email</label>
          <Text className="text-tertiary" variant="body-12">Your email for marketplace notifications</Text>
          <Input
            placeholder="Email"
            register={register('email', { required: true, value: email })}
          />

          <Text className="text-tertiary" variant="body-12">Please check email and verify your email
            address.</Text>
          <Text className="text-tertiary flex items-center" variant="body-12">Still no
            email? <Text className="text-primary ml-1" variant="body-12">Resend</Text></Text>
        </div>
      </div>
      <div className="flex gap-1 flex-col">
        <Text className="text-body-16 font-semibold">Danger zone</Text>
        <Text className="text-tertiary text-body-12">Once you delete your account, there is no going back.
          Please be certain.</Text>
      </div>
      <div className="w-full tablet:w-auto desktop:w-auto">
        <Button className="w-full tablet:w-auto desktop:w-auto" disabled>Delete my account</Button>
      </div>
    </div>
  )

}