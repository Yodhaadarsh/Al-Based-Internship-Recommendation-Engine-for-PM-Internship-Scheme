'use client';

import { useState, useEffect } from 'react';
import { User, Brain, Star, MapPin, Clock, DollarSign, Building, Plus, Edit, Sparkles } from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [student, setStudent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Demo student ID - in a real app, this would come from authentication
  const studentId = 1;

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const response = await fetch(`/api/students?user_id=${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data.student);
      } else {
        setShowProfileForm(true);
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
      setShowProfileForm(true);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId })
      });
      
      if (!response.ok) throw new Error('Failed to get recommendations');
      
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const ProfileForm = () => {
    const [formData, setFormData] = useState({
      email: '',
      full_name: '',
      university: '',
      major: '',
      graduation_year: new Date().getFullYear() + 1,
      gpa: '',
      skills: '',
      interests: '',
      experience_level: 'beginner',
      preferred_location: '',
      bio: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
            interests: formData.interests.split(',').map(s => s.trim()).filter(s => s),
            gpa: formData.gpa ? parseFloat(formData.gpa) : null,
            graduation_year: parseInt(formData.graduation_year)
          })
        });

        if (!response.ok) throw new Error('Failed to create profile');
        
        const data = await response.json();
        setStudent({ ...data.user, ...data.profile });
        setShowProfileForm(false);
      } catch (error) {
        console.error('Error creating profile:', error);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Your Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({...formData, university: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({...formData, major: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <input
                type="number"
                value={formData.graduation_year}
                onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GPA (optional)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
              <input
                type="text"
                value={formData.preferred_location}
                onChange={(e) => setFormData({...formData, preferred_location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Python, JavaScript, Data Analysis"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interests (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Machine Learning, Web Development, Product Management"
              value={formData.interests}
              onChange={(e) => setFormData({...formData, interests: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Tell us about yourself, your goals, and what you're looking for in an internship..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Profile
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {student ? `Welcome back, ${student.full_name}!` : 'Welcome to InternMatch AI'}
                </p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showProfileForm || !student ? (
          <ProfileForm />
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'recommendations'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  AI Recommendations
                </button>
              </nav>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                      <button
                        onClick={() => setShowProfileForm(true)}
                        className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Name</label>
                        <p className="mt-1 text-sm text-gray-900">{student.full_name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{student.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">University</label>
                        <p className="mt-1 text-sm text-gray-900">{student.university || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Major</label>
                        <p className="mt-1 text-sm text-gray-900">{student.major || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Graduation Year</label>
                        <p className="mt-1 text-sm text-gray-900">{student.graduation_year || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">GPA</label>
                        <p className="mt-1 text-sm text-gray-900">{student.gpa || 'Not specified'}</p>
                      </div>
                    </div>

                    {student.skills && student.skills.length > 0 && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-500 mb-2">Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {student.skills.map((skill, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {student.interests && student.interests.length > 0 && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-500 mb-2">Interests</label>
                        <div className="flex flex-wrap gap-2">
                          {student.interests.map((interest, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {student.bio && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-500 mb-2">Bio</label>
                        <p className="text-sm text-gray-900">{student.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('recommendations')}
                        className="w-full flex items-center space-x-3 p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <Brain className="h-5 w-5" />
                        <span>Get AI Recommendations</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <Plus className="h-5 w-5" />
                        <span>Upload Resume</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations</h3>
                  <button
                    onClick={fetchRecommendations}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{loading ? 'Generating...' : 'Get New Recommendations'}</span>
                  </button>
                </div>

                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">AI is analyzing your profile and finding the best matches...</p>
                  </div>
                )}

                {!loading && recommendations.length === 0 && (
                  <div className="text-center py-12">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                    <p className="text-gray-500 mb-4">Click "Get New Recommendations" to let our AI find the perfect internships for you!</p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {rec.internship.title}
                          </h4>
                          <p className="text-indigo-600 font-medium">{rec.internship.company_name}</p>
                          <p className="text-sm text-gray-500">{rec.internship.industry}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="text-lg font-bold text-gray-900">{rec.match_score}</span>
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          {rec.internship.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {rec.internship.duration_months} months
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="h-4 w-4 mr-2" />
                          ${rec.internship.stipend_amount?.toLocaleString()}/month
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Why this is a great match:</h5>
                        <p className="text-sm text-gray-600">{rec.reasoning}</p>
                      </div>

                      {rec.key_strengths && rec.key_strengths.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-green-800 mb-2">Key Strengths:</h5>
                          <ul className="text-sm text-green-700 space-y-1">
                            {rec.key_strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}