import Button from '@/components/Button';
import Input from '@/components/Form/Input';
import Text from '@/components/Text';
import React from 'react';
import { useForm } from 'react-hook-form'
import useAuthStore from '@/store/auth/store'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import { emailRegex } from '@/utils/regex'
import FormValidationMessages from '@/components/Form/ValidationMessages'
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

interface FormState {
  email: string
}

export default function AccountStep() {
  const { onUpdateProfile, onResendEmail } = useAuth()
  const email = useAuthStore(state => state.profile?.email)
  const verifyEmail = useAuthStore(state => state.profile?.verifyEmail)

  const { register, handleSubmit, reset, formState: { isDirty, errors }, getValues } = useForm<FormState>({
    defaultValues: {
      email: email || ''
    }
  })

  const onSubmit = async ({ email }: FormState) => {
    try {
      await toast.promise(onUpdateProfile({ email }), {
        pending: 'Updating email',
        success: 'Email updated successfully!',
        error: {
          render: error => `Error report: ${(error.data as any).message}`
        }
      })
    } catch (e) {
      console.error('Error:', e)
    } finally {
      reset({ email })
    }
  }

  const handleResend = async () => {
    const toastId = toast.loading('Uploading send email...', { type: 'info' })
    try {
      await onResendEmail({ email: getValues('email') })
      toast.update(toastId, {
        render: 'Send email successfully',
        type: 'success',
        isLoading: false,
        autoClose: 1000
      })
    } catch (e) {
      console.error('Error:', e)
    } finally {

    }
  }


  return (
    <div className="flex gap-8 mb-8 flex-col">
      <div className="desktop:mt-5 mt-7 flex gap-8 w-full flex-col">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-1 flex-col mb-4">
            <label className="block text-base font-semibold text-primary">Email</label>
            <Text className="text-tertiary" variant="body-12">Your email for marketplace notifications</Text>
            <Input
              placeholder="Email"
              error={!!errors.email}
              register={register('email', {
                required: 'Email is required',
                pattern: { value: emailRegex, message: 'Invalid email address' }
              })}
            />
            <Text className="text-tertiary" variant="body-12">
              Please check email and verify your email address.
            </Text>
            {verifyEmail &&
              <Text className="text-tertiary flex items-center" variant="body-12">
                Still no email?
                <span className="text-primary ml-1 text-body-12 cursor-pointer" onClick={handleResend}>Resend</span>
              </Text>
            }
          </div>
          <FormValidationMessages errors={errors} />
          {verifyEmail === false &&
            <Button type="submit" disabled={!isDirty}>
              Update email
            </Button>
          }
        </form>

      </div>
      {/* <div className="flex gap-1 flex-col">
        <Text className="text-body-16 font-semibold">Danger zone</Text>
        <Text className="text-tertiary text-body-12">
          Once you delete your account, there is no going back. Please be certain
        </Text>
      </div>
      <div className="w-full tablet:w-auto desktop:w-auto">
        <Button className="w-full tablet:w-auto desktop:w-auto" disabled>Delete my account</Button>
      </div> */}
    </div>
  )
}