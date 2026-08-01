import {
    MapPin,
    Quote,
    Star,
} from "lucide-react";

type Review = Readonly<{
    name: string;
    initials: string;
    role: string;
    location: string;
    comment: string;
}>;

const reviews: readonly Review[] = [
    {
        name: "Nadia Rahman",
        initials: "NR",
        role: "Tenant",
        location: "Dhaka",
        comment:
            "Finding a suitable property felt simple and organized. I could track my rental request without any confusion.",
    },
    {
        name: "Farhan Ahmed",
        initials: "FA",
        role: "Landlord",
        location: "Chattogram",
        comment:
            "RESTNEST gives me one clean place to manage listings, availability, and incoming tenant requests.",
    },
    {
        name: "Sadia Karim",
        initials: "SK",
        role: "Tenant",
        location: "Sylhet",
        comment:
            "The property details were clear, and the complete rental process felt transparent from beginning to end.",
    },
    {
        name: "Imran Hossain",
        initials: "IH",
        role: "Landlord",
        location: "Rajshahi",
        comment:
            "Creating and updating property listings is straightforward. The dashboard saves me a lot of management time.",
    },
    {
        name: "Tasnia Islam",
        initials: "TI",
        role: "Tenant",
        location: "Khulna",
        comment:
            "The filters helped me quickly find properties that matched my preferred location and budget.",
    },
    {
        name: "Mahin Chowdhury",
        initials: "MC",
        role: "Landlord",
        location: "Dhaka",
        comment:
            "Managing tenant requests is much easier because every important action remains visible in one workspace.",
    },
];

type ReviewCardProps = Readonly<{
    review: Review;
}>;

function ReviewCard({
    review,
}: ReviewCardProps) {
    return (
        <article className="flex h-[17rem] w-[20rem] shrink-0 flex-col rounded-[1.5rem] border border-border bg-surface p-5 shadow-soft sm:w-[23rem] sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-sm font-bold text-brand">
                        {review.initials}
                    </span>

                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-foreground">
                            {review.name}
                        </h3>

                        <p className="mt-1 text-xs font-semibold text-brand">
                            {review.role}
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
                aria-label="5 out of 5 stars"
                className="mt-5 flex gap-1 text-warning"
            >
                {Array.from({ length: 5 }, (_, index) => (
                    <Star
                        key={index}
                        aria-hidden="true"
                        className="size-4"
                        fill="currentColor"
                        strokeWidth={1.5}
                    />
                ))}
            </div>

            <blockquote className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
                “{review.comment}”
            </blockquote>

            <p className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs font-semibold text-muted-foreground">
                <MapPin
                    aria-hidden="true"
                    className="size-3.5 text-accent"
                />

                {review.location}, Bangladesh
            </p>
        </article>
    );
}

type ReviewGroupProps = Readonly<{
    duplicate?: boolean;
}>;

function ReviewGroup({
    duplicate = false,
}: ReviewGroupProps) {
    return (
        <div
            aria-hidden={duplicate || undefined}
            className="restnest-marquee-group"
        >
            {reviews.map((review) => (
                <ReviewCard
                    key={`${duplicate ? "duplicate-" : ""}${review.name}`}
                    review={review}
                />
            ))}
        </div>
    );
}

export function ReviewsMarqueeSection() {
    return (
        <section
            aria-labelledby="reviews-marquee-title"
            className="overflow-hidden border-b border-border bg-surface-subtle py-20 sm:py-24 lg:py-28"
        >
            <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2
                        id="reviews-marquee-title"
                        className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                    >
                        What people say about
                        <span className="block text-brand">
                            their RESTNEST experience.
                        </span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                        Experiences from tenants and landlords using a
                        simpler, clearer rental marketplace.
                    </p>
                </div>
            </div>

            <div className="restnest-marquee mt-12">
                <div className="restnest-marquee-track">
                    <ReviewGroup />
                    <ReviewGroup duplicate />
                </div>
            </div>
        </section>
    );
}