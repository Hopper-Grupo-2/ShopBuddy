import PageStructure from "../../components/PageStructure";
import UserForm from "../../components/UserForm";

export default function Settings() {
	return (
		<>
			<PageStructure>
				<h1>Edite as informações do seu usuário</h1>
				<UserForm />
			</PageStructure>
		</>
	);
}
