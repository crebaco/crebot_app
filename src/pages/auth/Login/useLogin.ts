import {  useAuthContext } from '@/common'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { User } from '@/types'
import axios from 'axios'
import { toast } from 'react-toastify';
import config from '@/config'

export default function useLogin() {
	const BaseUrl = config.BaseUrl
	// const [loading, setLoading] = useState(false)
	const location = useLocation()
	const navigate = useNavigate()
    
	const { isAuthenticated, saveSession } = useAuthContext()

	const redirectUrl = useMemo(
		() =>
			location.state && location.state.from
				? location.state.from.pathname
				: '/',
		[location.state]
	)

	const login = async ({ email, password }: User) => {
		try {
		  const response = await axios.post(`${BaseUrl}/login`, { email, password });	  
		//   if (response.data.success ) {
		// 	saveSession({ token: response.data.token });
		// 	navigate(redirectUrl);
		// 	toast.success("Login Successfully.");
		if (response.data.success) {
			const { token, role } = response.data;
			saveSession({ token });
			if (role === 'user') {
			  navigate('/'); 
			} else {
			  navigate('/pages/Admin');
			}
			toast.success("Login Successful.");
		  } else {
			const errors = response.data.errors;
            if (errors && errors.length > 0) {
            errors.forEach((error: any) => {
              toast.error(error);
            });
		  }
		}
		} catch (error) {
		  console.error('Error logging in:', error);
		}
	  };
	  

	return { loading, login, redirectUrl, isAuthenticated }
}
