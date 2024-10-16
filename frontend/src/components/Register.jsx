import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { signUp } from '../api/user';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Register({onSet}) {
  const initialValues = {
    name: '',
    email: '',
    password: '',
    phone: ''
  }
  const validationSchema = Yup.object({
    name: Yup.string()
    .trim('field cannot be empty')
    .required('Name is required'),
    email: Yup.string().email('Invalid email format')
    .trim('field cannot be empty')
    .required('Email is required'),
    password: Yup.string()
      .trim('field cannot be empty')
      .min(6, 'Password must be at least 6 characters long')
      .required('password is required'),
    phone: Yup.string()
      .trim('field cannot be empty')
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('phone number is required')
  })
  const handleSubmit = async (values) => {
    try {
      console.log("values:",values);
      const response = await signUp(values)
      console.log(response);
      if(response.data.status==='success'){
        toast.success("registered successfully")
         onSet(true)
      }

    } catch (error) {
      console.log("hey",error.response.data.message);
      
      if(error.response.data.message==="phone number is already taken"){
        toast.error("number is already taken")
      }
      if(error.response.data.message==="Email exist"){
        toast.error("email already exists")
      }
      console.log("error:",error.response.data.message);
      
     
      console.log(error);
      throw error

    }

  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >

      {() => (
        <Form>
          <div className="mb-4">
            <Field
              name="name"
              type="text"
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <ErrorMessage name='name' component="div" className='text-red-500' />
          </div>
          <div className="mb-4">
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <ErrorMessage name='email' component="div" className='text-red-500' />
          </div>
          <div className="mb-4">
            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <ErrorMessage name='password' component="div" className='text-red-500' />
          </div>
          <div className="mb-4">
            <Field
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <ErrorMessage name="phone" component="div" className="text-red-500" />
          </div>
          <button type='submit' className="w-full p-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition">
            REGISTER
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default Register;
