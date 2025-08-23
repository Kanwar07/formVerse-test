import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
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
                  Welcome to FormVerse, India's premier global CAD design and 3D printing marketplace. FormVerse operates as a digital platform connecting creators who design and upload CAD models with users who purchase, download, and utilize these designs for various purposes including 3D printing, manufacturing, and commercial applications.
                </p>
                <p className="mb-4">
                  By accessing or using FormVerse's platform, website, mobile applications, or related services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, you may not access or use our Service.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and FormVerse Technologies Private Limited ("FormVerse," "we," "us," or "our").
                </p>
              </section>

              {/* User Roles */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">2. User Roles and Responsibilities</h2>
                
                <h3 className="text-xl font-medium mb-3">2.1 Creators</h3>
                <p className="mb-2">As a Creator, you have the right to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Upload, showcase, and sell original CAD designs</li>
                  <li>Set pricing for your designs within platform guidelines</li>
                  <li>Retain ownership of your intellectual property</li>
                  <li>Receive payment for licensed content according to our revenue-sharing model</li>
                </ul>
                
                <p className="mb-2">As a Creator, you are responsible for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Ensuring all uploaded content is original or properly licensed</li>
                  <li>Providing accurate descriptions and specifications</li>
                  <li>Maintaining design quality and printability standards</li>
                  <li>Responding to customer inquiries in a timely manner</li>
                  <li>Complying with applicable laws and regulations</li>
                </ul>

                <h3 className="text-xl font-medium mb-3">2.2 Users/Buyers</h3>
                <p className="mb-2">As a User/Buyer, you have the right to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Browse, search, and purchase CAD designs</li>
                  <li>Download purchased content according to license terms</li>
                  <li>Use designs for personal or commercial purposes as specified in licenses</li>
                  <li>Request support for technical issues</li>
                </ul>
                
                <p className="mb-2">As a User/Buyer, you are responsible for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Using purchased designs only within license limitations</li>
                  <li>Making payments for downloaded content</li>
                  <li>Respecting intellectual property rights of creators</li>
                  <li>Following safety guidelines for 3D printing and manufacturing</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property Rights</h2>
                
                <h3 className="text-xl font-medium mb-3">3.1 Creator Ownership</h3>
                <p className="mb-4">
                  Creators retain full ownership of their original CAD designs uploaded to FormVerse. By uploading content, creators grant FormVerse a limited, non-exclusive license to display, distribute, and market the content through our platform.
                </p>
                
                <h3 className="text-xl font-medium mb-3">3.2 Licensing Terms</h3>
                <p className="mb-4">
                  FormVerse offers multiple licensing options including Personal Use, Commercial Use, and Exclusive licenses. Each license clearly defines permitted uses, restrictions, and transferability rights. Users must comply with the specific license terms for each purchased design.
                </p>
                
                <h3 className="text-xl font-medium mb-3">3.3 Copyright Protection</h3>
                <p className="mb-4">
                  FormVerse respects intellectual property rights and maintains a zero-tolerance policy for copyright infringement. We implement robust content verification systems and respond promptly to valid DMCA takedown notices.
                </p>
                
                <h3 className="text-xl font-medium mb-3">3.4 Restrictions on Misuse</h3>
                <p>
                  Users are strictly prohibited from reverse-engineering, redistributing, or creating derivative works from purchased designs unless explicitly permitted by the license terms.
                </p>
              </section>

              {/* Platform Rights */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Platform Rights and Moderation</h2>
                
                <h3 className="text-xl font-medium mb-3">4.1 Content Display License</h3>
                <p className="mb-4">
                  By uploading content, creators grant FormVerse the right to display, promote, and distribute their designs across our platform, marketing materials, and partner networks for the purpose of facilitating sales and platform growth.
                </p>
                
                <h3 className="text-xl font-medium mb-3">4.2 Moderation Rights</h3>
                <p className="mb-4">
                  FormVerse reserves the right to review, moderate, and remove content that violates our community guidelines, legal requirements, or quality standards. We employ both automated systems and human review processes to maintain platform integrity.
                </p>
                
                <h3 className="text-xl font-medium mb-3">4.3 Dispute Resolution</h3>
                <p>
                  FormVerse provides mediation services for disputes between creators and users. Our dispute resolution process includes investigation, evidence review, and fair arbitration to resolve conflicts efficiently.
                </p>
              </section>

              {/* Payments & Fees */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Payments and Fees</h2>
                
                <h3 className="text-xl font-medium mb-3">5.1 Transaction Policies</h3>
                <p className="mb-4">
                  All transactions are processed securely through our integrated payment systems supporting multiple currencies and payment methods. Prices are clearly displayed before purchase, and all fees are transparently communicated.
                </p>
                
                <h3 className="text-xl font-medium mb-3">5.2 Revenue Share</h3>
                <p className="mb-4">
                  FormVerse operates on a competitive revenue-sharing model. Creators retain 70-85% of sales revenue, with platform fees varying based on account tier and sales volume. Detailed fee structures are available in creator dashboards.
                </p>
                
                <h3 className="text-xl font-medium mb-3">5.3 Creator Payouts</h3>
                <p className="mb-4">
                  Creator earnings are processed monthly with multiple payout options including bank transfers, digital wallets, and international payment services. Minimum payout thresholds and processing times vary by region.
                </p>
                
                <h3 className="text-xl font-medium mb-3">5.4 Refund Conditions</h3>
                <p>
                  Refunds are provided for technical issues, incorrectly described content, or platform errors within 14 days of purchase. Detailed refund policies are outlined in our support documentation.
                </p>
              </section>

              {/* Prohibited Activities */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Prohibited Activities</h2>
                
                <p className="mb-4">Users are strictly prohibited from engaging in the following activities:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Uploading copyrighted content without proper authorization</li>
                  <li>Creating or sharing designs intended for illegal purposes</li>
                  <li>Reverse-engineering platform security measures</li>
                  <li>Manipulating pricing or review systems</li>
                  <li>Sharing account credentials or circumventing access controls</li>
                  <li>Uploading malicious files or harmful content</li>
                  <li>Violating export control laws or international trade restrictions</li>
                  <li>Creating content that poses safety risks when manufactured</li>
                </ul>
              </section>

              {/* Safety & Liability */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Safety and Liability</h2>
                
                <h3 className="text-xl font-medium mb-3">7.1 Disclaimer of Warranties</h3>
                <p className="mb-4">
                  FormVerse provides the platform "as is" without warranties of merchantability, fitness for particular purpose, or non-infringement. While we strive for accuracy, we cannot guarantee the performance or safety of 3D printed objects created from platform designs.
                </p>
                
                <h3 className="text-xl font-medium mb-3">7.2 Limitation of Liability</h3>
                <p className="mb-4">
                  FormVerse's liability is limited to the amount paid for the specific design or service. We are not responsible for indirect, consequential, or punitive damages arising from platform use or design implementation.
                </p>
                
                <h3 className="text-xl font-medium mb-3">7.3 3D Printing Safety</h3>
                <p>
                  Users assume full responsibility for 3D printing safety, material selection, and proper equipment operation. We strongly recommend following manufacturer guidelines and safety protocols when using our designs for physical production.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Account Termination</h2>
                
                <p className="mb-4">FormVerse may suspend or terminate accounts for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Violation of these Terms of Service</li>
                  <li>Fraudulent or illegal activities</li>
                  <li>Repeated policy violations</li>
                  <li>Non-payment of fees</li>
                  <li>Compromise of account security</li>
                </ul>
                
                <p>
                  Users may terminate their accounts at any time. Upon termination, access to purchased content may be restricted, and outstanding payments will be processed according to our policies.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Dispute Resolution and Governing Law</h2>
                
                <h3 className="text-xl font-medium mb-3">9.1 Governing Law</h3>
                <p className="mb-4">
                  These Terms are governed by the laws of India. For international users, local consumer protection laws may provide additional rights that cannot be waived.
                </p>
                
                <h3 className="text-xl font-medium mb-3">9.2 Dispute Resolution</h3>
                <p className="mb-4">
                  Disputes will be resolved through binding arbitration under the Indian Arbitration and Conciliation Act, 2015. For international users, disputes may be resolved according to applicable local laws and international arbitration treaties.
                </p>
                
                <h3 className="text-xl font-medium mb-3">9.3 Jurisdiction</h3>
                <p>
                  Courts in Mumbai, India have exclusive jurisdiction for legal proceedings, subject to applicable international treaties and local consumer protection laws.
                </p>
              </section>

              {/* Contact Information */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                <p className="mb-4">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>FormVerse Technologies Private Limited</strong></p>
                  <p>Email: legal@formverse.in</p>
                  <p>Address: [Your Business Address]</p>
                  <p>Phone: [Your Contact Number]</p>
                </div>
              </section>

            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}