"use client"
import Text from '@/components/Text';
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi';
import { APIParams } from '@/services/api/types';
import { sanitizeObject } from '@/utils';
import { Spinner } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { toast } from 'react-toastify'

export default function EmailVerificationPage() {
    const [token, setToken] = useState('');
    const [stateVerify, setStateVerify] = useState<boolean>()
    const router = useRouter()
    const api = useMarketplaceApi()
    const { data, isLoading, error } = useSWR(
        token ? 'email-verification' : null,
        () => {
            if (token) {
                return api.fetchEmailVerify(sanitizeObject({ token }) as APIParams.FetchEmailVerify);
            }
            return null;
        }
    );

    useEffect(() => {
        const tokenFromUrl = new URLSearchParams(window.location.search).get('token');
        if (tokenFromUrl !== null) {
            setToken(tokenFromUrl);
        }
    }, []);

    useEffect(() => {
        callVerifyApi(data, isLoading, error);
    }, [data, isLoading, error]);

    const callVerifyApi = async (data1: any, isLoading1: any, error1: any) => {
        try {
            if (error1) {
                setStateVerify(false);
            } else if (data1) {
                setStateVerify(true);
            }
        } catch (e: any) {
            setStateVerify(false);
            toast.update(`Error calling API: ${e?.message}`, { type: 'error', autoClose: 1000 });
        }
    };

    const renderContent = () => {
        switch (stateVerify) {
            case false:
                return (
                    <div className='flex flex-col p-10 justify-center items-center'>
                        <Text className="font-semibold text-error text-center text-heading-sm">
                            Verify email errors.
                        </Text>
                        <span className='mt-4 text-tertiary'> Please contact the following link <span className='underline cursor-pointer hover:text-primary'>abc.com</span> for support</span>
                    </div>
                )
            case true:
                const navigationHomepage = () => {
                    router.push('/')
                }

                return (
                    <div className='flex flex-col p-10 justify-center items-center'>
                        <Text className="font-semibold text-success text-center text-heading-sm">
                            You have successfully verified your email.
                        </Text>
                        <span className='mt-4 text-tertiary'>Please click on the link <span className='underline cursor-pointer hover:text-primary' onClick={navigationHomepage}>https://nebulas.u2nft.io/</span> to return to the home page</span>
                        <span className='text-tertiary'>Or after 5 seconds it will automatically return to the home page</span>
                    </div>
                )
            default:
                return <Spinner />
        }
    }

    return (
        <div className="w-screen h-screen">
            {renderContent()}
        </div>
    )
}