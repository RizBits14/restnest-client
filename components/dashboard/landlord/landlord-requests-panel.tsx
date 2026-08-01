"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    Building2,
    CalendarDays,
    Check,
    CircleCheck,
    Clock3,
    LoaderCircle,
    Mail,
    MapPin,
    MessageSquareText,
    Phone,
    RefreshCw,
    UserRound,
    X,
    type LucideIcon,
} from "lucide-react";

import { PropertyImage } from "@/components/properties/property-image";
import { toaster } from "@/components/ui/app-toaster";
import { landlordPropertiesQueryKey } from "@/lib/api/landlord-properties-client";
import {
    getLandlordRequests,
    landlordRequestsQueryKey,
    updateLandlordRequest,
} from "@/lib/api/landlord-requests-client";
import type {
    LandlordRentalRequest,
    RentalDecision,
    RentalStatus,
} from "@/types/rental";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
});

const statusLabels: Record<RentalStatus, string> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    ACTIVE: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

const statusStyles: Record<RentalStatus, string> = {
    PENDING: "bg-warning-soft text-warning",
    APPROVED: "bg-info-soft text-info",
    REJECTED: "bg-danger-soft text-danger",
    ACTIVE: "bg-success-soft text-success",
    COMPLETED: "bg-brand-soft text-brand",
    CANCELLED:
        "bg-surface-muted text-muted-foreground",
};

type SummaryTone =
    | "brand"
    | "warning"
    | "success"
    | "danger";

const summaryToneStyles: Record<
    SummaryTone,
    Readonly<{
        icon: string;
        value: string;
    }>
> = {
    brand: {
        icon: "bg-brand-soft text-brand",
        value: "text-brand",
    },
    warning: {
        icon: "bg-warning-soft text-warning",
        value: "text-warning",
    },
    success: {
        icon: "bg-success-soft text-success",
        value: "text-success",
    },
    danger: {
        icon: "bg-danger-soft text-danger",
        value: "text-danger",
    },
};

type RequestSummaryProps = Readonly<{
    label: string;
    value: number;
    description: string;
    icon: LucideIcon;
    tone: SummaryTone;
}>;

