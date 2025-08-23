import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-8">
              
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="mb-4">
                  FormVerse Technologies Private Limited ("FormVerse," "we," "us," or "our") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our CAD design and 3D printing marketplace platform.
                </p>
                <p className="mb-4">
                  This policy applies to all users of FormVerse services, including creators who upload designs and users who purchase and download content. By using our platform, you consent to the data practices described in this policy.
                </p>
                <p>
                  We are committed to compliance with global privacy regulations including the General Data Protection Regulation (GDPR), Indian Information Technology Act, and applicable local data protection laws.
                </p>
              </section>

              {/* Data We Collect */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-medium mb-3">2.1 Account Information</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Name, email address, and contact information</li>
                  <li>Username and password</li>
                  <li>Profile picture and bio</li>
                  <li>Professional qualifications and design experience</li>
                  <li>Verification documents for creator accounts</li>
                </ul>
                
                <h3 className="text-xl font-medium mb-3">2.2 Payment Information</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Credit card, debit card, and bank account details</li>
                  <li>Digital wallet information</li>
                  <li>Transaction history and purchase records</li>
                  <li>Tax identification numbers where required</li>
                  <li>Payout preferences and banking information</li>
                </ul>
                
                <h3 className="text-xl font-medium mb-3">2.3 Uploaded Content</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>CAD files, 3D models, and design specifications</li>
                  <li>Product descriptions, tags, and metadata</li>
                  <li>Preview images and thumbnails</li>
                  <li>Licensing information and usage rights</li>
                  <li>User-generated reviews and comments</li>
                </ul>
                
                <h3 className="text-xl font-medium mb-3">2.4 Usage and Browsing Data</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>IP address, device information, and browser type</li>
                  <li>Pages visited, search queries, and interaction patterns</li>
                  <li>Download history and purchase behavior</li>
                  <li>Time spent on platform and feature usage</li>
                  <li>Referral sources and marketing campaign interactions</li>
                </ul>
              </section>

              {/* How We Use Data */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                
                <h3 className="text-xl font-medium mb-3">3.1 Platform Operations</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Creating and managing user accounts</li>
                  <li>Processing transactions and facilitating downloads</li>
                  <li>Providing customer support and technical assistance</li>
                  <li>Maintaining platform security and preventing fraud</li>
                  <li>Generating analytics and performance reports</li>
                </ul>
                
                <h3 className="text-xl font-medium mb-3">3.2 Service Improvement</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Analyzing user behavior to enhance platform features</li>
                  <li>Personalizing content recommendations</li>
                  <li>Optimizing search algorithms and discovery tools</li>
                  <li>Developing new features and services</li>
                  <li>Conducting market research and user surveys</li>
                </ul>
                
                <h3 className="text-xl font-medium mb-3">3.3 Communications</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Sending transactional emails and notifications</li>
                  <li>Providing platform updates and announcements</li>
                  <li>Marketing communications (with user consent)</li>
                  <li>Educational content and design resources</li>
                  <li>Legal notices and policy updates</li>
                </ul>
                
                <h3 className="text-xl font-medium mb-3">3.4 Legal Compliance</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Complying with legal obligations and regulations</li>
                  <li>Responding to law enforcement requests</li>
                  <li>Protecting intellectual property rights</li>
                  <li>Enforcing terms of service and platform policies</li>
                  <li>Conducting security investigations</li>
                </ul>
              </section>

              {/* User Rights */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Your Rights and Choices</h2>
                
                <h3 className="text-xl font-medium mb-3">4.1 Access and Portability</h3>
                <p className="mb-4">
                  You have the right to access, review, and download your personal information stored on our platform. We provide self-service tools in your account dashboard and can provide comprehensive data exports upon request.
                </p>
                
                <h3 className="text-xl font-medium mb-3">4.2 Correction and Updates</h3>
                <p className="mb-4">
                  You can update your account information, profile details, and preferences at any time through your account settings. We encourage users to keep their information current and accurate.
                </p>
                
                <h3 className="text-xl font-medium mb-3">4.3 Deletion Rights</h3>
                <p className="mb-4">
                  You may request deletion of your account and associated personal information. Note that some information may be retained for legal compliance, fraud prevention, and legitimate business purposes as permitted by law.
                </p>
                
                <h3 className="text-xl font-medium mb-3">4.4 Communication Preferences</h3>
                <p>
                  You can opt out of marketing communications at any time through unsubscribe links or account settings. Transactional communications necessary for platform operation cannot be disabled.
                </p>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Information Sharing and Disclosure</h2>
                
                <h3 className="text-xl font-medium mb-3">5.1 Payment Processors</h3>
                <p className="mb-4">
                  We share necessary payment information with trusted financial service providers including Razorpay, PayPal, and banking partners to process transactions securely. These partners operate under strict data protection agreements.
                </p>
                
                <h3 className="text-xl font-medium mb-3">5.2 Service Providers</h3>
                <p className="mb-4">
                  We work with third-party service providers for cloud hosting, analytics, customer support, and marketing automation. All providers are contractually bound to protect user information and use it solely for specified purposes.
                </p>
                
                <h3 className="text-xl font-medium mb-3">5.3 Legal Requirements</h3>
                <p className="mb-4">
                  We may disclose information when required by law, court order, or government request. We also share information to protect our rights, prevent fraud, ensure platform security, and comply with intellectual property obligations.
                </p>
                
                <h3 className="text-xl font-medium mb-3">5.4 Business Transfers</h3>
                <p>
                  In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the business transaction. Users will be notified of any such changes and their options regarding their information.
                </p>
              </section>

              {/* Security Measures */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Data Security and Protection</h2>
                
                <h3 className="text-xl font-medium mb-3">6.1 Encryption</h3>
                <p className="mb-4">
                  All data transmission uses industry-standard SSL/TLS encryption. Personal information and payment data are encrypted both in transit and at rest using AES-256 encryption standards.
                </p>
                
                <h3 className="text-xl font-medium mb-3">6.2 Access Controls</h3>
                <p className="mb-4">
                  Access to personal information is strictly limited to authorized personnel who require it for their job functions. We implement multi-factor authentication, regular access reviews, and principle of least privilege access.
                </p>
                
                <h3 className="text-xl font-medium mb-3">6.3 Infrastructure Security</h3>
                <p className="mb-4">
                  Our platform is hosted on secure cloud infrastructure with regular security audits, vulnerability assessments, and compliance monitoring. We maintain comprehensive backup and disaster recovery systems.
                </p>
                
                <h3 className="text-xl font-medium mb-3">6.4 Incident Response</h3>
                <p>
                  We maintain a robust incident response plan and will notify affected users of any data breaches within 72 hours as required by applicable regulations. We continuously monitor for security threats and unusual activity.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
                
                <p className="mb-4">
                  FormVerse is not intended for users under the age of 13 (or the minimum age required by local law). We do not knowingly collect personal information from children under this age. If we become aware that we have collected information from a child under the minimum age, we will promptly delete such information.
                </p>
                
                <p className="mb-4">
                  For users between 13-18 years old, parental consent may be required in certain jurisdictions. We encourage parents to monitor their children's online activities and discuss internet safety.
                </p>
                
                <p>
                  If you believe we have collected information from a child inappropriately, please contact us immediately at privacy@formverse.in so we can take corrective action.
                </p>
              </section>

              {/* Global Compliance */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers and Compliance</h2>
                
                <h3 className="text-xl font-medium mb-3">8.1 GDPR Compliance</h3>
                <p className="mb-4">
                  For users in the European Union, we comply with the General Data Protection Regulation (GDPR). We provide specific rights including data portability, right to erasure, and right to object to processing. Our lawful basis for processing includes contract performance, legitimate interests, and user consent.
                </p>
                
                <h3 className="text-xl font-medium mb-3">8.2 Indian IT Act Compliance</h3>
                <p className="mb-4">
                  We comply with the Indian Information Technology (IT) Act, 2000, and related rules including the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
                </p>
                
                <h3 className="text-xl font-medium mb-3">8.3 Data Localization</h3>
                <p className="mb-4">
                  We maintain data processing facilities in multiple regions to comply with local data residency requirements. Indian user data is primarily processed within India, with limited transfers only as necessary for platform operations.
                </p>
                
                <h3 className="text-xl font-medium mb-3">8.4 Cross-Border Transfers</h3>
                <p>
                  When we transfer data internationally, we use appropriate safeguards including standard contractual clauses, adequacy decisions, and binding corporate rules to ensure equivalent protection standards.
                </p>
              </section>

              {/* Policy Updates */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Privacy Policy Updates</h2>
                
                <p className="mb-4">
                  We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or business operations. We will notify users of material changes through:
                </p>
                
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Email notifications to registered users</li>
                  <li>Prominent notices on our platform</li>
                  <li>In-app notifications and announcements</li>
                  <li>Updates to our website and mobile applications</li>
                </ul>
                
                <p className="mb-4">
                  Users will have 30 days to review changes before they take effect. Continued use of the platform after the effective date constitutes acceptance of the updated policy.
                </p>
                
                <p>
                  We encourage users to periodically review this Privacy Policy to stay informed about our information practices and the choices available to them.
                </p>
              </section>

              {/* Contact Information */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                
                <p className="mb-4">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <p><strong>Data Protection Officer</strong></p>
                    <p>FormVerse Technologies Private Limited</p>
                    <p>Email: privacy@formverse.in</p>
                    <p>Phone: [Your Contact Number]</p>
                  </div>
                  
                  <div>
                    <p><strong>Postal Address:</strong></p>
                    <p>[Your Business Address]</p>
                    <p>[City, State, PIN Code]</p>
                    <p>India</p>
                  </div>
                  
                  <div>
                    <p><strong>EU Representative:</strong> (if applicable)</p>
                    <p>[EU Representative Details]</p>
                  </div>
                </div>
                
                <p className="mt-6">
                  <strong>Response Time:</strong> We aim to respond to all privacy-related inquiries within 30 days. For urgent matters, please mark your communication as "Urgent Privacy Matter."
                </p>
              </section>

            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}