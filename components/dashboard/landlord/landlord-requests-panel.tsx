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
    Mail,
    MapPin,
    MessageSquareText,
    Phone,
    RefreshCw,
    UserRound,
    X,
} from "lucide-react";

import { PropertyImage } from "@/components/properties/property-image";
import { toaster } from "@/components/ui/app-toaster";
import {
    getLandlordRequests,
    landlordRequestsQueryKey,
    updateLandlordRequest,
} from "@/lib/api/landlord-requests-client";
import { landlordPropertiesQueryKey } from "@/lib/api/landlord-properties-client";
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
    PENDING:
        "border-amber-700/30 bg-amber-100 text-amber-900 dark:border-amber-400/40 dark:bg-amber-950 dark:text-amber-200",
    APPROVED:
        "border-blue-700/30 bg-blue-100 text-blue-900 dark:border-blue-400/40 dark:bg-blue-950 dark:text-blue-200",
    REJECTED:
        "border-red-700/30 bg-red-100 text-red-900 dark:border-red-400/40 dark:bg-red-950 dark:text-red-200",
    ACTIVE:
        "border-emerald-700/30 bg-emerald-100 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-950 dark:text-emerald-200",
    COMPLETED:
        "border-violet-700/30 bg-violet-100 text-violet-900 dark:border-violet-400/40 dark:bg-violet-950 dark:text-violet-200",
    CANCELLED:
        "border-zinc-600/30 bg-zinc-200 text-zinc-900 dark:border-zinc-400/40 dark:bg-zinc-800 dark:text-zinc-100",
};

type RequestSummaryProps = Readonly<{
    label: string;
    value: number;
    icon: typeof Building2;
}>;

