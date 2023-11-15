"use client"

import Select from '@/components/Form/Select'
import React, { useState } from 'react'
import Input from '@/components/Form/Input'
import Icon from '@/components/Icon'
import Link from 'next/link'

export default function Home() {
  const [text, setText] = useState('')
  const [selected, setSelected] = useState('1')
  const options = [{ label: 'value 1', value: 1 }, { label: 'value 2', value: 2 }]

  return (
    <div className="p-11">
      <div>
        <Input
          error
          value={text}
          onChange={event => setText(event.target.value)}
        />
      </div>

      <Select
        options={options}
        value={selected}
        onChange={e => setSelected(e.target.value)}
        prependIcon={<Icon name="u2u-logo" />}
      />

      <Link href={'/connect'}>Connect</Link>
    </div>
  )
}
