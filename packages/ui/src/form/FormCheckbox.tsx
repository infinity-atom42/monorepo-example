import { Checkbox } from '@packages/ui/components/checkbox'
import { useFieldContext } from '@packages/ui/hooks/form'

import { FormBase, type FormControlProps } from './FormBase'

export function FormCheckbox(props: FormControlProps) {
	const field = useFieldContext<boolean>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

	return (
		<FormBase
			{...props}
			controlFirst
			horizontal>
			<Checkbox
				id={field.name}
				name={field.name}
				checked={field.state.value}
				onBlur={field.handleBlur}
				onCheckedChange={(e) => field.handleChange(e === true)}
				aria-invalid={isInvalid}
			/>
		</FormBase>
	)
}
