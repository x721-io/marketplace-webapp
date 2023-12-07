'use client'

import React from 'react'
import SliderIcon from '@/components/Icon/Sliders'
import Button from '@/components/Button'
import { Dropdown } from 'flowbite-react'
import Icon from '@/components/Icon'
import CommandIcon from '@/components/Icon/Command'
import Input from '@/components/Form/Input'

interface Props {
    showFilters: boolean
    setShowFilters: void
}

export default function ListSectionCollection({ showFilters, setShowFilters }: Props) {
    return (
        <div className="flex gap-4 flex-wrap justify-between desktop:flex-nowrap mb-4 tablet:mb-8 desktop:mb-8">
            <div className="order-3 desktop:order-1">
                <Button
                    onClick={() => setShowFilters}
                    className={showFilters ? 'bg-white shadow' : `bg-surface-soft`}
                    scale="lg"
                    variant="secondary">
                    Filters
                    <span className="p-1 bg-surface-medium rounded-lg">
                        <SliderIcon width={14} height={14} />
                    </span>
                </Button>
            </div>
            <div className="relative flex-1 order-2 desktop:order-3 min-w-[180px]">
                <Input
                    className="py-4 h-14 w-full"
                    appendIcon={<CommandIcon color="gray-500" width={14} height={14} />}
                    appendIconContainerClass="w-6 h-6 bg-surface-medium rounded-lg top-1/4 right-4 py-0 pr-0 pl-1.5" />
            </div>
            <div className="order-4">
                <Dropdown
                    label=""
                    dismissOnClick={false}
                    renderTrigger={() => (
                        <div className="bg-surface-soft flex items-center justify-center gap-3 rounded-2xl p-3 h-full cursor-pointer">
                            Price: Ascending
                            <div className="rounded-lg p-1 bg-surface-medium">
                                <Icon name="chevronDown" width={14} height={14} />
                            </div>
                        </div>
                    )}>
                    <Dropdown.Item>Price: Ascending</Dropdown.Item>
                    <Dropdown.Item>Price: Descending</Dropdown.Item>
                    <Dropdown.Item>Date: Ascending</Dropdown.Item>
                    <Dropdown.Item>Date: Descending</Dropdown.Item>
                </Dropdown>
            </div>
        </div>
    )
}