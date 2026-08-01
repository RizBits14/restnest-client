import {
    Quote,
    Star,
    UserRound,
} from "lucide-react";

type ReviewTone =
    | "brand"
    | "accent"
    | "info"
    | "warning";

type Review = Readonly<{
    name: string;
    initials: string;
    role: string;
    location: string;
    review: string;
    rating: number;
    tone: ReviewTone;
}>;

const toneStyles: Record<
    ReviewTone,
    Readonly<{
        avatar: string;
        badge: string;
    }>
> = {
    brand: {
        avatar: "bg-brand-soft text-brand",
        badge: "bg-brand-soft text-brand",
    },
    accent: {
        avatar: "bg-accent-soft text-accent",
        badge: "bg-accent-soft text-accent",
    },
    info: {
        avatar: "bg-info-soft text-info",
        badge: "bg-info-soft text-info",
    },
    warning: {
        avatar: "bg-warning-soft text-warning",
        badge: "bg-warning-soft text-warning",
    },
};

const firstReviewRow: readonly Review[] = [
    {
        name: "Nadia Rahman",
        initials: "NR",
        role: "Tenant",
        location: "Dhaka",
        review:
            "RESTNEST made property searching feel organized and stress-free. I could compare listings and track my rental request easily.",
        rating: 5,
        tone: "brand",
    },
    {
        name: "Farhan Ahmed",
        initials: "FA",
        role: "Landlord",
        location: "Chattogram",
        review:
            "Managing listings is much easier now. Updating property availability and responding to tenant requests takes only a few minutes.",
        rating: 5,
        tone: "accent",
    },
    {
        name: "Sadia Karim",
        initials: "SK",
        role: "Tenant",
        location: "Sylhet",
        review:
            "The property information was clear, and the request status was always visible. The complete process felt transparent.",
        rating: 5,
        tone: "info",
    },
    {
        name: "Imran Hossain",
        initials: "IH",
        role: "Landlord",
        location: "Rajshahi",
        review:
            "I like having properties and tenant requests inside one workspace. The interface feels clean and straightforward.",
        rating: 5,
        tone: "warning",
    },
    {
        name: "Tasnia Islam",
        initials: "TI",
        role: "Tenant",
        location: "Khulna",
        review:
            "The property filters helped me find suitable homes quickly. Payment and review options were also easy to understand.",
        rating: 5,
        tone: "brand",
    },
];

const secondReviewRow: readonly Review[] = [
    {
        name: "Mahin Chowdhury",
        initials: "MC",
        role: "Landlord",
        location: "Dhaka",
        review:
            "Creating a property listing was smooth, and I could manage every rental request without switching between different tools.",
        rating: 5,
        tone: "accent",
    },
    {
        name: "Raisa Sultana",
        initials: "RS",
        role: "Tenant",
        location: "Cumilla",
        review:
            "I appreciated the clear property information and responsive layout. The platform also worked comfortably from my phone.",
        rating: 5,
        tone: "info",
    },
    {
        name: "Shafin Alam",
        initials: "SA",
        role: "Landlord",
        location: "Gazipur",
        review:
            "RESTNEST gives me a professional way to present properties and communicate rental decisions with prospective tenants.",
        rating: 5,
        tone: "warning",
    },
    {
        name: "Anika Noor",
        initials: "AN",
        role: "Tenant",
        location: "Narayanganj",
        review:
            "My request, payment, and review information stayed together. I never felt confused about what I needed to do next.",
        rating: 5,
        tone: "brand",
    },
    {
        name: "Nafis Hasan",
        initials: "NH",
        role: "Landlord",
        location: "Barishal",
        review:
            "The property-management workflow is simple but complete. It saves time and keeps important information easy to find.",
        rating: 5,
        tone: "accent",
    },
];

type ReviewCardProps = Readonly<{
    review: Review;
}>;

function ReviewCard({
    review,
}: ReviewCardProps) {
    const visualStyle =
        toneStyles[review.tone];

    return (
        <article className="flex h-full flex-col rounded-[1.5rem] border border-border bg-surface p-5 shadow-soft sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <span
                        className={`grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-bold ${visualStyle.avatar}`}
                    >
                        {review.initials}
                    </span>

                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-foreground">
                            {review.name}
                        </h3>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                            {review.location}
                        </p>
                    </div>
                </div>

                <Quote
                    aria-hidden="true"
                    className="size-6 shrink-0 text-brand/30"
                    strokeWidth={1.8}
                />
            </div>

            <div
                aria-label={`${review.rating} out of 5 stars`}
                className="mt-5 flex items-center gap-1 text-warning"
            >
                {Array.from(
                    { length: review.rating },
                    (_, index) => (
                        <Star
                            key={index}
                            aria-hidden="true"
                            className="size-4"
                            fill="currentColor"
                            strokeWidth={1.5}
                        />
                    ),
                )}
            </div>

            <blockquote className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                “{review.review}”
            </blockquote>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${visualStyle.badge}`}
                >
                    {review.role}
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <UserRound
                        aria-hidden="true"
                        className="size-3.5"
                    />

                    Demo review
                </span>
            </div>
        </article>
    );
}

type ReviewGroupProps = Readonly<{
    reviews: readonly Review[];
    duplicate?: boolean;
}>;

function ReviewGroup({
    reviews,
    duplicate = false,
}: ReviewGroupProps) {
    return (
        <div
            aria-hidden={duplicate || undefined}
            className="review-marquee-group"
        >
            {reviews.map((review) => (
                <div
                    key={`${duplicate ? "duplicate-" : ""}${review.name}`}
                    className="review-marquee-item"
                >
                    <ReviewCard review={review} />
                </div>
            ))}
        </div>
    );
}

type ReviewMarqueeProps = Readonly<{
    reviews: readonly Review[];
    reverse?: boolean;
}>;

function ReviewMarquee({
    reviews,
    reverse = false,
}: ReviewMarqueeProps) {
    return (
        <div className="review-marquee">
            <div
                className={[
                    "review-marquee-track",
                    reverse
                        ? "review-marquee-track-reverse"
                        : "",
                ].join(" ")}
            >
                <ReviewGroup reviews={reviews} />

                <ReviewGroup
                    reviews={reviews}
                    duplicate
                />
            </div>
        </div>
    );
}

export function PlatformExperienceSection() {
    return (
        <section
            aria-labelledby="community-reviews-title"
            className="overflow-hidden border-b border-border bg-surface-subtle py-20 sm:py-24 lg:py-28"
        >
            <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-brand/20 bg-brand-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand">
                            Community experiences
                        </span>

                        <h2
                            id="community-reviews-title"
                            className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                        >
                            Trusted experiences from
                            <span className="block text-brand">
                                tenants and landlords.
                            </span>
                        </h2>
                    </div>

                    <p className="max-w-xl text-base leading-7 text-muted-foreground">
                        A continuously moving collection of fictional
                        testimonials demonstrating how RESTNEST may
                        support both sides of the rental marketplace.
                    </p>
                </div>
            </div>

            <div className="mt-12 space-y-5">
                <ReviewMarquee
                    reviews={firstReviewRow}
                />

                <ReviewMarquee
                    reviews={secondReviewRow}
                    reverse
                />
            </div>

            <div className="mx-auto mt-8 w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <p className="text-center text-xs leading-5 text-muted-foreground">
                    Demonstration testimonials only. Replace them with
                    verified user reviews when real review data becomes
                    available.
                </p>
            </div>
        </section>
    );
}