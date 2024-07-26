'use client'
import {Card, message} from "antd";
import LogoIcon from "@/components/LogoIcon";
import {passwordReset, verifyReset} from "@/data/usersData";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Field, Fieldset, Input, Label} from "@headlessui/react";


export default function Page(){
    const inputCls = 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6';
    const router = useRouter();
    const searchParams = useSearchParams();
    const oobCode = searchParams.get('oobCode');// the code from the email link
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (oobCode) {
            verifyReset(oobCode as string)
                .then((email) => {
                    setEmail(email);
                })
                .catch((error) => {
                    setError("Invalid or expired password reset code.");
                });
        }
    }, [oobCode]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
       if (password !== confirmPassword) {
           message.error('Passwords do not match');
       } else {
           if (oobCode && password) {
               try {
                   await passwordReset(oobCode as string, password);
                   message.success("Password reset successfully");
                   router.push('/login'); // redirect to login after successful reset
               } catch (error) {
                   message.error("Failed to reset password. Please try again.");
               }
           }
       }
    };

    return <div className={'h-screen w-screen flex items-center justify-center bg-primary-50'}>
        <Card className={'text-center md:w-1/3 rounded-xl flex flex-col justify-center px-6 py-12 lg:px-8'}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <LogoIcon className="mx-auto h-20 w-auto"/>
                <div className={'text-3xl'}>LexStayz</div>
                <h2 className="mt-12 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Reset Password
                </h2>
                <Fieldset onSubmit={handleSubmit}>
                    <Field>
                        <Label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </Label>

                        <Input
                            className={inputCls}
                            type="password" id="password"
                            placeholder="Enter password" required value={password} invalid={password !== confirmPassword}
                            onChange={(e) => setPassword(e.target.value)}/>
                    </Field>
                    <Field>
                        <Label className={'block text-sm font-medium leading-6 text-gray-900'}
                               htmlFor="password_confirmation">Confirm Password</Label>
                        <Input className={inputCls} type="password" id="password_confirmation"
                               placeholder="Confirm Password" required value={confirmPassword} invalid={password !== confirmPassword}
                               onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </Field>
                    <button type="submit">Reset Password</button>
                </Fieldset>
            </div>
        </Card>
    </div>
}