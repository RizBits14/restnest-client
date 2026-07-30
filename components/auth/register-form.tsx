"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowRight,
    Building2,
    Eye,
    EyeOff,
    Home,
    LoaderCircle,
    LockKeyhole,
    Mail,
    Phone,
    UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { toaster } from "@/components/ui/app-toaster";
import {
    registerSchema,
    type RegisterFormValues,
} from "@/lib/validation/auth-schema";
import type { AuthUser } from "@/types/auth";

type RegisterResponse = {
    success: boolean;
    message: string;
    data?: {
        user: AuthUser;
    };
};

const defaultValues: RegisterFormValues = {
    name: "",
    email: "",
    phone: "",
    role: "TENANT",
    password: "",
    confirmPassword: "",
};

export function RegisterForm() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] =
        useState(false);

    const {
        control,
        register,
        handleSubmit,
        setError,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues,
    });

    const selectedRole = useWatch({
        control,
        name: "role",
        defaultValue: "TENANT",
    });

    async function onSubmit(values: RegisterFormValues) {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const result =
                (await response.json()) as RegisterResponse;

            if (
                !response.ok ||
                !result.success ||
                !result.data?.user
            ) {
                setError("root", {
                    type: "server",
                    message:
                        result.message ||
                        "Unable to create your account. Please try again.",
                });

                return;
            }

            toaster.success({
                title: "Account created",
                description:
                    "Your RESTNEST account is ready. You can now sign in.",
            });

            router.replace("/auth/login");
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
            noValidate
            className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_24px_70px_rgba(25,35,29,0.1)] sm:p-8"
        >
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                    Join RESTNEST
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">
                    Create your account
                </h1>

                <p className="mt-3 leading-7 text-muted-foreground">
                    Choose your role and enter your details to begin.
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
                <fieldset>
                    <legend className="mb-2 block text-sm font-medium text-foreground">
                        I want to use RESTNEST as a
                    </legend>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <label
                            className={
                                selectedRole === "TENANT"
                                    ? "cursor-pointer rounded-2xl border border-brand bg-surface-muted p-4"
                                    : "cursor-pointer rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-surface-muted"
                            }
                        >
                            <input
                                type="radio"
                                value="TENANT"
                                {...register("role")}
                                className="sr-only"
                            />

                            <span className="flex items-start gap-3">
                                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-brand">
                                    <Home
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>

                                <span>
                                    <span className="block text-sm font-semibold text-foreground">
                                        Tenant
                                    </span>

                                    <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                                        Browse properties and submit rental requests.
                                    </span>
                                </span>
                            </span>
                        </label>

                        <label
                            className={
                                selectedRole === "LANDLORD"
                                    ? "cursor-pointer rounded-2xl border border-brand bg-surface-muted p-4"
                                    : "cursor-pointer rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-surface-muted"
                            }
                        >
                            <input
                                type="radio"
                                value="LANDLORD"
                                {...register("role")}
                                className="sr-only"
                            />

                            <span className="flex items-start gap-3">
                                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface text-brand">
                                    <Building2
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>

                                <span>
                                    <span className="block text-sm font-semibold text-foreground">
                                        Landlord
                                    </span>

                                    <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                                        Publish properties and manage rental requests.
                                    </span>
                                </span>
                            </span>
                        </label>
                    </div>

                    {errors.role && (
                        <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                            {errors.role.message}
                        </p>
                    )}
                </fieldset>

                <div>
                    <label
                        htmlFor="register-name"
                        className="mb-2 block text-sm font-medium text-foreground"
                    >
                        Full name
                    </label>

                    <div className="relative">
                        <UserRound
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            id="register-name"
                            type="text"
                            autoComplete="name"
                            placeholder="Your full name"
                            aria-invalid={Boolean(errors.name)}
                            {...register("name")}
                            className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                        />
                    </div>

                    {errors.name && (
                        <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="register-email"
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
                                id="register-email"
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
                            htmlFor="register-phone"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Phone number{" "}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </label>

                        <div className="relative">
                            <Phone
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                id="register-phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="+1 555 000 0000"
                                aria-invalid={Boolean(errors.phone)}
                                {...register("phone")}
                                className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                            />
                        </div>

                        {errors.phone && (
                            <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="register-password"
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
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="At least 6 characters"
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
                        <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="register-confirm-password"
                        className="mb-2 block text-sm font-medium text-foreground"
                    >
                        Confirm password
                    </label>

                    <div className="relative">
                        <LockKeyhole
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            id="register-confirm-password"
                            type={showConfirmation ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="Repeat your password"
                            aria-invalid={Boolean(errors.confirmPassword)}
                            {...register("confirmPassword")}
                            className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmation(
                                    (currentValue) => !currentValue,
                                )
                            }
                            aria-label={
                                showConfirmation
                                    ? "Hide password confirmation"
                                    : "Show password confirmation"
                            }
                            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                        >
                            {showConfirmation ? (
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

                    {errors.confirmPassword && (
                        <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                            {errors.confirmPassword.message}
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
                        Creating account...
                    </>
                ) : (
                    <>
                        Create account
                        <ArrowRight
                            aria-hidden="true"
                            className="size-4"
                        />
                    </>
                )}
            </button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/auth/login"
                    className="font-semibold text-brand hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </form>
    );
}