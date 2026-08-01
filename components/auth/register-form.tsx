"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowRight,
    Building2,
    Check,
    CircleAlert,
    Eye,
    EyeOff,
    Home,
    LoaderCircle,
    LockKeyhole,
    Mail,
    Phone,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    useForm,
    useWatch,
} from "react-hook-form";

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

const inputClassName =
    "h-12 w-full rounded-xl border border-border bg-background text-sm text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10 disabled:cursor-wait disabled:opacity-60";

const errorInputClassName =
    "border-danger focus:border-danger focus:ring-danger/10";

export function RegisterForm() {
    const router = useRouter();

    const [showPassword, setShowPassword] =
        useState(false);
    const [showConfirmation, setShowConfirmation] =
        useState(false);

    const {
        control,
        register,
        handleSubmit,
        setError,
        clearErrors,
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

    async function onSubmit(
        values: RegisterFormValues,
    ) {
        clearErrors("root");

        try {
            const response = await fetch(
                "/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                },
            );

            const result =
                (await response.json()) as RegisterResponse;

            if (
                !response.ok ||
                !result.success ||
                !result.data?.user
            ) {
                const message =
                    result.message ||
                    "Unable to create your account. Please review your information and try again.";

                setError("root", {
                    type: "server",
                    message,
                });

                toaster.error({
                    title: "Registration failed",
                    description: message,
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

    function getRoleCardClass(
        role: RegisterFormValues["role"],
    ) {
        const isSelected = selectedRole === role;

        return [
            "relative cursor-pointer rounded-2xl border p-4 transition-[border-color,background-color,box-shadow] duration-200",
            "focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-surface",
            isSelected
                ? "border-brand/45 bg-brand-soft shadow-soft"
                : "border-border bg-background hover:border-border-strong hover:bg-surface-subtle",
        ].join(" ");
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
                        <UserRound
                            aria-hidden="true"
                            className="size-5"
                        />
                    </span>

                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                            Join RESTNEST
                        </p>

                        <h1 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl">
                            Create your account
                        </h1>
                    </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Choose your role and enter your information to
                    begin using your RESTNEST workspace.
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

                <div className="space-y-6">
                    <fieldset>
                        <legend className="mb-3 text-sm font-bold text-foreground">
                            I want to use RESTNEST as a
                        </legend>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <label
                                className={getRoleCardClass(
                                    "TENANT",
                                )}
                            >
                                <input
                                    type="radio"
                                    value="TENANT"
                                    disabled={isSubmitting}
                                    {...register("role")}
                                    className="sr-only"
                                />

                                <span className="flex items-start gap-3">
                                    <span
                                        className={[
                                            "grid size-11 shrink-0 place-items-center rounded-xl transition-colors duration-200",
                                            selectedRole === "TENANT"
                                                ? "bg-brand text-brand-foreground"
                                                : "bg-surface-muted text-brand",
                                        ].join(" ")}
                                    >
                                        <Home
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-bold text-foreground">
                                                Tenant
                                            </span>

                                            {selectedRole === "TENANT" && (
                                                <span
                                                    aria-hidden="true"
                                                    className="grid size-6 place-items-center rounded-full bg-brand text-brand-foreground"
                                                >
                                                    <Check className="size-3.5" />
                                                </span>
                                            )}
                                        </span>

                                        <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">
                                            Browse properties, submit requests,
                                            make payments, and leave reviews.
                                        </span>
                                    </span>
                                </span>
                            </label>

                            <label
                                className={getRoleCardClass(
                                    "LANDLORD",
                                )}
                            >
                                <input
                                    type="radio"
                                    value="LANDLORD"
                                    disabled={isSubmitting}
                                    {...register("role")}
                                    className="sr-only"
                                />

                                <span className="flex items-start gap-3">
                                    <span
                                        className={[
                                            "grid size-11 shrink-0 place-items-center rounded-xl transition-colors duration-200",
                                            selectedRole === "LANDLORD"
                                                ? "bg-brand text-brand-foreground"
                                                : "bg-surface-muted text-brand",
                                        ].join(" ")}
                                    >
                                        <Building2
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-bold text-foreground">
                                                Landlord
                                            </span>

                                            {selectedRole ===
                                                "LANDLORD" && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="grid size-6 place-items-center rounded-full bg-brand text-brand-foreground"
                                                    >
                                                        <Check className="size-3.5" />
                                                    </span>
                                                )}
                                        </span>

                                        <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">
                                            Publish properties and manage
                                            incoming rental requests.
                                        </span>
                                    </span>
                                </span>
                            </label>
                        </div>

                        {errors.role && (
                            <p
                                role="alert"
                                className="mt-2 text-sm font-medium text-danger"
                            >
                                {errors.role.message}
                            </p>
                        )}
                    </fieldset>

                    <div>
                        <label
                            htmlFor="register-name"
                            className="mb-2 block text-sm font-bold text-foreground"
                        >
                            Full name
                        </label>

                        <div className="relative">
                            <UserRound
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent"
                            />

                            <input
                                id="register-name"
                                type="text"
                                autoComplete="name"
                                placeholder="Your full name"
                                disabled={isSubmitting}
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={
                                    errors.name
                                        ? "register-name-error"
                                        : undefined
                                }
                                {...register("name")}
                                className={[
                                    inputClassName,
                                    "pl-10 pr-4",
                                    errors.name
                                        ? errorInputClassName
                                        : "",
                                ].join(" ")}
                            />
                        </div>

                        {errors.name && (
                            <p
                                id="register-name-error"
                                role="alert"
                                className="mt-2 text-sm font-medium text-danger"
                            >
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="register-email"
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
                                    id="register-email"
                                    type="email"
                                    autoComplete="email"
                                    inputMode="email"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    placeholder="you@example.com"
                                    disabled={isSubmitting}
                                    aria-invalid={Boolean(
                                        errors.email,
                                    )}
                                    aria-describedby={
                                        errors.email
                                            ? "register-email-error"
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
                                    id="register-email-error"
                                    role="alert"
                                    className="mt-2 text-sm font-medium text-danger"
                                >
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label
                                    htmlFor="register-phone"
                                    className="text-sm font-bold text-foreground"
                                >
                                    Phone number
                                </label>

                                <span className="text-xs font-medium text-muted-foreground">
                                    Optional
                                </span>
                            </div>

                            <div className="relative">
                                <Phone
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent"
                                />

                                <input
                                    id="register-phone"
                                    type="tel"
                                    autoComplete="tel"
                                    inputMode="tel"
                                    placeholder="+880 1XXX XXXXXX"
                                    disabled={isSubmitting}
                                    aria-invalid={Boolean(
                                        errors.phone,
                                    )}
                                    aria-describedby={
                                        errors.phone
                                            ? "register-phone-error"
                                            : undefined
                                    }
                                    {...register("phone")}
                                    className={[
                                        inputClassName,
                                        "pl-10 pr-4",
                                        errors.phone
                                            ? errorInputClassName
                                            : "",
                                    ].join(" ")}
                                />
                            </div>

                            {errors.phone && (
                                <p
                                    id="register-phone-error"
                                    role="alert"
                                    className="mt-2 text-sm font-medium text-danger"
                                >
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="register-password"
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
                                    id="register-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    placeholder="At least 6 characters"
                                    disabled={isSubmitting}
                                    aria-invalid={Boolean(
                                        errors.password,
                                    )}
                                    aria-describedby={
                                        errors.password
                                            ? "register-password-error"
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
                                    onClick={() =>
                                        setShowPassword(
                                            (currentValue) =>
                                                !currentValue,
                                        )
                                    }
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
                                    id="register-password-error"
                                    role="alert"
                                    className="mt-2 text-sm font-medium text-danger"
                                >
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="register-confirm-password"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Confirm password
                            </label>

                            <div className="relative">
                                <LockKeyhole
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent"
                                />

                                <input
                                    id="register-confirm-password"
                                    type={
                                        showConfirmation
                                            ? "text"
                                            : "password"
                                    }
                                    autoComplete="new-password"
                                    placeholder="Repeat your password"
                                    disabled={isSubmitting}
                                    aria-invalid={Boolean(
                                        errors.confirmPassword,
                                    )}
                                    aria-describedby={
                                        errors.confirmPassword
                                            ? "register-confirm-password-error"
                                            : undefined
                                    }
                                    {...register(
                                        "confirmPassword",
                                    )}
                                    className={[
                                        inputClassName,
                                        "pl-10 pr-12",
                                        errors.confirmPassword
                                            ? errorInputClassName
                                            : "",
                                    ].join(" ")}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmation(
                                            (currentValue) =>
                                                !currentValue,
                                        )
                                    }
                                    disabled={isSubmitting}
                                    aria-label={
                                        showConfirmation
                                            ? "Hide password confirmation"
                                            : "Show password confirmation"
                                    }
                                    title={
                                        showConfirmation
                                            ? "Hide password confirmation"
                                            : "Show password confirmation"
                                    }
                                    className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-surface-muted hover:text-foreground disabled:cursor-wait disabled:opacity-60"
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
                                <p
                                    id="register-confirm-password-error"
                                    role="alert"
                                    className="mt-2 text-sm font-medium text-danger"
                                >
                                    {
                                        errors.confirmPassword
                                            .message
                                    }
                                </p>
                            )}
                        </div>
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

                <div className="mt-5 flex items-start gap-3 rounded-xl bg-success-soft px-4 py-3">
                    <ShieldCheck
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-success"
                    />

                    <p className="text-xs leading-5 text-muted-foreground">
                        RESTNEST creates tenant and landlord accounts
                        only. Administrative accounts are managed
                        separately.
                    </p>
                </div>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="font-bold text-brand underline-offset-4 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </form>
    );
}