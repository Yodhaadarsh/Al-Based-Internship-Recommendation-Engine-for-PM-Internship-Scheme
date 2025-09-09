import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Brain, Star, MapPin, Clock, DollarSign, Edit, ArrowLeft, Plus, Sparkles } from 'lucide-react-native';
import { Link, router } from 'expo-router';
import KeyboardAvoidingAnimatedView from '@/components/KeyboardAvoidingAnimatedView';

export default function StudentScreen() {
  const insets = useSafeAreaInsets();
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
      Alert.alert('Error', 'Failed to generate recommendations. Please try again.');
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

    const handleSubmit = async () => {
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
        Alert.alert('Success', 'Profile created successfully!');
      } catch (error) {
        console.error('Error creating profile:', error);
        Alert.alert('Error', 'Failed to create profile. Please try again.');
      }
    };

    return (
      <KeyboardAvoidingAnimatedView style={styles.container} behavior="padding">
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create Your Profile</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.full_name}
                onChangeText={(text) => setFormData({...formData, full_name: text})}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>University</Text>
              <TextInput
                style={styles.input}
                value={formData.university}
                onChangeText={(text) => setFormData({...formData, university: text})}
                placeholder="Enter your university"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Major</Text>
              <TextInput
                style={styles.input}
                value={formData.major}
                onChangeText={(text) => setFormData({...formData, major: text})}
                placeholder="Enter your major"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Graduation Year</Text>
              <TextInput
                style={styles.input}
                value={formData.graduation_year.toString()}
                onChangeText={(text) => setFormData({...formData, graduation_year: text})}
                placeholder="Enter graduation year"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Skills (comma-separated)</Text>
              <TextInput
                style={styles.input}
                value={formData.skills}
                onChangeText={(text) => setFormData({...formData, skills: text})}
                placeholder="e.g., Python, JavaScript, Data Analysis"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Interests (comma-separated)</Text>
              <TextInput
                style={styles.input}
                value={formData.interests}
                onChangeText={(text) => setFormData({...formData, interests: text})}
                placeholder="e.g., Machine Learning, Web Development"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.bio}
                onChangeText={(text) => setFormData({...formData, bio: text})}
                placeholder="Tell us about yourself and your goals..."
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>Create Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingAnimatedView>
    );
  };

  if (showProfileForm || !student) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ProfileForm />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Dashboard</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recommendations' && styles.activeTab]}
          onPress={() => setActiveTab('recommendations')}
        >
          <Text style={[styles.tabText, activeTab === 'recommendations' && styles.activeTabText]}>
            AI Recommendations
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'profile' ? (
          <View style={styles.profileContainer}>
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <Text style={styles.cardTitle}>Profile Information</Text>
                <TouchableOpacity onPress={() => setShowProfileForm(true)}>
                  <Edit size={20} color="#4F46E5" />
                </TouchableOpacity>
              </View>

              <View style={styles.profileField}>
                <Text style={styles.fieldLabel}>Name</Text>
                <Text style={styles.fieldValue}>{student.full_name}</Text>
              </View>

              <View style={styles.profileField}>
                <Text style={styles.fieldLabel}>Email</Text>
                <Text style={styles.fieldValue}>{student.email}</Text>
              </View>

              <View style={styles.profileField}>
                <Text style={styles.fieldLabel}>University</Text>
                <Text style={styles.fieldValue}>{student.university || 'Not specified'}</Text>
              </View>

              <View style={styles.profileField}>
                <Text style={styles.fieldLabel}>Major</Text>
                <Text style={styles.fieldValue}>{student.major || 'Not specified'}</Text>
              </View>

              {student.skills && student.skills.length > 0 && (
                <View style={styles.profileField}>
                  <Text style={styles.fieldLabel}>Skills</Text>
                  <View style={styles.skillsContainer}>
                    {student.skills.map((skill, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {student.bio && (
                <View style={styles.profileField}>
                  <Text style={styles.fieldLabel}>Bio</Text>
                  <Text style={styles.fieldValue}>{student.bio}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setActiveTab('recommendations')}
            >
              <Brain size={20} color="white" />
              <Text style={styles.actionButtonText}>Get AI Recommendations</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recommendationsContainer}>
            <View style={styles.recommendationsHeader}>
              <Text style={styles.cardTitle}>AI-Powered Recommendations</Text>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={fetchRecommendations}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Sparkles size={16} color="white" />
                )}
                <Text style={styles.generateButtonText}>
                  {loading ? 'Generating...' : 'Generate'}
                </Text>
              </TouchableOpacity>
            </View>

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>AI is analyzing your profile...</Text>
              </View>
            )}

            {!loading && recommendations.length === 0 && (
              <View style={styles.emptyState}>
                <Brain size={48} color="#9CA3AF" />
                <Text style={styles.emptyStateTitle}>No recommendations yet</Text>
                <Text style={styles.emptyStateText}>
                  Tap "Generate" to let our AI find perfect internships for you!
                </Text>
              </View>
            )}

            {recommendations.map((rec) => (
              <View key={rec.id} style={styles.recommendationCard}>
                <View style={styles.recommendationHeader}>
                  <View style={styles.recommendationInfo}>
                    <Text style={styles.recommendationTitle}>{rec.internship.title}</Text>
                    <Text style={styles.companyName}>{rec.internship.company_name}</Text>
                  </View>
                  <View style={styles.scoreContainer}>
                    <Star size={16} color="#F59E0B" />
                    <Text style={styles.scoreText}>{rec.match_score}%</Text>
                  </View>
                </View>

                <View style={styles.internshipDetails}>
                  <View style={styles.detailItem}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{rec.internship.location}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{rec.internship.duration_months} months</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <DollarSign size={14} color="#6B7280" />
                    <Text style={styles.detailText}>${rec.internship.stipend_amount?.toLocaleString()}/month</Text>
                  </View>
                </View>

                <Text style={styles.reasoningTitle}>Why this is a great match:</Text>
                <Text style={styles.reasoningText}>{rec.reasoning}</Text>

                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Apply Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F46E5',
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileContainer: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  profileField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 16,
    color: '#111827',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  skillTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillText: {
    fontSize: 12,
    color: '#4338CA',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationsContainer: {
    padding: 20,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  recommendationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  internshipDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  reasoningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  reasoningText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  applyButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});