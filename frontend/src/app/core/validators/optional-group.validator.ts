import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function conditionalRequiredGroupValidator(fieldKeys: string[]): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const controls = fieldKeys.map((key) => formGroup.get(key));

        // Check if at least one field in the group has a value
        const hasAnyFieldFilled = controls.some((control) => {
            const value = control?.value;
            return value && value.toString().trim() !== '';
        });

        // If all fields are empty, the group is optional and valid
        if (!hasAnyFieldFilled) {
            controls.forEach((control) => {
                if (control?.hasError('required')) {
                    control.setErrors(null);
                }
            });
            return null;
        }

        // At least one field is filled, so all fields become required
        let hasMissingFields = false;

        controls.forEach((control) => {
            const value = control?.value;
            const isEmpty = !value || value.toString().trim() === '';

            if (isEmpty) {
                // Field is empty but required because group was started
                control?.setErrors({ required: true });
                hasMissingFields = true;
            } else {
                // Field has a value, clear any 'required' error
                if (control?.hasError('required')) {
                    control.setErrors(null);
                }
            }
        });

        // Return group-level error if some fields are missing
        return hasMissingFields ? { incompleteGroup: true } : null;
    };
}