function RequestSummary({
    label,
    value,
    icon: Icon,
}: RequestSummaryProps) {
    return (
        <article className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-surface-muted text-brand">
                    <Icon aria-hidden="true" className="size-5" />
                </span>

                <p className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
                    {value}
                </p>
            </div>

            <p className="mt-4 text-sm font-medium text-muted-foreground">
                {label}
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
            <div className="aspect-[16/9] animate-pulse bg-surface-muted" />

            <div className="space-y-4 p-5">
                <div className="h-6 w-2/3 animate-pulse rounded-lg bg-surface-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-surface-muted" />
                <div className="h-24 animate-pulse rounded-xl bg-surface-muted" />
                <div className="h-10 animate-pulse rounded-xl bg-surface-muted" />
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

    const isPending =
        rentalRequest.status === "PENDING";

    return (
        <article className="overflow-hidden rounded-[1.75rem] border border-border bg-surface">
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted">
                <PropertyImage
                    key={primaryImageUrl ?? "property-placeholder"}
                    imageUrl={primaryImageUrl}
                    alt={`Rental property: ${rentalRequest.property.title}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                />

                <span
                    className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${statusStyles[rentalRequest.status]}`}
                >
                    {statusLabels[rentalRequest.status]}
                </span>

                <span className="absolute right-4 top-4 rounded-full border border-border bg-background/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                    {rentalRequest.property.category.name}
                </span>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="line-clamp-1 text-lg font-semibold tracking-[-0.025em] text-foreground">
                            {rentalRequest.property.title}
                        </h2>

                        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin
                                aria-hidden="true"
                                className="size-4 shrink-0 text-brand"
                            />

                            <span className="line-clamp-1">
                                {rentalRequest.property.location}
                            </span>
                        </p>
                    </div>

                    <div className="shrink-0 text-right">
                        <p className="text-lg font-semibold text-brand">
                            {currencyFormatter.format(
                                rentalRequest.property.price,
                            )}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Total payment
                        </p>
                    </div>
                </div>

                <div className="mt-5 rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-center gap-2">
                        <UserRound
                            aria-hidden="true"
                            className="size-4 text-brand"
                        />

                        <p className="font-semibold text-foreground">
                            {rentalRequest.tenant.name}
                        </p>
                    </div>

                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                            <Mail
                                aria-hidden="true"
                                className="size-4 shrink-0 text-brand"
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
                                {rentalRequest.tenant.phone}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-background p-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            <CalendarDays
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            Move-in date
                        </p>

                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {dateFormatter.format(
                                new Date(rentalRequest.moveInDate),
                            )}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            <Clock3
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            Duration
                        </p>

                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {rentalRequest.duration}{" "}
                            {rentalRequest.duration === 1
                                ? "month"
                                : "months"}
                        </p>
                    </div>
                </div>

                {rentalRequest.message && (
                    <div className="mt-4 rounded-xl border border-border bg-surface-muted p-4">
                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <MessageSquareText
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            Tenant message
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
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

                {isPending && (
                    <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
                        <button
                            type="button"
                            onClick={() =>
                                onDecision(
                                    rentalRequest.id,
                                    "APPROVED",
                                )
                            }
                            disabled={isCurrentRequestPending}
                            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                        >
                            <Check
                                aria-hidden="true"
                                className="size-4"
                            />

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
                            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-700/30 bg-surface px-4 text-sm font-semibold text-red-700 transition-colors hover:border-red-700/50 hover:bg-red-50 hover:text-red-800 disabled:cursor-wait disabled:opacity-60 dark:border-red-400/30 dark:text-red-600 dark:hover:border-red-400/50 dark:hover:bg-red-950/40 dark:hover:text-red-700"
                        >
                            <X
                                aria-hidden="true"
                                className="size-4"
                            />

                            {isCurrentRequestPending &&
                                pendingDecision === "REJECTED"
                                ? "Rejecting..."
                                : "Reject"}
                        </button>
                    </div>
                )}
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
            queryClient.setQueryData<LandlordRentalRequest[]>(
                landlordRequestsQueryKey,
                (currentRequests = []) =>
                    currentRequests.map((currentRequest) =>
                        currentRequest.id === variables.requestId
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
        (request) =>
            request.status === "PENDING",
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
        updateRequestMutation.variables
            ?.requestId ?? null;

    const pendingDecision =
        updateRequestMutation.variables
            ?.status ?? null;

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
        <section>
            <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                        Rental management
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                        Tenant rental requests
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                        Review tenant information, requested
                        move-in dates, rental duration, and
                        approve or reject pending requests.
                    </p>
                </div>

                {isFetching && !isLoading && (
                    <p
                        role="status"
                        className="text-sm font-medium text-brand"
                    >
                        Updating requests...
                    </p>
                )}
            </div>

            {isLoading ? (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from(
                            { length: 4 },
                            (_, index) => (
                                <div
                                    key={index}
                                    className="h-32 animate-pulse rounded-2xl border border-border bg-surface-muted"
                                />
                            ),
                        )}
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface-muted text-brand">
                        <RefreshCw
                            aria-hidden="true"
                            className="size-6"
                        />
                    </span>

                    <h2 className="mt-5 text-xl font-semibold text-foreground">
                        Requests could not be loaded
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        {errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isFetching
                            ? "Trying again..."
                            : "Try again"}
                    </button>
                </div>
            ) : (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <RequestSummary
                            label="Total requests"
                            value={rentalRequests.length}
                            icon={Building2}
                        />

                        <RequestSummary
                            label="Pending review"
                            value={pendingCount}
                            icon={Clock3}
                        />

                        <RequestSummary
                            label="Approved"
                            value={approvedCount}
                            icon={CircleCheck}
                        />

                        <RequestSummary
                            label="Rejected"
                            value={rejectedCount}
                            icon={X}
                        />
                    </div>

                    {rentalRequests.length === 0 ? (
                        <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                            <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-surface-muted text-brand">
                                <MessageSquareText
                                    aria-hidden="true"
                                    className="size-7"
                                />
                            </span>

                            <h2 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground">
                                No rental requests yet
                            </h2>

                            <p className="mx-auto mt-2 max-w-lg leading-7 text-muted-foreground">
                                Tenant requests for your rental
                                properties will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {rentalRequests.map(
                                (rentalRequest) => (
                                    <RentalRequestCard
                                        key={rentalRequest.id}
                                        rentalRequest={
                                            rentalRequest
                                        }
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