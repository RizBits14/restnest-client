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

    const isUpdating =
        updateStatusMutation.isPending;

    const isDeleting =
        deletePropertyMutation.isPending;

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

    return (
        <div className="space-y-3 border-t border-border pt-5">
            <div className="grid gap-2 sm:grid-cols-2">
                <Link
                    href={`/dashboard/landlord/properties/${property.id}/edit`}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                >
                    <Pencil
                        aria-hidden="true"
                        className="size-4"
                    />

                    Edit property
                </Link>

                {nextAvailabilityStatus ? (
                    <button
                        type="button"
                        onClick={handleAvailabilityChange}
                        disabled={isUpdating || isDeleting}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand disabled:cursor-wait disabled:opacity-60"
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
                                className="size-4 text-success"
                            />
                        ) : (
                            <CircleOff
                                aria-hidden="true"
                                className="size-4 text-muted-foreground"
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
                    <div className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-muted px-4 text-center text-xs font-semibold leading-5 text-muted-foreground">
                        <LockKeyhole
                            aria-hidden="true"
                            className="size-4 shrink-0"
                        />

                        Availability managed by rental
                    </div>
                )}
            </div>

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
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-danger/25 bg-background px-4 text-sm font-bold text-danger transition-colors duration-200 hover:border-danger/40 hover:bg-danger-soft disabled:cursor-wait disabled:opacity-60"
                >
                    <Trash2
                        aria-hidden="true"
                        className="size-4"
                    />

                    Delete property
                </Dialog.Trigger>

                <Portal>
                    <Dialog.Backdrop className="fixed inset-0 z-[80] bg-overlay backdrop-blur-sm" />

                    <Dialog.Positioner className="fixed inset-0 z-[81] grid place-items-center overflow-y-auto p-4">
                        <Dialog.Content className="w-full max-w-md overflow-hidden rounded-[2rem] border border-border bg-surface shadow-raised">
                            <div className="border-b border-border bg-danger-soft p-6 sm:p-7">
                                <div className="flex items-start justify-between gap-5">
                                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-danger text-danger-foreground">
                                        <TriangleAlert
                                            aria-hidden="true"
                                            className="size-6"
                                        />
                                    </span>

                                    <Dialog.CloseTrigger
                                        disabled={isDeleting}
                                        aria-label="Close delete confirmation"
                                        className="grid size-10 place-items-center rounded-xl border border-danger/15 bg-surface text-muted-foreground transition-colors duration-200 hover:text-danger disabled:cursor-wait disabled:opacity-60"
                                    >
                                        <X
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </Dialog.CloseTrigger>
                                </div>

                                <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-danger">
                                    Permanent action
                                </p>

                                <Dialog.Title className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                                    Delete this property?
                                </Dialog.Title>
                            </div>

                            <div className="p-6 sm:p-7">
                                <Dialog.Description className="text-sm leading-7 text-muted-foreground">
                                    <strong className="font-bold text-foreground">
                                        {property.title}
                                    </strong>{" "}
                                    will be permanently removed from your
                                    dashboard and the public RESTNEST
                                    marketplace.
                                </Dialog.Description>

                                <div className="mt-5 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3">
                                    <p className="text-sm font-bold text-danger">
                                        This action cannot be undone.
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                        Confirm that this listing is no longer
                                        required before deleting it.
                                    </p>
                                </div>

                                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <Dialog.CloseTrigger
                                        disabled={isDeleting}
                                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:bg-surface-muted disabled:cursor-wait disabled:opacity-60"
                                    >
                                        Keep property
                                    </Dialog.CloseTrigger>

                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-danger px-5 text-sm font-bold text-danger-foreground transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
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

                                                Delete permanently
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </div>
    );
}