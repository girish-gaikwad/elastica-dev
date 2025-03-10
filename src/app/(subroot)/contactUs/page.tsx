"use client";
import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { Mail, MessageCircle, Phone, Clock, MapPin, Send } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/assets/svg';
import NewsFeed from '@/components/custom/newsfeed';

const ContactForm = () => {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

        // Your email address (where you want to receive messages)
        const yourEmail = 'info@elastica.co.in';

        emailjs
            .send(
                serviceId,
                templateId,
                {
                    from_name: form.name,
                    to_name: 'Admin',
                    from_email: form.email,
                    to_email: yourEmail,
                    subject: form.subject,
                    message: form.message,
                    reply_to: form.email
                },
                publicKey
            )
            .then(
                () => {
                    setLoading(false);
                    setSubmitStatus('success');

                    // Reset form after successful submission
                    setTimeout(() => {
                        setSubmitStatus(null);
                        setForm({
                            name: '',
                            email: '',
                            subject: '',
                            message: '',
                        });
                    }, 5000);

                    toast.success('Thank you! Your message has been sent successfully.');
                },
                (error) => {
                    setLoading(false);
                    console.error('Error sending email:', error);
                    setSubmitStatus('error');

                    // Clear error message after some time
                    setTimeout(() => {
                        setSubmitStatus(null);
                    }, 5000);
                }
            );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Luxury Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#22c55e] to-[#ffb030]">
                <div className="absolute inset-0 bg-black bg-opacity-5"></div>
                
                {/* Decorative Patterns */}
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="0" x2="0" y2="10" stroke="#000" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
                    </svg>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">Get in Touch</h1>
                    <p className="text-xl md:text-2xl text-gray-800 max-w-2xl font-light">
                        We'd love to hear from you. Our friendly team is always here to help with any questions or concerns.
                    </p>
                </div>

                {/* Luxury Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mb-32"></div>
                <div className="absolute top-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mt-24"></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-16">
                {/* Left Column - Contact Information with Luxury Styling */}
                <div className="space-y-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 relative">
                            Contact Information
                            <span className="absolute bottom-0 left-0 w-24 h-1 bg-[#22c55e]"></span>
                        </h2>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-start group">
                            <div className="flex-shrink-0 bg-[#22c55e] p-4 rounded-xl shadow-md transform transition-transform group-hover:scale-110">
                                <MapPin className="h-6 w-6 text-gray-900" />
                            </div>
                            <div className="ml-6">
                                <h3 className="text-lg font-semibold text-gray-900">Our Address</h3>
                                <p className="mt-2 text-gray-700 leading-relaxed">
                                38, Krishnapuram, Saravanampatti, Coimbatore - 641035

                                </p>
                            </div>
                        </div>

                        <div className="flex items-start group">
                            <div className="flex-shrink-0 bg-[#22c55e] p-4 rounded-xl shadow-md transform transition-transform group-hover:scale-110">
                                <Phone className="h-6 w-6 text-gray-900" />
                            </div>
                            <div className="ml-6">
                                <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                                <p className="mt-2 text-gray-700">+91 7598315432</p>
                                <p className="mt-1 text-gray-500">Mon-Fri from 8am to 6pm</p>
                            </div>
                        </div>

                        <div className="flex items-start group">
                            <div className="flex-shrink-0 bg-[#22c55e] p-4 rounded-xl shadow-md transform transition-transform group-hover:scale-110">
                                <Mail className="h-6 w-6 text-gray-900" />
                            </div>
                            <div className="ml-6">
                                <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                                <p className="mt-2 text-gray-700">sales@elastica.co.in</p>
                                <p className="mt-1 text-gray-500">We'll respond as soon as possible</p>
                            </div>
                        </div>

                        <div className="flex items-start group">
                            <div className="flex-shrink-0 bg-[#22c55e] p-4 rounded-xl shadow-md transform transition-transform group-hover:scale-110">
                                <Clock className="h-6 w-6 text-gray-900" />
                            </div>
                            <div className="ml-6">
                                <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                                <p className="mt-2 text-gray-700">Monday - Friday: 9:00 AM - 5:00 PM</p>
                                <p className="mt-1 text-gray-700">Saturday: 10:00 AM - 2:00 PM</p>
                                <p className="mt-1 text-gray-700">Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links with Luxury Styling */}
                    <div className="mt-16">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Connect With Us</h3>
                        <div className="flex space-x-4">
                            <a href="tel:7598315432" className="bg-[#22c55e] p-4 rounded-full shadow-md hover:bg-[#e9b040] transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                                <Phone className="text-gray-900" />
                            </a>
                            <a href="mailto:sales@elastica.co.in" className="bg-[#22c55e] p-4 rounded-full shadow-md hover:bg-[#e9b040] transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                                <Mail className="text-gray-900" />
                            </a>
                            <a href="https://www.instagram.com/elastica_srkp" className="bg-[#22c55e] p-4 rounded-full shadow-md hover:bg-[#e9b040] transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                                <InstagramIcon className="text-gray-900" />
                            </a>
                            <a href="https://wa.me/7598315432" className="bg-[#22c55e] p-4 rounded-full shadow-md hover:bg-[#e9b040] transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                                <MessageCircle className="text-gray-900" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Luxury Form */}
                <div className="bg-white rounded-xl shadow-xl p-10 border border-gray-100 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#22c55e] opacity-10 rounded-bl-full"></div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 relative inline-block">
                        Send us a Message
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-[#22c55e]"></span>
                    </h2>
                    <p className="text-gray-700 mb-8">
                        Have a question or want to discuss a project? Fill out the form below and we'll get back to you as soon as possible.
                    </p>

                    {submitStatus === 'success' && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">Thank you! Your message has been sent successfully.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">Sorry, there was an error sending your message. Please try again later.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] transition-colors"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] transition-colors"
                                placeholder="How can we help you?"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] transition-colors"
                                placeholder="Tell us more about your project or inquiry..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full px-6 py-4 bg-[#22c55e] text-gray-900 font-medium rounded-lg hover:bg-[#e9b040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22c55e] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Sending...' : (
                                <>
                                    <span>Send Message</span>
                                    <Send className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Map Section with Luxury Styling */}
            <div className="py-20 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center relative inline-block">
                        Find Us
                        <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#22c55e]"></span>
                    </h2>

                    <div className="relative rounded-xl overflow-hidden shadow-2xl border-8 border-white">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.6368208325493!2d77.02523247486243!3d11.140402789031363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8587495555555%3A0x40f051893debd129!2sSri%20Ramkarthic%20Polymers%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1740556183677!5m2!1sen!2sin" 
                            width="100%" 
                            height="500"  
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full"
                        ></iframe>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-gray-700 max-w-2xl mx-auto">
                            BDS ELASTICA RUBBER AND ALLIED PRODUCTS LLP<br />
                            Old no 2F, New no 38 LGB Nagar,<br />
                            Saravanampatti, Coimbatore 641035
                        </p>
                        <a
                            href="https://www.google.co.in/maps/place/Sri+Ramkarthic+Polymers+Pvt+Ltd/@11.1404028,77.0252325,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba8587495555555:0x40f051893debd129!8m2!3d11.1404028!4d77.0278074!16s%2Fg%2F11c0qgzmfc?authuser=1&entry=ttu&g_ep=EgoyMDI1MDIyMy4xIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-6 px-8 py-3 bg-[#22c55e] text-gray-900 font-medium rounded-lg hover:bg-[#e9b040] transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>
            </div>

            {/* FAQ Section with Luxury Styling */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center relative inline-block">
                    Frequently Asked Questions
                    <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#22c55e]"></span>
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">What are your business hours?</h3>
                        <p className="text-gray-700">Our office is open Monday through Friday from 9:00 AM to 5:00 PM, and Saturday from 10:00 AM to 2:00 PM. We are closed on Sundays and major holidays.</p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">How quickly do you respond to inquiries?</h3>
                        <p className="text-gray-700">We strive to respond to all inquiries within 24 business hours. For urgent matters, we recommend calling our office directly.</p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Do you offer virtual meetings?</h3>
                        <p className="text-gray-700">Yes, we offer virtual meetings via Zoom, Google Meet, or Microsoft Teams. Please let us know your preference when scheduling.</p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Is there parking available at your office?</h3>
                        <p className="text-gray-700">Yes, we have free parking available for clients in our designated parking area. Additional street parking is also available nearby.</p>
                    </div>
                </div>
            </div>

            <NewsFeed />
        </div>
    );
};

export default ContactForm;