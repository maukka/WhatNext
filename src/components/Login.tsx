import { useState } from 'react';

// For form validation
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FormGroup } from 'react-bootstrap';
import axios from 'axios';
// Define return value export const Login: React.FC = (): React.ReactNode => { 
// Define function with props 
/*
interface LoginProps {  
  onLogin: (username: string, password: string) => void; // A function to handle login  
  errorMessage?: string; // Optional error message  
}  

export const Login: React.FC<LoginProps> = ({ onLogin, errorMessage }): React.ReactNode => {

    const [username, setUsername] = React.useState('');  
    const [password, setPassword] = React.useState('');  

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {  
    event.preventDefault(); // Prevent default form submission  
    onLogin(username, password); // Call the onLogin function with username and password  
  }; 
}
*/

// Values for login and signup
interface AuthFormValues {
    email: string;
    password: string;
    confirmPassword?: string; // Optional for sign-up  
}

export const Login: React.FC = () => {


    const [isLogin, setIsLogin] = useState<boolean>(true);

    const formik = useFormik<AuthFormValues>({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '', // Only needed for sign-up  
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email format')
                .required('*'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('*'),
            confirmPassword: isLogin
                ? Yup.string()
                : Yup.string()
                    .oneOf([Yup.ref('password')], 'Passwords must match')
                    .required('Confirm password is required'),
        }),
        onSubmit: async (values) => {
            // Handle submit logic
            var response;
            if (isLogin) {
                response = await axios.post('http://localhost:4000/api/login', {
                    values,
                });


            } else {

                response = await axios.post('http://localhost:4000/api/sign', {
                    values,
                });

            }
            localStorage.setItem('token', response.data.token);
            //console.log(isLogin ? 'Logging in' : 'Signing up', values);
        },
    });

    return (
        <>
            {/* Adjust the form in vertically center*/}
            <div className="d-flex justify-content-center align-items-center vh-100">
                {/* Adjust the form horizontally center, make sure maximum width is 400px*/}
                <div className="w-100" style={{ maxWidth: '400px' }}>
                    <h2 className="mb-4 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
                    <Form onSubmit={formik.handleSubmit}>
                        <FormGroup className='mb-3' controlId="formGroupEmail">
                            {formik.touched.email && formik.errors.email ? (
                                <div style={{ color: 'red' }}>{formik.errors.email}</div>
                            ) : null}

                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder='Enter your email'
                                {...formik.getFieldProps('email')}
                            />

                            {formik.touched.email && formik.errors.email ? (
                                <div style={{ color: 'red' }}>{formik.errors.email}</div>
                            ) : null}
                        </FormGroup>
                        <FormGroup className='mb-3' controlId="formGroupPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div style={{ color: 'red' }}>{formik.errors.password}</div>
                            ) : null}
                        </FormGroup>
                        {!isLogin && (
                            <FormGroup className='mb-3' controlId="formGroupPasswordConfirm">
                                <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    {...formik.getFieldProps('confirmPassword')}
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                    <div style={{ color: 'red' }}>{formik.errors.confirmPassword}</div>
                                ) : null}
                            </FormGroup>
                        )}
                        <FormGroup className='mp-3' controlId='formGroupSubmit'>
                            <Button variant="primary" type="submit" active>{isLogin ? 'Login' : 'Sign Up'}</Button>
                        </FormGroup>
                        <FormGroup controlId='formGroupSignUp'>
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}>{isLogin ? 'SignUp' : 'Login'}</a>
                        </FormGroup>
                    </Form >
                </div>
            </div >
        </>
    );
};