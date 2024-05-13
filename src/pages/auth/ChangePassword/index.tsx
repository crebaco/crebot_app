import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import AuthLayout from '../AuthLayout';
import { FormInput, VerticalForm, PageBreadcrumb } from '@/components';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'


interface UserData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate()


  // Your functions for checking admin status and decoding tokens
const getTokenFromLocalStorage = () => {
	const authData = localStorage.getItem('_CREBOT_AUTH');
  
	if (authData) {
	  try {
		const parsedAuthData = JSON.parse(authData);
		return parsedAuthData.token;
	  } catch (error) {
		console.error('Error parsing auth data:', error);
		return null;
	  }
	} else {
	  return null;
	}
  };
  
  const decodeToken = (token: string) => {
	  try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const decodedData = JSON.parse(atob(base64));
		return decodedData;
	  } catch (error) {
		console.error('Error decoding token:', error);
		return {};
	  }
	};
  
  const username = () => {
	const token = getTokenFromLocalStorage();
	if (token) {
	  const decodedToken = decodeToken(token);
	  return decodedToken.memberId ;
	}
	return null;
  };

//   const [formData, setFormData] = useState<UserData>({
//     currentPassword: '',
//     newPassword: '',
//     confirmNewPassword: '',
//   });

//   useEffect(() => {
//     console.log("change password data", formData);
//   }, [formData]);

//   const handleInputChange = (name: keyof UserData, value: string) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

  /*
   * form validation schema
   */
  const schemaResolver = yupResolver(
    yup.object().shape({
      currentPassword: yup.string().required('Please enter your current password'),
      newPassword: yup.string().required('Please enter your new password').min(8, 'Password must be at least 8 characters'),
      confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
    })
  );

  /*
   * handle form submission
   */
  const handleSubmit = async (data: UserData) => {
    try {
      const memberId = username(); // Assuming username() retrieves memberId
      const requestData = { ...data, memberId };
      const response = await axios.post('http://localhost:5002/change-password', requestData);
      if (response.status === 200) {
        toast.success('Password changed successfully');
        navigate('/'); 
      } else {
        console.error('Error:', response.data);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  

  return (
    <div>
      <PageBreadcrumb title="Forgot Password" />
      <AuthLayout
        authTitle="Change Password?"
        helpText="Enter your current password to reset your password."
      >
        <VerticalForm<UserData> resolver={schemaResolver} onSubmit={handleSubmit}>
          <FormInput
            label="Current Password"
            type="password"
            name="currentPassword"
            // value={formData.currentPassword}
            // onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            placeholder="Enter your current password"
            containerClass="mb-3"
            required
          />
          <FormInput
            label="New Password"
            type="password"
            name="newPassword"
            // value={formData.newPassword}
            // onChange={(e) => handleInputChange('newPassword', e.target.value)}
            placeholder="Enter your new password"
            containerClass="mb-3"
            required
          />
          <FormInput
            label="Confirm New Password"
            type="password"
            name="confirmNewPassword"
            // value={formData.confirmNewPassword}
            // onChange={(e) => handleInputChange('confirmNewPassword', e.target.value)}
            placeholder="Confirm your new password"
            containerClass="mb-3"
            required
          />
          <div className="mb-0 text-start">
            <Button variant="soft-primary" className="w-100" type="submit">
              <i className="ri-loop-left-line me-1 fw-bold" />{' '}
              <span className="fw-bold">Reset Password</span>{' '}
            </Button>
          </div>
        </VerticalForm>
      </AuthLayout>
    </div>
  );
};

export default ForgotPassword;
