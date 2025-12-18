import { UserPlusIcon } from 'lucide-react'
import { forwardRef, useImperativeHandle } from 'react'
import type { useAppForm } from '@/hooks/form'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

interface AddUserAccordionProps {
  accordionValue: string
  setAccordionValue: (value: string) => void
  form: ReturnType<typeof useAppForm>
}

export interface AddUserAccordionRef {
  submitForm: () => void
  resetForm: () => void
}

export const AddUserAccordion = forwardRef<
  AddUserAccordionRef,
  AddUserAccordionProps
>(({ accordionValue, setAccordionValue, form }, ref) => {

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      try {
        await form.handleSubmit()
        return null // No errors
      } catch (errors) {
        console.log('Submit errors:', errors)
        return errors
      }
    },
    resetForm: () => {
      form.reset()
    },
  }))

  return (
    <Accordion
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
      className="w-full"
    >
      <AccordionItem value="add-user">
        <AccordionTrigger className="hover:no-underline [&>svg]:hidden">
          <Button type='button' className="w-full">
            <UserPlusIcon className="size-5" />
            <span>Add New User</span>
          </Button>
        </AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4'>
          {/* First Name Field */}
          <form.AppField name="firstName">
            {(field) => (
              <field.TextField
                label="First Name"
                placeholder="Enter first name"
              />
            )}
          </form.AppField>

          {/* Last Name Field */}
          <form.AppField name="lastName">
            {(field) => (
              <field.TextField
                label="Last Name"
                placeholder="Enter last name"
              />
            )}
          </form.AppField>

          {/* Personal Number ID Field */}
          <form.AppField name="personalNumberID">
            {(field) => (
              <field.TextField
                label="Personal Number ID"
                placeholder="Enter personal number ID"
                type="number"
              />
            )}
          </form.AppField>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
})
