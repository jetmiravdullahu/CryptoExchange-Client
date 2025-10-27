import { createFormHook } from '@tanstack/react-form'

import {
  CalendarField,
  PasswordField,
  Select,
  Slider,
  SubscribeButton,
  Switch,
  TextArea,
  TextField,
} from '../components/FormComponents'

import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    PasswordField,
    Select,
    TextArea,
    Switch,
    Slider,
    CalendarField
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