function RequestSummary({
    label,
    value,
    description,
    icon: Icon,
    tone,
}: RequestSummaryProps) {
    const visualStyle = summaryToneStyles[tone];

    return (
        <article className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-soft transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-raised">
            <div className="flex items-start justify-between gap-4">
                <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl ${visualStyle.icon}`}
                >
                    <Icon
                        aria-hidden="true"
                        className="size-5"
                    />
                </span>

                <p
                    className={`text-3xl font-bold tracking-[-0.05em] ${visualStyle.value}`}
                >
                    {value}
                </p>
            </div>

            <h2 className="mt-5 text-sm font-bold text-foreground">
                {label}
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {description}
            </p>
        </article>
    );
}

function RequestCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="overflow-hidden rounded-[1.75rem] border border-border bg-surface"
        >
            <div className="relative aspect-[16/10] animate-pulse bg-surface-muted">
                <div className="absolute left-4 top-4 h-7 w-20 rounded-full bg-surface-elevated/80" />

                <div className="absolute right-4 top-4 h-7 w-24 rounded-full bg-surface-elevated/80" />
            </div>

            <div className="space-y-5 p-5 sm:p-6">
                <div className="flex justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="h-5 w-4/5 animate-pulse rounded-lg bg-surface-muted" />

                        <div className="h-4 w-3/5 animate-pulse rounded-lg bg-surface-muted" />
                    </div>

                    <div className="h-10 w-20 animate-pulse rounded-xl bg-surface-muted" />
                </div>

                <div className="h-32 animate-pulse rounded-xl bg-surface-muted" />

                <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 animate-pulse rounded-xl bg-surface-muted" />

                    <div className="h-20 animate-pulse rounded-xl bg-surface-muted" />
                </div>

                <div className="h-12 animate-pulse rounded-xl bg-surface-muted" />
            </div>
        </div>
    );
}

type RentalRequestCardProps = Readonly<{
    rentalRequest: LandlordRentalRequest;
    pendingRequestId: string | null;
    pendingDecision: RentalDecision | null;
    onDecision: (
        requestId: string,
        status: RentalDecision,
    ) => void;
}>;

function RentalRequestCard({
    rentalRequest,
    pendingRequestId,
    pendingDecision,
    onDecision,
}: RentalRequestCardProps) {
    const primaryImageUrl =
        rentalRequest.property.images.find(
            (imageUrl) => imageUrl.trim(),
        ) ?? null;

    const isCurrentRequestPending =
        pendingRequestId === rentalRequest.id;

    const isAwaitingDecision =
        rentalRequest.status === "PENDING";

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-raised">
            <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                <PropertyImage
                    key={
                        primaryImageUrl ??
                        "property-placeholder"
                    }
                    imageUrl={primaryImageUrl}
                    alt={`Rental property: ${rentalRequest.property.title}`}
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    className="object-cover"
                />

                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
                    <span
                        className={`rounded-full px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] shadow-soft backdrop-blur-sm ${statusStyles[rentalRequest.status]}`}
                    >
                        {statusLabels[rentalRequest.status]}
                    </span>

                    <span className="max-w-[55%] truncate rounded-full bg-surface-elevated/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-soft backdrop-blur-sm">
                        {rentalRequest.property.category.name}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="line-clamp-2 text-lg font-bold leading-6 tracking-[-0.03em] text-foreground">
                            {rentalRequest.property.title}
                        </h2>

                        <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                            <MapPin
                                aria-hidden="true"
                                className="mt-1 size-4 shrink-0 text-accent"
                            />

                            <span className="line-clamp-2">
                                {rentalRequest.property.location}
                            </span>
                        </p>
                    </div>

                    <div className="shrink-0 rounded-xl bg-brand-soft px-3 py-2.5 text-right">
                        <p className="text-base font-bold text-brand">
                            {currencyFormatter.format(
                                rentalRequest.property.price,
                            )}
                        </p>

                        <p className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                            Total
                        </p>
                    </div>
                </div>

                <div className="mt-5 rounded-2xl border border-border bg-surface-subtle p-4">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                            <UserRound
                                aria-hidden="true"
                                className="size-5"
                            />
                        </span>

                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                                Prospective tenant
                            </p>

                            <p className="mt-1 truncate text-sm font-bold text-foreground">
                                {rentalRequest.tenant.name}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2.5 border-t border-border pt-4 text-sm text-muted-foreground">
                        <p className="flex items-start gap-2">
                            <Mail
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0 text-brand"
                            />

                            <span className="break-all">
                                {rentalRequest.tenant.email}
                            </span>
                        </p>

                        {rentalRequest.tenant.phone && (
                            <p className="flex items-center gap-2">
                                <Phone
                                    aria-hidden="true"
                                    className="size-4 shrink-0 text-brand"
                                />

                                <span>
                                    {rentalRequest.tenant.phone}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-surface-subtle p-3.5">
                        <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                            <CalendarDays
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />

                            Move-in
                        </p>

                        <p className="mt-2 text-sm font-bold text-foreground">
                            {dateFormatter.format(
                                new Date(
                                    rentalRequest.moveInDate,
                                ),
                            )}
                        </p>
                    </div>

                    <div className="rounded-xl bg-surface-subtle p-3.5">
                        <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                            <Clock3
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />

                            Duration
                        </p>

                        <p className="mt-2 text-sm font-bold text-foreground">
                            {rentalRequest.duration}{" "}
                            {rentalRequest.duration === 1
                                ? "month"
                                : "months"}
                        </p>
                    </div>
                </div>

                {rentalRequest.message && (
                    <div className="mt-4 rounded-xl border border-border bg-surface-subtle p-4">
                        <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <MessageSquareText
                                aria-hidden="true"
                                className="size-4 text-accent"
                            />

                            Tenant message
                        </p>

                        <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {rentalRequest.message}
                        </p>
                    </div>
                )}

                <p className="mt-4 text-xs text-muted-foreground">
                    Requested on{" "}
                    {dateFormatter.format(
                        new Date(rentalRequest.createdAt),
                    )}
                </p>

                <div className="mt-auto pt-5">
                    {isAwaitingDecision ? (
                        <div className="grid gap-2 border-t border-border pt-5 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() =>
                                    onDecision(
                                        rentalRequest.id,
                                        "APPROVED",
                                    )
                                }
                                disabled={isCurrentRequestPending}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                            >
                                {isCurrentRequestPending &&
                                    pendingDecision === "APPROVED" ? (
                                    <LoaderCircle
                                        aria-hidden="true"
                                        className="size-4 animate-spin"
                                    />
                                ) : (
                                    <Check
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                )}

                                {isCurrentRequestPending &&
                                    pendingDecision === "APPROVED"
                                    ? "Approving..."
                                    : "Approve"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    onDecision(
                                        rentalRequest.id,
                                        "REJECTED",
                                    )
                                }
                                disabled={isCurrentRequestPending}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-danger/25 bg-background px-4 text-sm font-bold text-danger transition-colors duration-200 hover:border-danger/40 hover:bg-danger-soft disabled:cursor-wait disabled:opacity-60"
                            >
                                {isCurrentRequestPending &&
                                    pendingDecision === "REJECTED" ? (
                                    <LoaderCircle
                                        aria-hidden="true"
                                        className="size-4 animate-spin"
                                    />
                                ) : (
                                    <X
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                )}

                                {isCurrentRequestPending &&
                                    pendingDecision === "REJECTED"
                                    ? "Rejecting..."
                                    : "Reject"}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-subtle px-4 py-3">
                            <CircleCheck
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0 text-brand"
                            />

                            <p className="text-xs leading-5 text-muted-foreground">
                                This request is currently marked as{" "}
                                <strong className="font-bold text-foreground">
                                    {statusLabels[
                                        rentalRequest.status
                                    ].toLowerCase()}
                                </strong>
                                . No landlord decision is required.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

export function LandlordRequestsPanel() {
    const queryClient = useQueryClient();

    const {
        data: rentalRequests = [],
        error,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: landlordRequestsQueryKey,
        queryFn: getLandlordRequests,
    });

    const updateRequestMutation = useMutation({
        mutationFn: ({
            requestId,
            status,
        }: {
            requestId: string;
            status: RentalDecision;
        }) =>
            updateLandlordRequest(
                requestId,
                status,
            ),

        onSuccess: (_updatedRequest, variables) => {
            queryClient.setQueryData<
                LandlordRentalRequest[]
            >(
                landlordRequestsQueryKey,
                (currentRequests = []) =>
                    currentRequests.map(
                        (currentRequest) =>
                            currentRequest.id ===
                                variables.requestId
                                ? {
                                    ...currentRequest,
                                    status: variables.status,
                                }
                                : currentRequest,
                    ),
            );

            toaster.success({
                title:
                    variables.status === "APPROVED"
                        ? "Request approved"
                        : "Request rejected",
                description:
                    variables.status === "APPROVED"
                        ? "The tenant can now continue to payment."
                        : "The rental request was rejected.",
            });
        },

        onError: (error) => {
            toaster.error({
                title: "Request update failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "The rental request could not be updated.",
            });
        },

        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: landlordRequestsQueryKey,
                }),
                queryClient.invalidateQueries({
                    queryKey: landlordPropertiesQueryKey,
                }),
                queryClient.invalidateQueries({
                    queryKey: ["properties"],
                }),
            ]);
        },
    });

    const pendingCount = rentalRequests.filter(
        (request) => request.status === "PENDING",
    ).length;

    const approvedCount = rentalRequests.filter(
        (request) =>
            request.status === "APPROVED",
    ).length;

    const rejectedCount = rentalRequests.filter(
        (request) =>
            request.status === "REJECTED",
    ).length;

    const errorMessage =
        error instanceof Error
            ? error.message
            : "Rental requests could not be loaded.";

    const pendingRequestId =
        updateRequestMutation.isPending
            ? updateRequestMutation.variables
                ?.requestId ?? null
            : null;

    const pendingDecision =
        updateRequestMutation.isPending
            ? updateRequestMutation.variables
                ?.status ?? null
            : null;

    function handleDecision(
        requestId: string,
        status: RentalDecision,
    ) {
        updateRequestMutation.mutate({
            requestId,
            status,
        });
    }

    return (
        <section aria-labelledby="landlord-requests-title">
            <header className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-24 rounded-l-[3rem] bg-accent-soft lg:block"
                />

                <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-accent/20 bg-accent-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                            Rental management
                        </span>

                        <h1
                            id="landlord-requests-title"
                            className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                        >
                            Review each tenant
                            <span className="block text-brand">
                                request with confidence.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                            Review tenant contact information,
                            move-in dates, rental duration, messages,
                            and approve or reject pending requests.
                        </p>
                    </div>
                </div>
            </header>

            {isFetching && !isLoading && (
                <div
                    role="status"
                    className="mt-5 flex w-fit items-center gap-2 rounded-full bg-info-soft px-3.5 py-2 text-xs font-bold text-info"
                >
                    <LoaderCircle
                        aria-hidden="true"
                        className="size-3.5 animate-spin"
                    />

                    Updating requests
                </div>
            )}

            {isLoading ? (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from(
                            { length: 4 },
                            (_, index) => (
                                <div
                                    key={index}
                                    className="h-44 animate-pulse rounded-[1.5rem] border border-border bg-surface-muted"
                                />
                            ),
                        )}
                    </div>

                    <div className="mt-8 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from(
                            { length: 6 },
                            (_, index) => (
                                <RequestCardSkeleton
                                    key={index}
                                />
                            ),
                        )}
                    </div>
                </>
            ) : error ? (
                <div
                    role="alert"
                    className="mt-8 rounded-[2rem] border border-danger/20 bg-surface p-8 text-center shadow-soft sm:p-12"
                >
                    <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-danger-soft text-danger">
                        <RefreshCw
                            aria-hidden="true"
                            className={`size-7 ${isFetching ? "animate-spin" : ""
                                }`}
                        />
                    </span>

                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-danger">
                        Requests unavailable
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                        Requests could not be loaded
                    </h2>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                        {errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={() => void refetch()}
                        disabled={isFetching}
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                    >
                        {isFetching && (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                        )}

                        {isFetching
                            ? "Trying again"
                            : "Try again"}
                    </button>
                </div>
            ) : (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <RequestSummary
                            label="Total requests"
                            value={rentalRequests.length}
                            description="Every tenant request received across your properties."
                            icon={Building2}
                            tone="brand"
                        />

                        <RequestSummary
                            label="Pending review"
                            value={pendingCount}
                            description="Requests currently waiting for your decision."
                            icon={Clock3}
                            tone="warning"
                        />

                        <RequestSummary
                            label="Approved"
                            value={approvedCount}
                            description="Requests approved for the secure payment stage."
                            icon={CircleCheck}
                            tone="success"
                        />

                        <RequestSummary
                            label="Rejected"
                            value={rejectedCount}
                            description="Requests that were not approved for rental."
                            icon={X}
                            tone="danger"
                        />
                    </div>

                    {rentalRequests.length === 0 ? (
                        <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center shadow-soft sm:p-12">
                            <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-accent-soft text-accent">
                                <MessageSquareText
                                    aria-hidden="true"
                                    className="size-7"
                                />
                            </span>

                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                                No action required
                            </p>

                            <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                                No rental requests yet
                            </h2>

                            <p className="mx-auto mt-3 max-w-lg leading-7 text-muted-foreground">
                                Tenant requests for your rental
                                properties will appear here when they
                                are submitted.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {rentalRequests.map(
                                (rentalRequest) => (
                                    <RentalRequestCard
                                        key={rentalRequest.id}
                                        rentalRequest={rentalRequest}
                                        pendingRequestId={
                                            pendingRequestId
                                        }
                                        pendingDecision={
                                            pendingDecision
                                        }
                                        onDecision={
                                            handleDecision
                                        }
                                    />
                                ),
                            )}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}