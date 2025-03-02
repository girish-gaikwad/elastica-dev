"use client";
import { useState } from 'react';

const TermsAndPrivacy = () => {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="min-h-screen bg-white text-gray-100">
      {/* Header */}
      <header className="bg-[#ffc95c] py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-black text-3xl font-bold text-center">Elatica - Terms & Privacy</h1>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-[#ffc95c] text-black">
        <div className="container mx-auto px-4">
          <div className="flex border-b border-black">
            <button
              className={`py-4 px-6 font-medium ${
                activeTab === 'terms' ? 'bg-white text-[#ffc95c]' : ''
              }`}
              onClick={() => setActiveTab('terms')}
            >
              Terms & Conditions
            </button>
            <button
              className={`py-4 px-6 font-medium ${
                activeTab === 'privacy' ? 'bg-white text-[#ffc95c]' : ''
              }`}
              onClick={() => setActiveTab('privacy')}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {activeTab === 'terms' ? (
              <div className="terms-content">
                <h2 className="text-2xl font-bold mb-6 text-[#ffc95c]">Terms and Conditions</h2>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">1. Acceptance of Terms</h3>
                    <p className="mb-4">
                      By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">2. Use License</h3>
                    <p className="mb-4">
                      Permission is granted to temporarily download one copy of the materials on Company's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                      <li>Modify or copy the materials;</li>
                      <li>Use the materials for any commercial purpose or for any public display;</li>
                      <li>Attempt to reverse engineer any software contained on Company's website;</li>
                      <li>Remove any copyright or other proprietary notations from the materials;</li>
                      <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">3. Disclaimer</h3>
                    <p className="mb-4">
                      The materials on Company's website are provided "as is". Company makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">4. Limitations</h3>
                    <p className="mb-4">
                      In no event shall Company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Company's website, even if Company or a Company authorized representative has been notified orally or in writing of the possibility of such damage.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">5. Revisions and Errata</h3>
                    <p className="mb-4">
                      The materials appearing on Company's website could include technical, typographical, or photographic errors. Company does not warrant that any of the materials on its website are accurate, complete or current. Company may make changes to the materials contained on its website at any time without notice.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">6. Governing Law</h3>
                    <p className="mb-4">
                      These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                    </p>
                  </section>
                </div>
              </div>
            ) : (
              <div className="privacy-content">
                <h2 className="text-2xl font-bold mb-6 text-[#ffc95c]">Privacy Policy</h2>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">1. Information Collection</h3>
                    <p className="mb-4">
                      We collect information when you register on our site, place an order, subscribe to a newsletter, respond to a survey, fill out a form, or enter information on our site. When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number, or credit card information.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">2. Information Use</h3>
                    <p className="mb-4">
                      Any information we collect from you may be used in one of the following ways:
                    </p>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                      <li>To personalize your experience (your information helps us to better respond to your individual needs)</li>
                      <li>To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you)</li>
                      <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)</li>
                      <li>To process transactions (your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without your consent)</li>
                      <li>To send periodic emails (if you opt-in to our mailing list)</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">3. Information Protection</h3>
                    <p className="mb-4">
                      We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems, and are required to keep the information confidential.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">4. Cookies</h3>
                    <p className="mb-4">
                      We use cookies to understand and save your preferences for future visits, keep track of advertisements and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">5. Third-Party Disclosure</h3>
                    <p className="mb-4">
                      We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-[#90EE90]">6. Contact Us</h3>
                    <p className="mb-4">
                      If you have any questions regarding this privacy policy, you may contact us using the information below.
                    </p>
                    <p>
                      <strong>Email:</strong> contact@company.com<br />
                      <strong>Phone:</strong> (123) 456-7890<br />
                      <strong>Address:</strong> 123 Company Street, Business City, STATE 12345
                    </p>
                  </section>
                </div>
              </div>
            )}
          </div>
          <div className="bg-[#ffc95c] text-black p-6 text-center">
            <p>Last Updated: February 26, 2025</p>
          </div>
        </div>
      </main>

     
    </div>
  );
};

export default TermsAndPrivacy;