import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email address is required.")
        .email("Enter a valid email address."),

    password: z
        .string()
        .min(1, "Password is required."),
});

export const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must contain at least 2 characters.")
            .max(80, "Name must contain 80 characters or fewer."),

        email: z
            .string()
            .trim()
            .min(1, "Email address is required.")
            .email("Enter a valid email address."),

        phone: z
            .string()
            .trim()
            .max(30, "Phone number must contain 30 characters or fewer."),

        role: z.enum(["TENANT", "LANDLORD"], {
            message: "Choose whether you are a tenant or landlord.",
        }),

        password: z
            .string()
            .min(6, "Password must contain at least 6 characters.")
            .max(72, "Password must contain 72 characters or fewer."),

        confirmPassword: z
            .string()
            .min(1, "Confirm your password."),
    })
    .refine(
        (values) => values.password === values.confirmPassword,
        {
            message: "Passwords do not match.",
            path: ["confirmPassword"],
        },
    );

export type LoginFormValues = z.infer<
    typeof loginSchema
>;

export type RegisterFormValues = z.infer<
    typeof registerSchema
>;