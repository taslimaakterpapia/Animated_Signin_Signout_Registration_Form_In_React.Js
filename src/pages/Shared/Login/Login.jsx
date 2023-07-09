import React from 'react';
import { Helmet } from 'react-helmet-async';
import './Login.css';
import { useContext, useEffect, useState } from 'react';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { AuthContext } from '../../../providers/AuthProvider';
import { useForm } from 'react-hook-form';




const Login = () => {

    // ----------------signUp---------

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useContext(AuthContext);


    const onSubmit = data => {
        console.log(data);
        createUser(data.email, data.password)
            .then(result => {
                const loggedUser = result.user;
                console.log(loggedUser);
                updateUserProfile(data.name, data.photoURL)
                    .then(() => {
                        console.log('user profile info updated')
                        reset();
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'User Created successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        navigate('/');
                    })
                    .catch(error => console.log(error))
            })
    };


    // ----------------------------Login------------

    const [disabled, setDisabled] = useState(true);

    const { signIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        loadCaptchaEnginge(6);
    }, [])

    const handleLogin = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password);
        signIn(email, password)
            .then(result => {
                const user = result.user;
                console.log(user);
                Swal.fire({
                    title: 'User Login SuccessFul',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                });
                navigate(from, { replace: true });
            })
    }

    const handleValidateCaptcha = (e) => {
        const user_captcha_value = e.target.value;

        if (validateCaptcha(user_captcha_value)) {
            setDisabled(false);
        }

        else {
            setDisabled(true);
        }

    }


    // -----------------------Animation js-----------------


    React.useEffect(() => {
        let wrapper = document.querySelector('.wrapper');
        let signUpLink = document.querySelector('.link .signup-link');
        let signInLink = document.querySelector('.link .signin-link');

        signUpLink.addEventListener('click', () => {
            wrapper.classList.add('animated-signin');
            wrapper.classList.remove('animated-signup');
        });

        signInLink.addEventListener('click', () => {
            wrapper.classList.add('animated-signup');
            wrapper.classList.remove('animated-signin');
        });
    }, []);


    return (
        <div>
            <Helmet>
                <title>Bistro Boss | Login </title>
            </Helmet>
            <div className='login'>
                <div className="wrapper">
                    {/* --------SignUp Start-- */}
                    <div className="form-container sign-up">
                        <form onSubmit={handleSubmit(onSubmit)} action="#">
                            <h2>sign up</h2>

                            {/* --------Photo URL-- */}

                            <div className="form-group">

                                <input type="text" {...register("photoURL", { required: true })} required />
                                {errors.photoURL && <span className="text-red-600">Photo URL is required</span>}
                                <label >Photo URL</label>
                            </div>

                            {/* --------name-- */}

                            <div className="form-group">

                                <input type="text"  {...register("name", { required: true })} required />
                                {errors.name && <span className="text-red-600">Name is required</span>}
                                <label >name</label>
                                <i className="fas fa-user"></i>

                            </div>

                            {/* --------Email-- */}
                            <div className="form-group">
                                <input type="email"  {...register("email", { required: true })} required />
                                {errors.email && <span className="text-red-600">Email is required</span>}
                                <label>email</label>
                                <i className="fas fa-at"></i>
                            </div>
                            <div className="form-group">
                                <input type="password"
                                    {...register("password", {
                                        required: true,
                                        minLength: 6,
                                        maxLength: 20,
                                        pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/

                                    })}

                                    required />
                                {errors.password?.type === 'required' && <p className="text-red-600">Password must be 6 characters</p>}
                                {errors.password?.type === 'minLength' && <p className="text-red-600">Password must be 6  characters</p>}
                                {errors.password?.type === 'maxLength' && <p className="text-red-600">Password must be less then 20 characters</p>}
                                {errors.password?.type === 'pattern' && <p className="text-red-600">Password must have one upper case, one lower case, one number and one special characters </p>}
                                <label>password</label>
                                <i className="fas fa-lock"></i>
                            </div>

                            <button type="submit" className="btn">sign up</button>
                            <div className="link">
                                <p>You already have an account?<a href="#" className="signin-link"> Login</a></p>
                            </div>
                        </form>
                    </div>
                    {/* -------------------Login Start------------ */}
                    <div className="form-container sign-in">
                        <form onSubmit={handleLogin} action="sign">
                            <h2>login</h2>
                            <div className="form-group">
                                <input type="email"
                                    name='email'
                                    required />
                                <i className="fas fa-user"></i>
                                <label >Email</label>
                            </div>
                            <div className="form-group">
                                <input type="password"
                                    name='password'
                                    required />
                                <i className="fas fa-lock"></i>
                                <label >password</label>
                            </div>
                            <div className="form-group">
                                <div className='pb-4 font-bold'>
                                    <LoadCanvasTemplate />
                                </div>

                                <input onBlur={handleValidateCaptcha} type="text" name="captcha" placeholder="type the captcha above" className='text-black' />

                            </div>

                            <div className="forgot-pass pt-4">
                                <a href="#" className="label-text-alt link link-hover ">forgot password?</a>
                            </div>


                            <input disabled={disabled} className="btn btn-primary" type="submit" value="Login" />




                            <div className="link">
                                <p>Do not have an account?<a href="#" className="signup-link "> sign up</a></p>



                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;