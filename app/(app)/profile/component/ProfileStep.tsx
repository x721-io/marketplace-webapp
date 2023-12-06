import Button from '@/components/Button';
import Input from '@/components/Form/Input';
import Textarea from '@/components/Form/Textarea';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
    isDirty: boolean
    registerUsername:  UseFormRegisterReturn
    registerBio:  UseFormRegisterReturn
    registerWebURL: UseFormRegisterReturn
    registerTwitterLink: UseFormRegisterReturn
}

export default function ProfileStep({isDirty, registerUsername, registerBio, registerWebURL, registerTwitterLink }: Props) {
    return (
        <div>
            <div className="flex gap-8 mb-8">
                <div className="desktop:mt-5 tablet:mt-5 mt-7 flex gap-8 w-full flex-col">
                    <div>
                        <label className="block mb-2 font-semibold text-primary">Display name</label>
                        <Input
                            type="text"
                            register={registerUsername}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-base font-semibold text-primary">Username</label>
                        <Input
                            prependIcon="@"
                            placeholder="Thuan Nguyen"
                            register={registerUsername}
                        />
                        <Text className="text-tertiary mt-1" variant="body-12">Your profile will be available on
                            rarible.com/[username]</Text>
                    </div>
                    <div>
                        <label className="block mb-2 text-base font-semibold text-primary">Bio</label>
                        <Textarea
                            className="h-[160px] resize-none"
                            register={registerBio}
                        />
                    </div>
                    <div>
                        <Text className="text-body-24 tablet:text-body-32 desktop:text-body font-semibold ">Social
                            links</Text>
                        <Text className="text-tertiary" variant="body-16">Add your existing social links to build a
                            stronger reputation</Text>
                    </div>
                    <div>
                        <label className="block mb-2 text-base font-semibold text-primary">Website URL</label>
                        <Input
                            placeholder="https://"
                            register={registerWebURL}
                            className="console.error"
                        />
                        {/* {errors.webURL && <p role="alert">Invalid</p>} */}
                    </div>
                    <div>
                        <label className="block mb-2 text-base font-semibold text-primary">X (Twitter)</label>
                        <Input
                            prependIcon={<Icon name="circle" />}
                            placeholder="Link Twitter"
                            register={registerTwitterLink}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full tablet:w-auto desktop:w-auto">
                <Button
                    type="submit"
                    disabled={isDirty}
                    className="w-full tablet:w-auto desktop:w-auto">
                    Save settings
                </Button>
            </div>
        </div>

    )
}