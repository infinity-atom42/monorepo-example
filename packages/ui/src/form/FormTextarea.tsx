import { Textarea } from '@packages/ui/components/textarea'
import { useFieldContext } from '@packages/ui/hooks/form'

import { FormBase, type FormControlProps } from './FormBase'

export function FormTextarea(props: FormControlProps) {
	const field = useFieldContext<string>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

	return (
		<FormBase {...props}>
			<Textarea
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				aria-invalid={isInvalid}
			/>
		</FormBase>
	)
}
