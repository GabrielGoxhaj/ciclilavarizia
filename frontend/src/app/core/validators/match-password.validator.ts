import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function matchPasswordValidator(passwordKey: string, confirmKey:string) : ValidatorFn{
    return (group: AbstractControl) : ValidationErrors | null =>{
        const password = group.get(passwordKey);
        const confirm = group.get(confirmKey);

        if(!password || !confirm){
            return null;
        }

        if(confirm.errors && !confirm.errors['passwordMismatch']){
            return null;
        }

        if(password.value !== confirm.value){
            confirm.setErrors({passwordMismatch: true});
            return {passwordMismatch: true};
        } else {
            if (confirm.hasError('passwordMismatch')){
                confirm.setErrors(null);
            }
        }
        return null;
    }
}