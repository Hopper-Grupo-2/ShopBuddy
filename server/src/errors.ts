/**
 * Para criar novos tipos de erro, adicione o nome desejado
 * e seu status HTTP correspondente em `errorNameToHttpStatusCode`,
 * seguindo os exemplos.
 *
 * Ao usar a função `createError`, o VSCode vai incluir
 * seu novo nome na lista de sugestões automáticas
 */

const errorNameToHttpStatusCode = {
	NotFoundError: 404,
	UnauthorizedError: 401,
	InternalServerError: 500,
	InvalidInputError: 400,
	ForbiddenError: 403,
};

export type ErrorNames = keyof typeof errorNameToHttpStatusCode;

export default class Error {
	public static errorNameToHttpStatusCode = errorNameToHttpStatusCode;

	public static createError(name: ErrorNames, message: String) {
		return { name, message };
	}
}
