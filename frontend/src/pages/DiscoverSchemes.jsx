
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Sprout,
  GraduationCap,
  HeartPulse,
  House,
  Users,
  ShieldCheck,
  BriefcaseBusiness,
  MoreHorizontal,
  Bookmark,
  ArrowRight,
  X,
  RefreshCw,
  ExternalLink,
  FileText,
  CheckCircle,
  LoaderCircle,
} from "lucide-react";

// FastAPI backend URL
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

// Available scheme categories
const categories = [
  { name: "All", icon: null },
  { name: "Agriculture", icon: Sprout },
  { name: "Education", icon: GraduationCap },
  { name: "Healthcare", icon: HeartPulse },
  { name: "Housing", icon: House },
  { name: "Women & Child", icon: Users },
  { name: "Social Security", icon: ShieldCheck },
  { name: "Employment", icon: BriefcaseBusiness },
  { name: "Other", icon: MoreHorizontal },
];

// Category icons and styles
const categoryVisuals = {
  Agriculture: {
    Icon: Sprout,
    iconColor: "text-emerald-700",
    iconBg: "bg-emerald-50",
  },
  Education: {
    Icon: GraduationCap,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  Healthcare: {
    Icon: HeartPulse,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
  },
  Housing: {
    Icon: House,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
  },
  "Women & Child": {
    Icon: Users,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
  },
  "Social Security": {
    Icon: ShieldCheck,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
  },
  Employment: {
    Icon: BriefcaseBusiness,
    iconColor: "text-teal-700",
    iconBg: "bg-teal-50",
  },
  Other: {
    Icon: MoreHorizontal,
    iconColor: "text-slate-600",
    iconBg: "bg-slate-100",
  },
};

function getCategoryVisual(category) {
  return (
    categoryVisuals[category] || {
      Icon: MoreHorizontal,
      iconColor: "text-slate-600",
      iconBg: "bg-slate-100",
    }
  );
}

// Format the verification date
function formatDate(dateValue) {
  if (!dateValue) return "Not available";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function DiscoverSchemes() {
  const [schemes, setSchemes] = useState([]);

  const [search, setSearch] = useState("");
  const [government, setGovernment] = useState("All");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recent");

  const [bookmarks, setBookmarks] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Scheme details popup
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [schemeDetails, setSchemeDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // --------------------------------
  // 1. Fetch schemes from FastAPI
  // --------------------------------

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSchemes() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/schemes`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load schemes. Server returned ${response.status}.`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid scheme data received from server.");
        }

        setSchemes(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchSchemes();

    return () => controller.abort();
  }, [reloadKey]);

  // --------------------------------
  // 2. Search, filter and sort
  // --------------------------------

  const filteredSchemes = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = schemes.filter((scheme) => {
      const matchesSearch =
        String(scheme.name || "").toLowerCase().includes(query) ||
        String(scheme.ministry || "").toLowerCase().includes(query) ||
        String(scheme.description || "").toLowerCase().includes(query);

      const matchesGovernment =
        government === "All" ||
        scheme.government === government;

      const matchesCategory =
        category === "All" ||
        scheme.category === category;

      return (
        matchesSearch &&
        matchesGovernment &&
        matchesCategory
      );
    });

    if (sortBy === "az") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
    }

    if (sortBy === "recent") {
      result.sort((a, b) => {
        const dateA = new Date(a.last_verified_at || 0).getTime();
        const dateB = new Date(b.last_verified_at || 0).getTime();

        return (
          (Number.isNaN(dateB) ? 0 : dateB) -
          (Number.isNaN(dateA) ? 0 : dateA)
        );
      });
    }

    return result;
  }, [schemes, search, government, category, sortBy]);

  // --------------------------------
  // 3. Bookmark functionality
  // --------------------------------

  function toggleBookmark(id) {
    setBookmarks((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  // --------------------------------
  // 4. Open scheme details
  // --------------------------------

  function openSchemeDetails(scheme) {
    setSelectedScheme(scheme);
    setSchemeDetails(null);
    setDetailsError("");
  }

  // Fetch complete details for selected scheme
  useEffect(() => {
    if (!selectedScheme?.id) return;

    const controller = new AbortController();

    async function fetchSchemeDetails() {
      try {
        setDetailsLoading(true);
        setDetailsError("");

        const response = await fetch(
          `${API_BASE_URL}/api/schemes/${encodeURIComponent(
            selectedScheme.id
          )}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load scheme details. Server returned ${response.status}.`
          );
        }

        const data = await response.json();

        setSchemeDetails(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setDetailsError(
            err.message || "Unable to load scheme details."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setDetailsLoading(false);
        }
      }
    }

    fetchSchemeDetails();

    return () => controller.abort();
  }, [selectedScheme?.id]);

  // Close details popup
  function closeDetails() {
    setSelectedScheme(null);
    setSchemeDetails(null);
    setDetailsError("");
  }

  // Clear all filters
  function clearFilters() {
    setSearch("");
    setGovernment("All");
    setCategory("All");
    setSortBy("recent");
  }

  const details = schemeDetails || selectedScheme;

  return (
    <div className="mx-auto max-w-[1500px]">

      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>

        <span>›</span>

        <span className="font-medium text-slate-900">
          Discover Schemes
        </span>
      </div>

      {/* Page Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Discover Government Schemes
        </h1>

        <p className="mt-2 text-sm text-slate-500 md:text-base">
          Explore schemes and find benefits that match your needs.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(250px,1fr)_170px_170px_170px]">

        {/* Search */}
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <Search size={20} className="shrink-0 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schemes..."
            aria-label="Search schemes"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={17} className="text-slate-400" />
            </button>
          )}
        </div>

        {/* Government Filter */}
        <select
          value={government}
          onChange={(e) => setGovernment(e.target.value)}
          aria-label="Filter by government"
          className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400"
        >
          <option value="All">All Governments</option>
          <option value="Central Government">Central Government</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
        </select>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400"
        >
          <option value="All">All Categories</option>

          {categories.slice(1).map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort schemes"
          className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400"
        >
          <option value="recent">Recently Verified</option>
          <option value="az">Name: A to Z</option>
        </select>
      </div>

      {/* Category Buttons */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => {
          const Icon = item.icon;
          const active = category === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setCategory(item.name)}
              aria-pressed={active}
              className={`flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {Icon && <Icon size={17} />}
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {filteredSchemes.length}
          </span>{" "}
          schemes
        </p>

        {(search || government !== "All" || category !== "All") && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-14 text-slate-500">
          <LoaderCircle size={20} className="animate-spin" />
          <span className="text-sm">Loading government schemes...</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-white px-5 py-10 text-center">
          <p className="font-semibold text-slate-800">
            Unable to load schemes
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={() => setReloadKey((previous) => previous + 1)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )}

      {/* Scheme List */}
      {!loading && !error && (
        <div className="space-y-3">

          {filteredSchemes.map((scheme) => {
            const { Icon, iconColor, iconBg } =
              getCategoryVisual(scheme.category);

            const saved = bookmarks.includes(scheme.id);

            return (
              <article
                key={scheme.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 md:p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

                  {/* Icon */}
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                  >
                    <Icon size={30} className={iconColor} />
                  </div>

                  {/* Scheme Information */}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-slate-900 md:text-lg">
                      {scheme.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {scheme.ministry}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {scheme.description}
                    </p>

                    {scheme.benefit_summary && (
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        Benefit: {scheme.benefit_summary}
                      </p>
                    )}
                  </div>

                  {/* Scheme Tags */}
                  <div className="flex flex-wrap gap-2 xl:w-[210px] xl:shrink-0">
                    <span className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                      {scheme.government}
                    </span>

                    <span className="rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                      {scheme.category}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 xl:shrink-0">

                    {/* Bookmark */}
                    <button
                      onClick={() => toggleBookmark(scheme.id)}
                      title={saved ? "Remove bookmark" : "Save scheme"}
                      aria-label={saved ? "Remove bookmark" : "Bookmark scheme"}
                      aria-pressed={saved}
                      className={`rounded-lg p-2 transition ${
                        saved
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                      }`}
                    >
                      <Bookmark
                        size={19}
                        fill={saved ? "currentColor" : "none"}
                      />
                    </button>

                    {/* View Details */}
                    <button
                      onClick={() => openSchemeDetails(scheme)}
                      className="rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      View Details
                    </button>

                    {/* Check Eligibility */}
                    <Link
                      to={`/eligibility?scheme_id=${encodeURIComponent(scheme.id)}`}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Check Eligibility
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          {/* No Results */}
          {filteredSchemes.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
              <Search
                size={35}
                className="mx-auto mb-3 text-slate-300"
              />

              <h3 className="font-semibold text-slate-800">
                {schemes.length === 0
                  ? "No schemes available yet"
                  : "No schemes found"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {schemes.length === 0
                  ? "Government schemes will appear here once they are added."
                  : "Try changing your search or filters."}
              </p>

              {(search || government !== "All" || category !== "All") && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Scheme Details Popup */}
      {selectedScheme && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4"
          onClick={closeDetails}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="scheme-details-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Scheme Details
                </p>

                <h2
                  id="scheme-details-title"
                  className="mt-1 text-xl font-bold text-slate-900"
                >
                  {details.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {details.government} · {details.category}
                </p>
              </div>

              <button
                onClick={closeDetails}
                aria-label="Close popup"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {detailsLoading && (
              <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
                <LoaderCircle size={18} className="animate-spin" />
                Loading scheme details...
              </div>
            )}

            {detailsError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {detailsError}
              </div>
            )}

            {!detailsLoading && !detailsError && schemeDetails && (
              <div className="space-y-5">

                {/* Description */}
                <section>
                  <h3 className="mb-2 font-semibold text-slate-900">
                    About the Scheme
                  </h3>

                  <p className="text-sm leading-6 text-slate-600">
                    {schemeDetails.description}
                  </p>
                </section>

                {/* Benefits */}
                {schemeDetails.benefits && (
                  <section>
                    <h3 className="mb-2 font-semibold text-slate-900">
                      Benefits
                    </h3>

                    <p className="text-sm leading-6 text-slate-600">
                      {schemeDetails.benefits}
                    </p>
                  </section>
                )}

                {/* Eligibility Conditions */}
                {schemeDetails.eligibility_conditions?.length > 0 && (
                  <section>
                    <h3 className="mb-2 font-semibold text-slate-900">
                      Eligibility Conditions
                    </h3>

                    <ul className="space-y-2">
                      {schemeDetails.eligibility_conditions.map(
                        (condition, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <CheckCircle
                              size={17}
                              className="mt-0.5 shrink-0 text-emerald-600"
                            />
                            {typeof condition === "string"
                              ? condition
                              : condition.description}
                          </li>
                        )
                      )}
                    </ul>
                  </section>
                )}

                {/* Required Documents */}
                {schemeDetails.documents?.length > 0 && (
                  <section>
                    <h3 className="mb-2 font-semibold text-slate-900">
                      Required Documents
                    </h3>

                    <ul className="space-y-2">
                      {schemeDetails.documents.map((document, index) => (
                        <li
                          key={document.id ?? index}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <FileText
                            size={17}
                            className="mt-0.5 shrink-0 text-blue-600"
                          />
                          <span>
                            {typeof document === "string"
                              ? document
                              : document.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Official Sources */}
                <section className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">
                    Official Information
                  </h3>

                  <p className="mb-3 text-xs text-slate-500">
                    Last verified:{" "}
                    {formatDate(schemeDetails.last_verified_at)}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {schemeDetails.official_url && (
                      <a
                        href={schemeDetails.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                      >
                        Official Website
                        <ExternalLink size={14} />
                      </a>
                    )}

                    {schemeDetails.guidelines_url && (
                      <a
                        href={schemeDetails.guidelines_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                      >
                        Official Guidelines
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* Footer Actions */}
            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={closeDetails}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              <Link
                to={`/eligibility?scheme_id=${encodeURIComponent(selectedScheme.id)}`}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Check Eligibility
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
