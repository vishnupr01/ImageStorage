import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { sigIn } from '../api/user';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate()
  const initialValues = {
    email: '',
    password: '',
  }
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format')
      .trim('field cannot be empty')
      .required('Email is required'),
    password: Yup.string()
      .trim('field cannot be empty')
      .min(6, 'Password must be at least 6 characters long')
      .required('password is required'),
  })
  const handleSubmit = async (values) => {
    try {
      const response = await sigIn(values)
      console.log(response);
      if (response.data.status === "success") {
        toast.success("logined successfull")
        login(response.data.data)
        navigate('/')
      } else {
        toast.error("login failed")
      }


    } catch (error) {
      if(error.response.data.message==='Invalid password'){
        toast.error("password is incorrect")
      }
      console.log(error);
      throw error

    }
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      <Form>
        <div className="mb-4">
          <Field
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <Field
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <p className="text-right text-sm text-gray-500 mb-4 cursor-pointer">Forgot your password?</p>
        <button className="w-full p-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition">
          LOG IN
        </button>
      </Form>
    </Formik>
  );
}

export default Login;
