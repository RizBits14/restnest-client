"use client";

import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import {
    CircleCheck,
    CircleOff,
    LoaderCircle,
    LockKeyhole,
    Pencil,
    Trash2,
    TriangleAlert,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { toaster } from "@/components/ui/app-toaster";
import {
    deleteLandlordProperty,
    landlordPropertiesQueryKey,
    updateLandlordProperty,
} from "@/lib/api/landlord-properties-client";
import type {
    LandlordProperty,
    PropertyStatus,
} from "@/types/property";

type PropertyCardActionsProps = Readonly<{
    property: LandlordProperty;
}>;

const statusLabels: Record<PropertyStatus, string> = {
    AVAILABLE: "available",
    RENTED: "rented",
    UNAVAILABLE: "unavailable",
};

export function PropertyCardActions({
    property,
}: PropertyCardActionsProps) {
    const queryClient = useQueryClient();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
        useState(false);

    const nextAvailabilityStatus =
        property.status === "AVAILABLE"
            ? "UNAVAILABLE"
            : property.status === "UNAVAILABLE"
                ? "AVAILABLE"
                : null;

    const updateStatusMutation = useMutation({
        mutationFn: (status: PropertyStatus) =>
            updateLandlordProperty(property.id, {
                status,
            }),

        onMutate: async (status) => {
            await queryClient.cancelQueries({
                queryKey: landlordPropertiesQueryKey,
            });

            const previousProperties =
                queryClient.getQueryData<LandlordProperty[]>(
                    landlordPropertiesQueryKey,
                );

            queryClient.setQueryData<LandlordProperty[]>(
                landlordPropertiesQueryKey,
                (currentProperties = []) =>
                    currentProperties.map((currentProperty) =>
                        currentProperty.id === property.id
                            ? {
                                ...currentProperty,
                                status,
                            }
                            : currentProperty,
                    ),
            );

            return {
                previousProperties,
            };
        },

        onError: (error, _status, context) => {
            if (context?.previousProperties) {
                queryClient.setQueryData(
                    landlordPropertiesQueryKey,
                    context.previousProperties,
                );
            }

            toaster.error({
                title: "Availability update failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "The property availability could not be updated.",
            });
        },

        onSuccess: (updatedProperty) => {
            toaster.success({
                title: "Availability updated",
                description: `${updatedProperty.title} is now ${statusLabels[updatedProperty.status]
                    }.`,
            });
        },

        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: landlordPropertiesQueryKey,
                }),
                queryClient.invalidateQueries({
                    queryKey: ["properties"],
                }),
            ]);
        },
    });

    const deletePropertyMutation = useMutation({
        mutationFn: () =>
            deleteLandlordProperty(property.id),

        onMutate: async () => {
            await queryClient.cancelQueries({
                queryKey: landlordPropertiesQueryKey,
            });

            const previousProperties =
                queryClient.getQueryData<LandlordProperty[]>(
                    landlordPropertiesQueryKey,
                );

            queryClient.setQueryData<LandlordProperty[]>(
                landlordPropertiesQueryKey,
                (currentProperties = []) =>
                    currentProperties.filter(
                        (currentProperty) =>
                            currentProperty.id !== property.id,
                    ),
            );

            return {
                previousProperties,
            };
        },

        onError: (error, _variables, context) => {
            if (context?.previousProperties) {
                queryClient.setQueryData(
                    landlordPropertiesQueryKey,
                    context.previousProperties,
                );
            }

            toaster.error({
                title: "Property deletion failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "The property could not be deleted.",
            });
        },

        onSuccess: () => {
            setIsDeleteDialogOpen(false);

            toaster.success({
                title: "Property deleted",
                description: `${property.title} was removed from RESTNEST.`,
            });
        },

        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: landlordPropertiesQueryKey,
                }),
                queryClient.invalidateQueries({
                    queryKey: ["properties"],
                }),
            ]);
        },
    });

    function handleAvailabilityChange() {
        if (!nextAvailabilityStatus) {
            return;
        }

        updateStatusMutation.mutate(
            nextAvailabilityStatus,
        );
    }

    function handleDelete() {
        deletePropertyMutation.mutate();
    }

    const isUpdating =
        updateStatusMutation.isPending;

    const isDeleting =
        deletePropertyMutation.isPending;

    return (
        <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
            <Link
                href={`/dashboard/landlord/properties/${property.id}/edit`}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
            >
                <Pencil
                    aria-hidden="true"
                    className="size-4 text-brand"
                />
                Edit
            </Link>
            {nextAvailabilityStatus ? (
                <button
                    type="button"
                    onClick={handleAvailabilityChange}
                    disabled={isUpdating || isDeleting}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted disabled:cursor-wait disabled:opacity-60"
                >
                    {isUpdating ? (
                        <LoaderCircle
                            aria-hidden="true"
                            className="size-4 animate-spin"
                        />
                    ) : nextAvailabilityStatus ===
                        "AVAILABLE" ? (
                        <CircleCheck
                            aria-hidden="true"
                            className="size-4 text-brand"
                        />
                    ) : (
                        <CircleOff
                            aria-hidden="true"
                            className="size-4 text-brand"
                        />
                    )}

                    {isUpdating
                        ? "Updating..."
                        : nextAvailabilityStatus ===
                            "AVAILABLE"
                            ? "Make available"
                            : "Mark unavailable"}
                </button>
            ) : (
                <div className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface-muted px-4 text-sm font-medium text-muted-foreground">
                    <LockKeyhole
                        aria-hidden="true"
                        className="size-4"
                    />
                    Availability managed by rental
                </div>
            )}

            <Dialog.Root
                role="alertdialog"
                open={isDeleteDialogOpen}
                onOpenChange={(details) =>
                    setIsDeleteDialogOpen(details.open)
                }
                closeOnInteractOutside={false}
                lazyMount
                unmountOnExit
            >
                <Dialog.Trigger
                    disabled={isUpdating || isDeleting}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-700/30 bg-surface px-4 text-sm font-semibold text-red-700 shadow-sm transition-colors hover:border-red-700/50 hover:bg-red-50 hover:text-red-800 disabled:cursor-wait disabled:opacity-60 dark:border-red-400/30 dark:bg-surface dark:text-red-6600 dark:hover:border-red-400/50 dark:hover:bg-red-950/40 dark:hover:text-red-6600"
                >
                    <Trash2
                        aria-hidden="true"
                        className="size-4"
                    />
                    Delete
                </Dialog.Trigger>

                <Portal>
                    <Dialog.Backdrop className="fixed inset-0 z-[80] bg-foreground/25 backdrop-blur-sm" />

                    <Dialog.Positioner className="fixed inset-0 z-[81] grid place-items-center overflow-y-auto p-4">
                        <Dialog.Content className="w-full max-w-md rounded-[1.75rem] border border-border bg-surface p-6 shadow-[0_24px_80px_rgba(20,30,24,0.24)] sm:p-7">
                            <div className="flex items-start justify-between gap-4">
                                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200">
                                    <TriangleAlert
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>

                                <Dialog.CloseTrigger
                                    disabled={isDeleting}
                                    aria-label="Close delete confirmation"
                                    className="grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground disabled:cursor-wait disabled:opacity-60"
                                >
                                    <X
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </Dialog.CloseTrigger>
                            </div>

                            <Dialog.Title className="mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground">
                                Delete this property?
                            </Dialog.Title>

                            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    {property.title}
                                </span>{" "}
                                will be permanently removed. This action
                                cannot be undone.
                            </Dialog.Description>

                            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Dialog.CloseTrigger
                                    disabled={isDeleting}
                                    className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted disabled:cursor-wait disabled:opacity-60"
                                >
                                    Cancel
                                </Dialog.CloseTrigger>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-700 px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60 dark:bg-red-600"
                                >
                                    {isDeleting ? (
                                        <>
                                            <LoaderCircle
                                                aria-hidden="true"
                                                className="size-4 animate-spin"
                                            />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                            Delete property
                                        </>
                                    )}
                                </button>
                            </div>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </div>
    );
}