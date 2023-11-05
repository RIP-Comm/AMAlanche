import { useSelector } from 'react-redux';
import { AppState, setBeforeLogin } from './redux/actions/Actions';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import store from './redux/Store';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
	const [isWaiting, setIsWaiting] = useState<boolean>(true);
	const isAuthLoading = useSelector((state: AppState) => state.auth.isLoading);
	const isLoading = useSelector((state: AppState) => state.isLoading);
	const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);
	const user = useSelector((state: AppState) => state.user);
	const navigate = useNavigate();

	useEffect(() => {
		if (isWaiting) {
			setInterval(() => {
				setIsWaiting(false);
			}, 100);
		}

		console.log(store.getState());
		if (!isAuthLoading && !isWaiting) {
			if (!isLoading) {
				if (!isAuthenticated) {
					const path = window.location.pathname + window.location.search + window.location.hash;
					store.dispatch(setBeforeLogin(path));
					navigate('/login');
				}
			}
		}
	}, [isWaiting, isAuthLoading, isLoading, isAuthenticated, user, navigate]);

	return <>{isAuthLoading || isWaiting ? <h2>Loading...</h2> : <>{children}</>}</>;
}

export default ProtectedRoute;
