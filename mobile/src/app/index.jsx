import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  TrendingUp,
  User,
  Search,
  Brain,
  Building,
  Users,
  Award,
} from "lucide-react-native";
import { Link } from "expo-router";

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logo}>
              <TrendingUp size={28} color="white" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>InternMatch AI</Text>
              <Text style={styles.headerSubtitle}>
                AI-Powered Internship Recommendations
              </Text>
            </View>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Find Your Perfect Internship with AI
          </Text>
          <Text style={styles.heroSubtitle}>
            Our AI analyzes your profile, skills, and preferences to recommend
            the best internship opportunities for your career growth.
          </Text>

          <Link href="/student" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <User size={20} color="white" />
              <Text style={styles.primaryButtonText}>Student Portal</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Why Choose InternMatch AI?</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Building size={32} color="#4F46E5" />
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Partner Companies</Text>
            </View>

            <View style={styles.statCard}>
              <Users size={32} color="#4F46E5" />
              <Text style={styles.statNumber}>10,000+</Text>
              <Text style={styles.statLabel}>Students Matched</Text>
            </View>

            <View style={styles.statCard}>
              <Award size={32} color="#4F46E5" />
              <Text style={styles.statNumber}>95%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <User size={24} color="#4F46E5" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Create Your Profile</Text>
              <Text style={styles.featureDescription}>
                Tell us about your skills, interests, academic background, and
                career goals.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Brain size={24} color="#4F46E5" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Get AI Recommendations</Text>
              <Text style={styles.featureDescription}>
                Our AI analyzes thousands of internships to find the perfect
                matches for you.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <TrendingUp size={24} color="#4F46E5" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Apply & Grow</Text>
              <Text style={styles.featureDescription}>
                Apply to recommended internships and kickstart your career
                journey.
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>
            Ready to Find Your Dream Internship?
          </Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of students who have found their perfect internships
            through our AI-powered platform.
          </Text>

          <Link href="/student" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Brain size={20} color="white" />
              <Text style={styles.primaryButtonText}>Get Started Now</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    backgroundColor: "#4F46E5",
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  hero: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  statsSection: {
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
  },
  featuresSection: {
    padding: 20,
    backgroundColor: "white",
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  ctaSection: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
});
