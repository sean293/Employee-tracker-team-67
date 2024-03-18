import { useRouteError } from "react-router-dom";

import Home from "./Home";

import './index.css';

export default function ErrorPage() {
const error = useRouteError();
console.error(error);

return (
	<div id="error-page">
		<Home />
		<p>An unexpected error has occurred.</p>
	</div>
);
}