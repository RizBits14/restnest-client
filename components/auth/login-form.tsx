"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
    ArrowRight,
    CircleAlert,
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { toaster } from "@/components/ui/app-toaster";
import {
    sessionQueryKey,
} from "@/hooks/use-session";
import { getDashboardPath } from "@/lib/auth/get-dashboard-path";
import {
    loginSchema,
    type LoginFormValues,
} from "@/lib/validation/auth-schema";
import type { AuthUser } from "@/types/auth";

type LoginResponse = {
    success: boolean;
    message: string;
    data?: {
        user: AuthUser;
    };
};

const defaultValues: LoginFormValues = {
    email: "",
    password: "",
};

const inputClassName =
    "h-12 w-full rounded-xl border border-border bg-background text-sm text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10 disabled:cursor-wait disabled:opacity-60";

const errorInputClassName =
    "border-danger focus:border-danger focus:ring-danger/10";

export function LoginForm() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues,
    });

    async function onSubmit(values: LoginFormValues) {
        clearErrors("root");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const result =
                (await response.json()) as LoginResponse;

            if (
                !response.ok ||
                !result.success ||
                !result.data?.user
            ) {
                const message =
                    result.message ||
                    "Unable to sign in. Please check your details and try again.";

                setError("root", {
                    type: "server",
                    message,
                });

                toaster.error({
                    title: "Sign in failed",
                    description: message,
                });

                return;
            }

            queryClient.clear();

            queryClient.setQueryData(
                sessionQueryKey,
                result.data.user,
            );

            toaster.success({
                title: "Signed in successfully",
                description: "Welcome back to RESTNEST.",
            });

            await new Promise((resolve) => {
                window.setTimeout(resolve, 650);
            });

            router.replace(
                getDashboardPath(result.data.user.role),
            );

            router.refresh();
        } catch {
            const message =
                "Unable to connect to RESTNEST. Check your connection and try again.";

            setError("root", {
                type: "network",
                message,
            });

            toaster.error({
                title: "Connection failed",
                description: message,
            });
        }
    }

    function togglePasswordVisibility() {
        setShowPassword((currentValue) => !currentValue);
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="overflow-hidden rounded-[2rem] border border-border bg-surface shadow-raised"
        >
            <div className="border-b border-border bg-surface-subtle p-6 sm:p-8">
                <div className="flex items-start gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                        <LockKeyhole
                            aria-hidden="true"
                            className="size-5"
                        />
                    </span>

                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                            Account access
                        </p>

                        <h2 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl">
                            Sign in to RESTNEST
                        </h2>
                    </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Enter your account details to continue to your
                    role-specific workspace.
                </p>
            </div>

            <div className="p-6 sm:p-8">
                {errors.root && (
                    <div
                        role="alert"
                        className="mb-6 flex items-start gap-3 rounded-xl border border-danger/20 bg-danger-soft px-4 py-4 text-sm leading-6 text-danger"
                    >
                        <CircleAlert
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0"
                        />

                        <p>{errors.root.message}</p>
                    </div>
                )}

                <div className="space-y-5">
                    <div>
                        <label
                            htmlFor="login-email"
                            className="mb-2 block text-sm font-bold text-foreground"
                        >
                            Email address
                        </label>

                        <div className="relative">
                            <Mail
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent"
                            />

                            <input
                                id="login-email"
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                autoCapitalize="none"
                                spellCheck={false}
                                placeholder="you@example.com"
                                disabled={isSubmitting}
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={
                                    errors.email
                                        ? "login-email-error"
                                        : undefined
                                }
                                {...register("email")}
                                className={[
                                    inputClassName,
                                    "pl-10 pr-4",
                                    errors.email
                                        ? errorInputClassName
                                        : "",
                                ].join(" ")}
                            />
                        </div>

                        {errors.email && (
                            <p
                                id="login-email-error"
                                role="alert"
                                className="mt-2 text-sm font-medium text-danger"
                            >
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="login-password"
                            className="mb-2 block text-sm font-bold text-foreground"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <LockKeyhole
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent"
                            />

                            <input
                                id="login-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                disabled={isSubmitting}
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={
                                    errors.password
                                        ? "login-password-error"
                                        : undefined
                                }
                                {...register("password")}
                                className={[
                                    inputClassName,
                                    "pl-10 pr-12",
                                    errors.password
                                        ? errorInputClassName
                                        : "",
                                ].join(" ")}
                            />

                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                disabled={isSubmitting}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                title={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-surface-muted hover:text-foreground disabled:cursor-wait disabled:opacity-60"
                            >
                                {showPassword ? (
                                    <EyeOff
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                ) : (
                                    <Eye
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p
                                id="login-password-error"
                                role="alert"
                                className="mt-2 text-sm font-medium text-danger"
                            >
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                >
                    {isSubmitting ? (
                        <>
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                            Signing in...
                        </>
                    ) : (
                        <>
                            Sign in

                            <ArrowRight
                                aria-hidden="true"
                                className="size-4"
                            />
                        </>
                    )}
                </button>

                <div className="mt-5 flex items-start gap-3 rounded-xl bg-success-soft px-4 py-3">
                    <ShieldCheck
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-success"
                    />

                    <p className="text-xs leading-5 text-muted-foreground">
                        Your account role determines which protected
                        dashboard and management tools you can access.
                    </p>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    New to RESTNEST?{" "}
                    <Link
                        href="/auth/register"
                        className="font-bold text-brand underline-offset-4 hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </form>
    );
}