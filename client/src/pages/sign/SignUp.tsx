
import {useState} from "react";
import axios from "axios";


import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../../constant/appInfo.ts";


const SignUp = () => {
    let navigate = useNavigate()

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''

    })

    const [confirmPassword, setConfirmPassword] = useState<string>() //Sử dụng <string> là cách để cho TypeScript biết rằng confirmPassword là một biến có kiểu dữ liệu là chuỗi.
    const [error, setError] = useState<string>()

    const onSignUp = async (e:any) => {

        e.preventDefault() //chặn reload trang
        try {
            if (user.password !== confirmPassword) {
                setError('Password needs to match!')
                return
            } else {
                const response = await axios.post(BASE_URL+`/register/USER`, user)

                if (response.status === 201) {
                    // Đăng ký thành công
                    // Sau khi đăng ký thành công, điều hướng đến một trang khác
                    alert("Success!")
                    navigate('/login');

                    // window.location.reload(); // Tùy chỉnh theo nhu cầu của bạn
                } else {
                    // Xử lý lỗi không rõ ràng từ backend
                    setError('Something went wrong. Please try again later.');
                }


            }
        } catch (error: unknown) {
            // @ts-ignore
            if (error.response) {
                // Lỗi từ server (401, 404, 500...)
                // @ts-ignore
                setError(error.response.data.message );
            } else {
                // Lỗi khác, không phải ApiError
                setError('Something went wrong. Please try again later.');
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
                            Create an account
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="text"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                <input type="text" name="firstName" id="firstName"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="First Name"
                                       required={true}
                                       onChange={(e) => setUser({...user, firstName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="text"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                <input type="text" name="lastName" id="lastName"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Last Name"
                                       required={true}
                                       onChange={(e) => setUser({...user, lastName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                    email</label>
                                <input type="email" name="email" id="email"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="name@company.com"
                                       required={true}
                                       onChange={(e) => setUser({...user, email: e.target.value})}
                                />
                            </div>

                            <div>
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       required={true}
                                       onChange={(e) => setUser({...user, password: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm-password"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm
                                    password</label>
                                <input type="confirm-password" name="confirm-password" id="confirm-password"
                                       placeholder="••••••••"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       required={true}
                                       onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" aria-describedby="terms" type="checkbox"
                                           className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                           required={true}/>
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I
                                        accept the <a
                                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                            href="#">Terms and Conditions</a></label>
                                </div>
                            </div>

                            <p className="text-center text-red-500">{error}</p>

                            <button type="submit"
                                    onClick={onSignUp}
                                    className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Create an account
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <a href="/login"
                                                            className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login
                                here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignUp;
