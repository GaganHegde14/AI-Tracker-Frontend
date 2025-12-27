import React, { useState } from "react";
import axios from "axios";
import Layout from "../Components/Layout";
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  User,
  Bug,
  Lightbulb,
} from "lucide-react";

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
    priority: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { value: "general", label: "General Question", icon: HelpCircle },
    { value: "bug", label: "Bug Report", icon: Bug },
    { value: "feature", label: "Feature Request", icon: Lightbulb },
    { value: "billing", label: "Billing & Payments", icon: AlertCircle },
    { value: "account", label: "Account Issues", icon: User },
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "text-green-400" },
    { value: "medium", label: "Medium", color: "text-yellow-400" },
    { value: "high", label: "High", color: "text-red-400" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/support/create`,
        {
          ...formData,
          submittedAt: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "general",
          message: "",
          priority: "medium",
        });
      } else {
        setError("Failed to submit support request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting support request:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Support",
      value: "support@aitaskmanager.com",
      description: "We'll respond within 24 hours",
    },
    {
      icon: MessageCircle,
      label: "Live Chat Support - For Premium Users",
      value: "Available 9 AM - 6 PM EST",
      description: "Instant help for urgent issues",
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "< 24 hours",
      description: "Average response time",
    },
  ];

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">
              Request Submitted!
            </h2>
            <p className="text-gray-300 mb-6">
              Thank you for contacting us. We've received your support request
              and will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20"></div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-12">
              <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">
                Get Help & Support
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Have questions or need assistance? We're here to help you get
                the most out of your AI Task Manager experience.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-8">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  {contactInfo.map((contact, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6"
                    >
                      <div className="flex items-start gap-4">
                        <contact.icon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-white mb-1">
                            {contact.label}
                          </h3>
                          <p className="text-blue-400 font-medium mb-1">
                            {contact.value}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {contact.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ Link */}
                <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Check Our FAQ
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Many common questions are answered in our Premium page FAQ
                    section.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/premium")}
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors"
                  >
                    View FAQ <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Support Form */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-8">
                  Send us a Message
                </h2>

                {error && (
                  <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 text-sm">{error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  {/* Category & Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        {priorityLevels.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                      placeholder="Please describe your issue or question in detail..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;
