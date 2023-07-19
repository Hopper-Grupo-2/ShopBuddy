export default class Validator {
    public static isValidEmail(data: any): string[] {
        let errors: string[] = [];

        if (data === undefined || data === null) {
            errors.push(`data is required`);
            return errors;
        }

        const emailRegex = /^(\w{1,}@\w{1,}\.(\w{3})(\.\w{2}){0,1})$/gim;
        if (!emailRegex.test(data)) {
            errors.push(`Invalid email`);
        }

        return errors;
    }

    public static isValidPassword(data: any, dataLabel: string): string[] {
        let errors: string[] = [];

        if (data === undefined || data === null) {
            errors.push(`${dataLabel} is required`);
            return errors;
        }

        const passwordRegex = /^\w{1,}$/gim;
        if (!passwordRegex.test(data)) {
            errors.push(`${dataLabel} Invalid`);
        }

        return errors;
    }

    public static isValidName(data: any, dataLabel: string): string[] {
        let errors: string[] = [];

        if (data === undefined || data === null) {
            errors.push(`${dataLabel} is required`);
            return errors;
        }

        if (typeof data !== "string" || data.length < 3) {
            errors.push(
                `${dataLabel} need to be string with at least 3 character`
            );
            return errors;
        }

        const nameRegex = /^[a-z0-9]{1,}$/gim;
        if (!nameRegex.test(data)) {
            errors.push(`${dataLabel} Invalid name`);
        }

        return errors;
    }

    public static isValidBool(data: any): string[] {
        let errors: string[] = [];

        if (data === undefined || data === null) {
            errors.push(`data is required`);
            return errors;
        }

        if (typeof data != "boolean") {
            errors.push(`Invalid Bool`);
        }

        return errors;
    }

    public static isValidId(data: any): string[] {
        let errors: string[] = [];

        if (data === undefined || data === null) {
            errors.push(`data is required`);
            return errors;
        }

        return errors;
    }
}
