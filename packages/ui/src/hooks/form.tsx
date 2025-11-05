import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { FormInput } from "@packages/ui/form/FormInput"
import { FormTextarea } from "@packages/ui/form/FormTextarea"
import { FormSelect } from "@packages/ui/form/FormSelect"
import { FormCheckbox } from "@packages/ui/form/FormCheckbox"

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Textarea: FormTextarea,
    Select: FormSelect,
    Checkbox: FormCheckbox,
  },
  formComponents: {},
  fieldContext,
  formContext,
})

export { useAppForm, useFieldContext, useFormContext }
