"use client"
import Text from '@/components/Text';
import { useMarketplaceApi } from '@/hooks/useMarketplaceApi';
import { APIParams } from '@/services/api/types';
import { sanitizeObject } from '@/utils';
import { Spinner } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

export default function EmailVerificationPage() {
    const [token, setToken] = useState('');
    const router = useRouter()
    const api = useMarketplaceApi()

    const { data, isLoading } = useSWR(
        (params: any) => api.fetchEmailVerify(sanitizeObject(params) as APIParams.FetchEmailVerify),
        { refreshInterval: 5000 }
      )

    console.log('data: ', data)

    useEffect(() => {
        const tokenFromUrl = new URLSearchParams(window.location.search).get('token');

        if (tokenFromUrl !== null) {
            setToken(tokenFromUrl);
        }

        console.log('data: ', data)
        // callVerifyApi(tokenFromUrl)
    }, [data]);

    const callVerifyApi = async (token: any) => {
        try {
            // const response = await fetch(`http://example.com/api/verify?token=${token}`);
            // const response = await fetch('http://example.com/api/verify', {
            //     method: 'POST',
            //     headers: {
            //     'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ token }),
            // });

            // const data = await response.json();

            // console.log('API Response:', data);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };


    const renderContent = () => {
    // Get Route queries
    // Pass route queries as params to verify api
    // Loading state while verifying
    // Display errors if any
    // Message success & timeout 5s => redirect to Home
    
        return (<>{token}</>)
        // switch (true) {
        //     case error:
        //         return (
        //             <>
        //                 <Text className="font-semibold text-error text-center text-heading-sm">
        //                     Verify email errors.
        //                 </Text>
        //                 <span className='cursor-pointer '> Please contact the following link <span className='underline'>abc.com</span> for support</span>
        //             </>
        //         )
        //     case success:
        //         const navigationHomepage = () => {
        //             router.push('/')
        //         }

        //         return (
        //             <div className='flex flex-col'>
        //                 <Text className="font-semibold text-success text-center text-heading-sm">
        //                     You have successfully verified your email.
        //                 </Text>
        //                 <span>Please click on the link <span onClick={navigationHomepage}>abc.com</span> to return to the home page</span>
        //                 <span>Or after 5 seconds it will automatically return to the home page</span>
        //             </div>
        //         )
        //     case loading:
        //     default:
        //         return <Spinner />
        // }
    }

    return (
        <div className="w-screen h-screen">
            {renderContent()}
        </div>
    )
}