import { Accordion, Label, Radio } from 'flowbite-react'
import Text from '@/components/Text'
import Input from '@/components/Form/Input'
import Button from '@/components/Button'

export default function NFTFilters() {

  return (
    <div className="w-72 flex flex-col gap-4">
      <Accordion collapseAll>
        <Accordion.Panel>
          <Accordion.Title>Type</Accordion.Title>
          <Accordion.Content>
            <div className="flex items-center gap-7 flex-wrap">
              <div className="flex gap-3 items-center">
                <Radio id="type-all" name="type" value="all" />
                <Label htmlFor="type-all">All</Label>
              </div>
              <div className="flex gap-3 items-center">
                <Radio id="type-single" name="type" value="single" />
                <Label htmlFor="type-single">Single edition</Label>
              </div>
              <div className="flex gap-3 items-center">
                <Radio id="type-multiple" name="type" value="multiple" />
                <Label htmlFor="type-multiple">Multiple editions</Label>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>

      <Accordion collapseAll>
        <Accordion.Panel>
          <Accordion.Title>Status</Accordion.Title>
          <Accordion.Content>
            <div className="flex items-center gap-7 flex-wrap">
              <div className="flex gap-3 items-center">
                <Radio id="status-all" name="status" value="all" />
                <Label htmlFor="status-all">All</Label>
              </div>
              <div className="flex gap-3 items-center">
                <Radio id="status-buy" name="status" value="buy" />
                <Label htmlFor="type-buy">Buy now</Label>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>

      <Accordion collapseAll>
        <Accordion.Panel>
          <Accordion.Title>Price</Accordion.Title>
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