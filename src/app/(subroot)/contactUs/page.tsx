"use client";
import NewsFeed from '@/components/custom/newsfeed';
import { InstagramIcon } from '@/components/ui/assets/svg';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import React, { useState } from 'react';

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

            // Reset status after 5 seconds
            setTimeout(() => setSubmitStatus(null), 5000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-[#ffc95c] relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Get in Touch</h1>
                    <p className="text-lg md:text-xl text-black max-w-2xl">
                        We'd love to hear from you. Our friendly team is always here to help with any questions or concerns.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#8BC34A] opacity-20 rounded-full -mr-32 -mb-32"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#8BC34A] opacity-20 rounded-full -ml-16 -mt-16"></div>
            </div>

            {/* Contact Information & Form Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12">
                {/* Left Column - Contact Information */}
                <div>
                    <h2 className="text-3xl font-semibold text-black mb-8">Contact Information</h2>

                    <div className="space-y-8">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-[#ffc95c] p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-black">Our Address</h3>
                                <p className="mt-1 text-gray-700">
                                    BDS ELASTICA RUBBER AND
                                    ALLIED PRODUCTS LLP
                                    Old no 2F, New no 38 LGB Nagar,
                                    Saravanampatti, Coimbatore 641035
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-[#ffc95c] p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-black">Call Us</h3>
                                <p className="mt-1 text-gray-700">+91 7598315432</p>
                                <p className="mt-1 text-gray-500">Mon-Fri from 8am to 6pm</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-[#ffc95c] p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-black">Email Us</h3>
                                <p className="mt-1 text-gray-700">sales@elastica.co.in</p>
                                <p className="mt-1 text-gray-500">We&apos;ll respond as soon as possible</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-[#ffc95c] p-3 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-black">Business Hours</h3>
                                <p className="mt-1 text-gray-700">Monday - Friday: 9:00 AM - 5:00 PM</p>
                                <p className="mt-1 text-gray-700">Saturday: 10:00 AM - 2:00 PM</p>
                                <p className="mt-1 text-gray-700">Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="mt-12">
                        <h3 className="text-lg font-medium text-black mb-4">Connect With Us</h3>
                        <div className="flex space-x-4">
                            <a href="tel:7598315432" className="bg-[#ffc95c] p-3 rounded-full hover:bg-[#e9b64e] transition-colors">
                                <Phone className='text-black'/>
                            </a>
                            <a href="mailto:sales@elastica.co.in" className="bg-[#ffc95c] p-3 rounded-full hover:bg-[#e9b64e] transition-colors">
                                <Mail className='text-black'/>
                            </a>
                            <a href="https://www.instagram.com/elastica_srkp" className="bg-[#ffc95c] p-3 rounded-full hover:bg-[#e9b64e] transition-colors">
                               <InstagramIcon className='text-black'/>
                            </a>
                            <a href="https://wa.me/7598315432" className="bg-[#ffc95c] p-3 rounded-full hover:bg-[#e9b64e] transition-colors">
                                <MessageCircle className='text-black'/>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Column - Contact Form */}
                <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
                    <h2 className="text-3xl font-semibold text-black mb-6">Send us a Message</h2>

                    {submitStatus === 'success' && (
                        <div className="mb-6 bg-[#8BC34A] bg-opacity-20 border border-[#8BC34A] text-[#2E7D32] px-4 py-3 rounded">
                            Thank you! Your message has been sent successfully.
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ffc95c] focus:border-[#ffc95c] transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ffc95c] focus:border-[#ffc95c] transition-colors"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ffc95c] focus:border-[#ffc95c] transition-colors"
                                    placeholder="How can we help you?"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ffc95c] focus:border-[#ffc95c] transition-colors"
                                    placeholder="Tell us how we can assist you..."
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full px-6 py-3 bg-[#ffc95c] text-black font-medium rounded-md hover:bg-[#e9b64e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc95c] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Map Section */}
            <div className="bg-[#f9f9f9] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-semibold text-black mb-8 text-center">Find Us</h2>

                    <div className="relative h-96 rounded-lg overflow-hidden shadow-lg border-8 border-white">
                        {/* This is a placeholder for a map - in a real application, you would integrate with Google Maps or similar */}
                        <div className="absolute inset-0 bg-gray-300">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.6368208325493!2d77.02523247486243!3d11.140402789031363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8587495555555%3A0x40f051893debd129!2sSri%20Ramkarthic%20Polymers%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1740556183677!5m2!1sen!2sin" width="1200" height="450"  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                           
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-700">
                        BDS ELASTICA RUBBER AND
                                    ALLIED PRODUCTS LLP
                                    Old no 2F, New no 38 LGB Nagar,
                                    Saravanampatti, Coimbatore 641035
                        </p>
                        <a
                            href="https://www.google.co.in/maps/place/Sri+Ramkarthic+Polymers+Pvt+Ltd/@11.1404028,77.0252325,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba8587495555555:0x40f051893debd129!8m2!3d11.1404028!4d77.0278074!16s%2Fg%2F11c0qgzmfc?authuser=1&entry=ttu&g_ep=EgoyMDI1MDIyMy4xIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 px-6 py-2 bg-[#8BC34A] text-white font-medium rounded-md hover:bg-opacity-90 transition-colors"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-semibold text-black mb-8 text-center">Frequently Asked Questions</h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium text-black mb-2">What are your business hours?</h3>
                        <p className="text-gray-700">Our office is open Monday through Friday from 9:00 AM to 5:00 PM, and Saturday from 10:00 AM to 2:00 PM. We are closed on Sundays and major holidays.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium text-black mb-2">How quickly do you respond to inquiries?</h3>
                        <p className="text-gray-700">We strive to respond to all inquiries within 24 business hours. For urgent matters, we recommend calling our office directly.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium text-black mb-2">Do you offer virtual meetings?</h3>
                        <p className="text-gray-700">Yes, we offer virtual meetings via Zoom, Google Meet, or Microsoft Teams. Please let us know your preference when scheduling.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium text-black mb-2">Is there parking available at your office?</h3>
                        <p className="text-gray-700">Yes, we have free parking available for clients in our designated parking area. Additional street parking is also available nearby.</p>
                    </div>
                </div>
            </div>

            <NewsFeed />

        </div>
    );
};

export default ContactUsPage;