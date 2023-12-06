"use client"
import Button from '@/components/Button';
import React, { RefObject } from 'react';
import Image, { StaticImageData } from 'next/image'
import UploadIcon from '@/components/Icon/Upload';
import defaultAvatar from '@/assets/images/default-avatar-user.png'
import CloseIcon from '@/components/Icon/Close';
import { classNames } from '@/utils/string'

interface Props {
    file: Blob | undefined
    inputRef: RefObject<HTMLInputElement>
    fileCover: Blob | undefined
    inputRefCover: RefObject<HTMLInputElement>
    onHandleInputImage: (files: FileList | null) => void
    onPreviewImage: string | StaticImageData
    onHandleClearImage: () => void
    onHandleClearImageCover: () => void
    onHandleInputImageCover: (files: FileList | null) => void
    onPreviewImageCover: string | StaticImageData
    containerClass?: string
}

export default function SectionCover({ 
    file, 
    inputRef, 
    fileCover, 
    inputRefCover, 
    onHandleInputImage, 
    onPreviewImage, 
    onHandleClearImage, 
    onHandleClearImageCover, 
    onHandleInputImageCover, 
    onPreviewImageCover, 
    containerClass
    }: Props) {
    return (
        <div className= {classNames('bg-cover relative w-full h-[180px]', containerClass)}
            style={{ background: 'var(--gradient-001, linear-gradient(90deg, #22C746 -2.53%, #B0F445 102.48%))' }}>
            <div className="absolute ml-6 block w-[120px] h-[120px] bottom-[-46px]">
                <input
                    className={!!file ? 'hidden' : `absolute left-0 right-0 w-full h-full opacity-0 cursor-pointer`}
                    type="file"
                    ref={inputRef}
                    onChange={(e) => onHandleInputImage(e.target.files)}
                />
                {!!file ? (
                    <Image
                        className="rounded-2xl w-full h-auto object-cover"
                        src={onPreviewImage}
                        alt="Avatar"
                        width={1}
                        height={1}
                    />
                ) : (
                    <Image
                        className="rounded-2xl"
                        src={defaultAvatar}
                        alt="Avatar"
                        style={{ width: '100%', height: '100%' }}
                    />
                )}

                {!!file && (
                    <Button
                        variant="icon"
                        className="absolute right-[-10px] top-[-18px]"
                        onClick={onHandleClearImage}
                    >
                        <CloseIcon width={14} height={14} />
                    </Button>
                )}
            </div>
            <div className="absolute right-2 top-2 bg-button-secondary rounded-xl w-12 h-12">
                <div className="absolute top-[33%] left-[31%]">
                    {!fileCover && (
                        <UploadIcon width={16} height={16} />
                    )}
                    {!!fileCover && (
                        <Button
                            variant="icon"
                            className=" absolute top-[-16px] left-[-10px] w-12 h-12"
                            onClick={onHandleClearImageCover}
                        >
                            <CloseIcon width={14} height={14} />
                        </Button>
                    )}
                </div>
                <input
                    className={!!fileCover ? 'hidden' : `bg-button-secondary px-4 h-12 w-12 rounded-xl opacity-0`}
                    type="file"
                    ref={inputRefCover}
                    onChange={(e) => onHandleInputImageCover(e.target.files)}
                />
            </div>
            {!!fileCover ? (
                <Image
                    className="rounded-2xl w-full h-[180px] object-cover"
                    src={onPreviewImageCover}
                    alt="Cover"
                    width={1200}
                    height={256}
                />
            ) : (
                <div></div>
            )}
        </div>
    )
}