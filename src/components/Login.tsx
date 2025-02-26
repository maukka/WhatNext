import { useState } from 'react';

// For form validation
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FormGroup } from 'react-bootstrap';
import axios from 'axios';
import { useLogin } from './LoginProvider';
import { useNavigate } from 'react-router-dom';


// Values for login and signup
interface AuthFormValues {
    email: string;
    password: string;
    confirmPassword?: string; // Optional for sign-up  
}

export const Login: React.FC = () => {


    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [loginError, setLoginError] = useState<string>("");
    const { login } = useLogin();
    const navigate = useNavigate();

    const formik = useFormik<AuthFormValues>({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email format')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: isLogin
                ? Yup.string()
                : Yup.string()
                    .oneOf([Yup.ref('password')], 'Passwords must match')
                    .required('Confirm password is required'),
        }),
        onSubmit: async (values) => {
            // Handle submit logic
            if (isLogin && Object.keys(formik.errors).length == 0) {
                try {

                    console.log(values);
                    await axios.post('http://localhost:3000/api/login', {
                        values
                    });
                    // Store username for tasks component
                    login(values.email);
                    navigate('/tasks'); // Redirect to the tasks page after login
                    setLoginError("");

                }
                catch (err: unknown) {
                    if (axios.isAxiosError(err)) {

                        const { response } = err;
                        if (response) {
                            const { status, data } = response;
                            console.error('Error response data:', data);
                            console.error('Error response status:', status);
                            if (status === 401) {
                                setLoginError("Invalid email or password");
                            } else {
                                setLoginError("Login failed for reason " + data);
                            }
                        }
                    }
                }

            } else {

                try {

                    const response = await axios.post('http://localhost:3000/api/sign', {
                        values,
                    });

                    login(values.email);
                    navigate('/tasks'); // Redirect to the tasks page after login
                    setLoginError("");
                }
                catch (error) {
                    if (axios.isAxiosError(error)) {

                        const { response } = error;
                        if (response) {
                            const { status, data } = response;
                            console.error('Error response data:', data);
                            console.error('Error response status:', status);
                            setLoginError("Registration failed for reason " + data);
                        }
                    }
                }
            }
            //localStorage.setItem('token', response.data.token);
        },
    });

    return (
        <>
            {/* Adjust the form in vertically center*/}
            <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: 'lightgrey' }}>
                {/* Adjust the form horizontally center, make sure maximum width is 400px*/}
                <div className="w-100" style={{ maxWidth: '400px' }}>
                    <h2 className="mb-4 text-center" style={{ backgroundColor: 'orange', padding: "10px", borderRadius: "15px" }}>{isLogin ? 'Login' : 'Sign Up'} to What Next</h2>
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
                                <Form.Label controlId="confirmPassword">Confirm Password</Form.Label>
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
                            <Button variant="primary" disabled={Object.keys(formik.errors).length > 0} type="submit" active>{isLogin ? 'Login' : 'Sign Up'}</Button>
                        </FormGroup>
                        <FormGroup style={{ marginTop: '10px' }} controlId='formGroupSignUp'>
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}>{isLogin ? 'SignUp' : 'Login'}</a>
                        </FormGroup>
                    </Form >
                </div>
                <div>
                    <h3 className='justify-content-center align-items-center'>{loginError.length > 0 ? loginError : ''}</h3>
                </div>
            </div >
        </>
    );
};