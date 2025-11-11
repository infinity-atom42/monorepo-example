import { FormCheckbox } from '@packages/ui/form/FormCheckbox'
import { FormInput } from '@packages/ui/form/FormInput'
import { FormSelect } from '@packages/ui/form/FormSelect'
import { FormTextarea } from '@packages/ui/form/FormTextarea'

import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

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
