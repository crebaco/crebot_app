import { Button, Col, Row } from 'react-bootstrap'
import AuthLayout from '../AuthLayout'
import { Link } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
// import useRegister from './useRegister'
import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import config from '@/config'


// Components
import { VerticalForm, FormInput, PageBreadcrumb } from '@/components'



interface UserData {
	fullname: string
	email: string
	password: string
}
const BottomLink = () => {
	return (
		<Row>
			<Col xs={12} className="text-center">
				<p className="text-dark-emphasis">
					Already have account?{' '}
					<Link
						to="/auth/login"
						className="text-dark fw-bold ms-1 link-offset-3 text-decoration-underline"
					>
						<b>Log In</b>
					</Link>
				</p>
			</Col>
		</Row>
	)
}
const Register = () => {
	const BaseUrl = config.BaseUrl;
	// const { loading, register } = useRegister()

	const handleSubmit = async (data: UserData) => {
        try {
            // Send a POST request to your backend API
            const response = await axios.post(`${BaseUrl}/register`, data);
			if(response.data.success ){
				toast.success("Registration Successfully.");
				window.location.href = '/auth/login';
			}
			else{
			const errors = response.data.errors;
            if (errors && errors.length > 0) {
            errors.forEach((error: any) => {
              toast.error(error);
            });
		  }
		}
         } catch (error) {
            console.error('Error registering user:');
        }
    };

	/*
	 * form validation schema
	 */
	const schemaResolver = yupResolver(
		yup.object().shape({
			fullname: yup.string().required('Please enter Fullname'),
			email: yup
				.string()
				.required('Please enter Email')
				.email('Please enter valid Email'),
			password: yup.string().required('Please enter Password').min(8, 'Password must be at least 8 characters'),
		})
	)

	return (
		<>
			<PageBreadcrumb title="Register" />
			<AuthLayout
				authTitle="Free Sign Up"
				helpText="Enter your email address and password to access account."
				bottomLinks={<BottomLink />}
				hasThirdPartyLogin
			>
				<VerticalForm<UserData> onSubmit={handleSubmit} resolver={schemaResolver}>
					<FormInput
						label="Full Name"
						type="text"
						name="fullname"
						placeholder="Enter your name"
						containerClass="mb-3"
						required
					/>

					<FormInput
						label="Email address"
						type="text"
						name="email"
						placeholder="Enter your email"
						containerClass="mb-3"
						required
					/>

					<FormInput
						label="Password"
						type="password"
						name="password"
						placeholder="Enter your password"
						containerClass="mb-3"
					/>
					<FormInput
						isTerms={true}
						type="checkbox"
						name="checkbox"
						containerClass={'mb-3'}
					/>
					<div className="mb-0 d-grid text-center">
						<Button
							variant="primary"
							// disabled={loading}
							className="fw-semibold"
							type="submit"
						>
							Sign Up
						</Button>
					</div>
				</VerticalForm>
			</AuthLayout>
		</>
	)
}

export default Register
