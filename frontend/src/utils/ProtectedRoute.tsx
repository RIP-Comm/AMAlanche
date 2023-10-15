import { useSelector } from 'react-redux';
import { AppState } from './redux/actions';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
	const [isWaiting, setIsWaiting] = useState<boolean>(true);
	const isLoading = useSelector((state: AppState) => state.isLoading);
	const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);
	const user = useSelector((state: AppState) => state.user);
	const navigate = useNavigate();

	useEffect(() => {
		if (isWaiting) {
			setInterval(() => {
				setIsWaiting(false);
			}, 250);
		}

		if (!isWaiting) {
			if (!isLoading) {
				if (!isAuthenticated) {
					navigate('/login');
				}
			}
		}
	}, [isWaiting, isLoading, isAuthenticated, user, navigate]);

	return <>{children}</>;
}

export default ProtectedRoute;
