import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import jwt_decode from "jwt-decode";
import {BASE_URL} from "../../constant/appInfo.ts";


const Login = () => {

    const [user, setUser] = useState({
        email: "",
        password: "",
    })

    const [error, setError] = useState('')
    const [, setCookies] = useCookies(['AuthToken'])
    const [userType, setUserType] = useState('')

    const navigate = useNavigate()
    useEffect(() => {
        if (userType === 'USER') navigate('/');
        if (userType === 'ADMIN') navigate('/admin');
    }, [userType, navigate]);


    const onLogin = async (e: { preventDefault: () => void; }) => {
        e.preventDefault() //chặn reload trang
        try {
            const response = await axios.post(BASE_URL+`/login`, user)
            const success = response.status === 201
            if (success) {
                const {access_token} = response.data;
                // @ts-ignore
                setCookies('AuthToken', access_token)

                const decodedToken = jwt_decode(access_token);
                // @ts-ignore
                const type = decodedToken.userType;

                setUserType(type);
            }
            else {
                // Xử lý lỗi không rõ ràng từ backend
                setError('Something went wrong. Please try again later.');
            }
        } catch (error: unknown) {
            // @ts-ignore
            if (error.response) {
                // Lỗi từ server (401, 404, 500...)
                // @ts-ignore
                setError(error.response.data.message || 'Incorrect login or password.');
            } else {
                // Lỗi mạng hoặc lỗi khác
                setError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
            }
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div
                    className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                    email</label>
                                <input type="email" name="email" id="email"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="name@company.com"
                                       required={true}
                                       onChange={(e) => setUser({...user, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       required={true}
                                       onChange={(e) => setUser({...user, password: e.target.value})}/>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox"
                                               className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                               required={false}/>
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember
                                            me</label>
                                    </div>
                                </div>
                                <a href="#"
                                   className="text-sm font-medium text-blue-600 hover:underline dark:text-primary-500">Forgot
                                    password?</a>
                            </div>

                            <p className="text-center text-red-500 font-semibold">{error}</p>

                            <button type="submit"
                                    className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    onClick={onLogin}>
                                Sign in
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <a href="/sign-up"
                                                              className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign
                                up</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>


    );
}

export default Login;
