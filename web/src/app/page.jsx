"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Star,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";

export default function HomePage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [remoteFilter, setRemoteFilter] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("skills", searchTerm);
      if (locationFilter) params.append("location", locationFilter);
      if (remoteFilter) params.append("remote", "true");

      const response = await fetch(`/api/internships?${params}`);
      if (!response.ok) throw new Error("Failed to fetch internships");

      const data = await response.json();
      setInternships(data.internships);
    } catch (error) {
      console.error("Error fetching internships:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchInternships();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  InternMatch AI
                </h1>
                <p className="text-sm text-gray-600">
                  AI-Powered Internship Recommendations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => (window.location.href = "/student")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Student Portal
              </button>
              <button className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                For Employers
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Find Your Perfect Internship with AI
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our AI analyzes your profile, skills, and preferences to recommend
            the best internship opportunities for your career growth.
          </p>

          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Skills (e.g., Python, Marketing)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={remoteFilter}
                    onChange={(e) => setRemoteFilter(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Remote Only</span>
                </label>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Search Internships
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <Building className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Partner Companies</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <Users className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">10,000+</div>
                <div className="text-gray-600">Students Matched</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <Award className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internships List */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Latest Internship Opportunities
          </h3>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((internship) => (
                <div
                  key={internship.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {internship.title}
                      </h4>
                      <p className="text-indigo-600 font-medium">
                        {internship.company_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {internship.industry}
                      </p>
                    </div>
                    {internship.is_remote && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Remote
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {internship.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {internship.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      {internship.duration_months} months
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-2" />$
                      {internship.stipend_amount?.toLocaleString()}/month
                    </div>
                  </div>

                  {internship.preferred_skills &&
                    internship.preferred_skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {internship.preferred_skills
                            .slice(0, 3)
                            .map((skill, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          {internship.preferred_skills.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{internship.preferred_skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && internships.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No internships found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6" />
                <span className="text-lg font-bold">InternMatch AI</span>
              </div>
              <p className="text-gray-400">
                Connecting students with their dream internships through
                AI-powered recommendations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Create Profile</li>
                <li>Get Recommendations</li>
                <li>Apply to Internships</li>
                <li>Track Applications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Post Internships</li>
                <li>Find Candidates</li>
                <li>Manage Applications</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 InternMatch AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
