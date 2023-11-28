import { Accordion, Label, Radio } from 'flowbite-react'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'

export default function CollectionFilters() {

  return (
    <div className="w-72 flex flex-col gap-4">
      <Accordion collapseAll>
        <Accordion.Panel>
          <Accordion.Title>Floor Price</Accordion.Title>
          <Accordion.Content>
            <div className="flex items-center gap-4 mb-4">
              <Input containerClass="w-24" scale="sm" placeholder="Min" type="number"/>
              <Text className="text-primary">
                to
              </Text>
              <Input containerClass="w-24" scale="sm" placeholder="Max" type="number"/>
            </div>

            <Button className="w-full" variant="secondary">
              Apply
            </Button>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  )
}