
import { useMemo, useState } from "react";
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
} from "lucide-react";

// Demo scheme data.
// Later we will connect this with the Spring Boot backend.

const schemes = [
  {
    id: 1,
    name: "PM-KISAN",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Income support to small and marginal farmers across India.",
    government: "Central Government",
    category: "Agriculture",
    icon: Sprout,
    iconColor: "text-emerald-700",
    iconBg: "bg-emerald-50",
  },
  {
    id: 2,
    name: "Ladli Behna Yojana",
    ministry: "Government of Madhya Pradesh",
    description:
      "Financial assistance to women of the state for economic empowerment.",
    government: "Madhya Pradesh",
    category: "Women & Child",
    icon: Users,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
  },
  {
    id: 3,
    name: "PM Vidya Lakshmi",
    ministry: "Ministry of Education",
    description:
      "Education loan support for students pursuing higher education.",
    government: "Central Government",
    category: "Education",
    icon: GraduationCap,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    id: 4,
    name: "PM Awas Yojana (Gramin)",
    ministry: "Ministry of Rural Development",
    description:
      "Support for rural housing to eligible families.",
    government: "Central Government",
    category: "Housing",
    icon: House,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
  },
  {
    id: 5,
    name: "Ayushman Bharat PM-JAY",
    ministry: "Ministry of Health & Family Welfare",
    description:
      "Health insurance coverage for eligible families.",
    government: "Central Government",
    category: "Healthcare",
    icon: HeartPulse,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
  },
];

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

export default function DiscoverSchemes() {
  const [search, setSearch] = useState(""); 
  const [government, setGovernment] = useState("All");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Search and filter schemes
  const filteredSchemes = useMemo(() => {
    let result = schemes.filter((scheme) => {
      const query = search.toLowerCase();

      const matchesSearch =
        scheme.name.toLowerCase().includes(query) ||
        scheme.ministry.toLowerCase().includes(query) ||
        scheme.description.toLowerCase().includes(query);

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

    if (sortBy === "A to Z") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [search, government, category, sortBy]);

  // Bookmark functionality
  const toggleBookmark = (id) => {
    setBookmarks((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

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
      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(250px,1fr)_170px_170px_150px]">

        {/* Search */}
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <Search size={20} className="shrink-0 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schemes (e.g. PM-KISAN, scholarship, housing...)"
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
          className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-400"
        >
          <option value="Popular">Popular</option>
          <option value="A to Z">A to Z</option>
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
      <p className="mb-3 text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-900">
          {filteredSchemes.length}
        </span>{" "}
        schemes
      </p>

      {/* Scheme List */}
      <div className="space-y-3">

        {filteredSchemes.map((scheme) => {
          const Icon = scheme.icon;
          const saved = bookmarks.includes(scheme.id);

          return (
            <article
              key={scheme.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md md:p-5"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

                {/* Icon */}
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${scheme.iconBg}`}
                >
                  <Icon
                    size={30}
                    className={scheme.iconColor}
                  />
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
                    title="Save scheme"
                    aria-label="Bookmark scheme"
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
                    onClick={() => setSelectedScheme(scheme)}
                    className="rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    View Details
                  </button>

                  {/* Check Eligibility */}
                  <Link
                    to="/eligibility"
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
              No schemes found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setGovernment("All");
                setCategory("All");
                setSortBy("Popular");
              }}
              className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Scheme Details Popup */}
      {selectedScheme && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4"
          onClick={() => setSelectedScheme(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Scheme Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedScheme.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedScheme(null)}
                aria-label="Close popup"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              {selectedScheme.description}
            </p>

            <div className="mt-4 rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">
                Government
              </p>
              <p className="mt-1 text-sm text-blue-800">
                {selectedScheme.government}
              </p>

              <p className="mt-3 text-sm font-semibold text-blue-900">
                Category
              </p>
              <p className="mt-1 text-sm text-blue-800">
                {selectedScheme.category}
              </p>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              This is a short introductory description. Always verify
              eligibility, benefits and documents using the latest
              official government scheme guidelines.
            </p>

            <Link
              to="/eligibility"
              className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Check Eligibility
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
 
