import Button from '@/components/Button';
import Input from '@/components/Form/Input';
import Textarea from '@/components/Form/Textarea';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import React from 'react';
import { useForm } from 'react-hook-form';
import useAuthStore from '@/store/auth/store'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'

interface ProfileFormState {
  bio: string
  email: string
  username: string
  shortLink: string
  twitterLink: string
  webURL: string
  facebookLink: string
  telegram: string
  discord: string
  avatar: string
  coverImage: string
}

export default function ProfileStep() {
  const profile = useAuthStore(state => state.profile)
  const { onUpdateProfile } = useAuth()

  const { handleSubmit, register, formState: { isDirty,  } } = useForm<ProfileFormState>({
    defaultValues: profile || {
      bio: '',
      username: '',
      twitterLink: '',
      webURL: '',
      facebookLink: '',
      telegram: '',
      discord: '',
    }
  })

  const onSubmitProfile = async (params: ProfileFormState) => {
    const toastId = toast.loading('Uploading Profile...', { type: 'info' })

    try {
      await onUpdateProfile(params)

      toast.update(toastId, {
        render: 'Profile updated successfully',
        type: 'success',
        isLoading: false,
        autoClose: 1000
      })
    } catch (e) {
      console.error('Error:', e)
      toast.update(toastId, { render: `Profile updating: ${e}`, type: 'error', isLoading: false, autoClose: 1000 })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitProfile)}>
      <div className="flex gap-8 mb-8">
        <div className="desktop:mt-5 tablet:mt-5 mt-7 flex gap-8 w-full flex-col">
          <div>
            <label className="block mb-2 font-semibold text-primary">Display name</label>
            <Input
              type="text"
              register={register('username')}
            />
          </div>
          <div>
            <label className="block mb-2 text-base font-semibold text-primary">Username</label>
            <Input
              prependIcon="@"
              placeholder="Your username"
              register={register('shortLink')}
            />
            <Text className="text-tertiary mt-1" variant="body-12">
              Your profile will be available on https://marketplace.uniultra.xyz/user/[username]
            </Text>
          </div>
          <div>
            <label className="block mb-2 text-base font-semibold text-primary">Bio</label>
            <Textarea
              className="h-[160px] resize-none"
              register={register('bio')}
            />
          </div>
          <div>
            <Text className="text-body-24 tablet:text-body-32 desktop:text-body font-semibold ">
              Social links
            </Text>
            <Text className="text-tertiary" variant="body-16">
              Add your existing social links to build a stronger reputation
            </Text>
          </div>
          <div>
            <label className="block mb-2 text-base font-semibold text-primary">Website URL</label>
            <Input
              placeholder="https://"
              register={register('webURL')}
              className="console.error"
            />
          </div>
          <div>
            <label className="block mb-2 text-base font-semibold text-primary">X (Twitter)</label>
            <Input
              prependIcon={<Icon name="circle" />}
              placeholder="https://twitter.com/[your-twitter-username]"
              register={register('twitterLink')}
            />
          </div>
          <div>
            <label className="block mb-2 text-base font-semibold text-primary">Facebook</label>
            <Input
              placeholder="https://www.facebook.com/[your-facebook-username]"
              register={register('facebookLink')}
            />
          </div>
        </div>
      </div>
      <div className="w-full tablet:w-auto desktop:w-auto">
        <Button
          type="submit"
          disabled={!isDirty}
          className="w-full tablet:w-auto desktop:w-auto">
          Save settings
        </Button>
      </div>
    </form>
  )
}