"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/app-toaster";

import { getDashboardPath } from "@/lib/auth/get-dashboard-path";
import {
    loginSchema,
    type LoginFormValues,
} from "@/lib/validation/auth-schema";
import type { AuthUser } from "@/types/auth";
import { useQueryClient } from "@tanstack/react-query";
import { sessionQueryKey } from "@/hooks/use-session";

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

            const result = (await response.json()) as LoginResponse;

            if (!response.ok || !result.success || !result.data?.user) {
                setError("root", {
                    type: "server",
                    message:
                        result.message ||
                        "Unable to sign in. Please try again.",
                });

                return;
            }

            queryClient.setQueryData(
                sessionQueryKey,
                result.data.user,
            );

            toaster.success({
                title: "Signed in successfully",
                description: "Welcome back to RESTNEST.",
            });

            router.replace(
                getDashboardPath(result.data.user.role),
            );

            router.refresh();
        } catch {
            setError("root", {
                type: "network",
                message:
                    "Unable to connect to RESTNEST. Check your connection and try again.",
            });
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_24px_70px_rgba(25,35,29,0.1)] sm:p-8"
            noValidate
        >
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                    Welcome back
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">
                    Sign in to RESTNEST
                </h1>

                <p className="mt-3 leading-7 text-muted-foreground">
                    Access your rental requests, listings, payments, or platform
                    management tools.
                </p>
            </div>

            {errors.root && (
                <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"
                >
                    {errors.root.message}
                </div>
            )}

            <div className="mt-7 space-y-5">
                <div>
                    <label
                        htmlFor="login-email"
                        className="mb-2 block text-sm font-medium text-foreground"
                    >
                        Email address
                    </label>

                    <div className="relative">
                        <Mail
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            aria-invalid={Boolean(errors.email)}
                            {...register("email")}
                            className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                        />
                    </div>

                    {errors.email && (
                        <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="login-password"
                        className="mb-2 block text-sm font-medium text-foreground"
                    >
                        Password
                    </label>

                    <div className="relative">
                        <LockKeyhole
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            aria-invalid={Boolean(errors.password)}
                            {...register("password")}
                            className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((currentValue) => !currentValue)
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                        >
                            {showPassword ? (
                                <EyeOff aria-hidden="true" className="size-4" />
                            ) : (
                                <Eye aria-hidden="true" className="size-4" />
                            )}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                            {errors.password.message}
                        </p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
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
                        <ArrowRight aria-hidden="true" className="size-4" />
                    </>
                )}
            </button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                New to RESTNEST?{" "}
                <Link
                    href="/auth/register"
                    className="font-semibold text-brand hover:underline"
                >
                    Create an account
                </Link>
            </p>
        </form>
    );
}