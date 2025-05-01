import {Input} from "../components/ui/Input.tsx";
import {Button} from "../components/ui/Button.tsx";
import {useState} from "react";
import {useUserStore} from "../stores/userStore.ts";
import {Text} from "../components/ui/Text.tsx";
import {useForm} from "react-hook-form";
import toastify from "toastify-js";

type FormFields = {
    login: string;
    password: string;
    email?: string;
    fullName?: string;
    isTeacher?: boolean;
};

export const LoginPage = () => {
    const {setUserId} = useUserStore();
    const [isRegistering, setIsRegistering] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormFields>();

    const onSubmit = (data: FormFields) => {
        if (!isRegistering) {
            const URL = import.meta.env.VITE_URL + "login";
            fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    login: data.login,
                    password: data.password,
                }),
            }).then((res) => {
                if(res.status === 200) {
                    res.json().then((data) => setUserId(data.id))
                    toastify({
                            text: "Logged In!",
                            duration: 3000,
                            backgroundColor: '#903FEDFF',
                        }
                    ).showToast();
                } else if(res.status === 401 || res.status === 404) {
                toastify({
                        text: "Invalid Credentials",
                        duration: 3000,
                        backgroundColor: '#ff0000',
                    }
                ).showToast();
                }else{
                    toastify({
                            text: "Something Went Wrong",
                            duration: 3000,
                            backgroundColor: '#ff0000',
                        }
                    ).showToast();
                }
            }
            );
        } else {
            const URL = import.meta.env.VITE_URL + "login/register";
            fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    login: data.login,
                    password: data.password,
                    email: data.email,
                    fullName: data.fullName,
                    isTeacher: data.isTeacher,
                }),
            }).then((res) => {
                if(res.status === 200) {
                    res.json().then((data) => setUserId(data.id))
                    toastify({
                            text: "Created Account!",
                            duration: 3000,
                            backgroundColor: '#903FEDFF',
                        }
                    ).showToast();
                }else{
                    toastify({
                            text: "Something Went Wrong",
                            duration: 3000,
                            backgroundColor: '#ff0000',
                        }
                    ).showToast();
                }
                }
            );
        }
    };

    return (
        <main className="w-full flex flex-col items-center">
            <form
                className="lg:w-100 flex items-center flex-col gap-10 mt-16"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col items-center">
                    <img className="h-40" src="/GradeSyncLogoDark.png" alt=""/>


                    {isRegistering ? (
                        <Text type="h1">Sign in</Text>
                    ) : (
                        <Text type="h1">Log in</Text>
                    )}
                    <Text>
                        Or{" "}
                        <span
                            onClick={() => {
                                setIsRegistering((prevState) => !prevState);
                            }}
                            className="text-purple-400 cursor-pointer font-bold"
                        >
              {isRegistering ? "Log in" : "Create Account"}
                        </span>
                    </Text>
                </div>

                <div className="w-full flex flex-col gap-5">
                    <div className="w-full">
                        <Text type="h4">Login</Text>
                        <Input
                            {...register("login",
                                {
                                    required: "Login is required",
                                    minLength: {
                                        value: 4,
                                        message: "Login must be at least 4 characters"
                                    }
                                })}
                            placeholder="type here..."
                            inputSize="large"
                        />
                        {errors?.login && <Text>{errors.login.message}</Text>}
                    </div>

                    <div className="w-full">
                        <Text type="h4">Password</Text>
                        <Input
                            inputSize="large"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            placeholder="type here..."
                        />
                        {errors?.password && <Text>{errors.password.message}</Text>}
                    </div>

                    {isRegistering && (
                        <>
                            <div className="w-full">
                                <Text type="h4">Email</Text>
                                <Input
                                    inputSize="large"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Please enter a valid email address",
                                        },
                                    })}
                                    placeholder="type here..."
                                />
                                {errors?.email && <Text>{errors.email.message}</Text>}
                            </div>

                            <div className="w-full">
                                <Text type="h4">Full Name</Text>
                                <Input
                                    inputSize="large"
                                    {...register("fullName", {
                                        required: "Full name is required",
                                        validate: (value) => {
                                            if (!value) return false;
                                            const words = value.trim().split(/\s+/);
                                            if (words.length !== 2) {
                                                return "Please enter your first and last name";
                                            }
                                            for (const word of words) {
                                                if (!/^[A-Za-z]+$/.test(word)) {
                                                    return "Full name must contain only letters";
                                                }
                                            }
                                            return true;
                                        },
                                    })}
                                    placeholder="e.g., John Doe"
                                />
                                {errors?.fullName && <Text>{errors.fullName.message}</Text>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input {...register('isTeacher')} className='size-6' type='checkbox'/>
                                <Text type='small'>Make teacher account?</Text>
                            </div>
                        </>
                    )}
                </div>

                <Button variant="important" type="submit">
                    {isRegistering ? "Sign Up" : "Login"}
                </Button>
            </form>
        </main>
    );
};
