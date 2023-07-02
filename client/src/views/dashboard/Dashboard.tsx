import PageStructure from "../../components/PageStructure";
import Card from "../../components/Card";

import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const dummyLists = [
		{
			id: 1,
			title: "Feira do mês",
			date: new Date(),
			total: 123.45,
		},
		{
			id: 2,
			title: "Feira do mês 2",
			date: new Date(),
			total: 123.45,
		},
		{
			id: 3,
			title: "Feira do mês 3",
			date: new Date(),
			total: 123.45,
		},
	];

	const navigate = useNavigate();

	return (
		<>
			<PageStructure>
				<h1>Welcome to the dashboard!</h1>
				{dummyLists.map((list) => (
					<Card
						key={list.id}
						title={list.title}
						date={list.date}
						total={list.total}
						action={() => {
							navigate("/list");
						}}
					/>
				))}
			</PageStructure>
		</>
	);
}
