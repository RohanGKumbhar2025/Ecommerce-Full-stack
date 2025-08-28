import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
                    <p className="text-gray-600">We'd love to hear from you! Reach out with any questions or feedback.</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send a Message</h2>
                        <form className="space-y-4">
                            <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-lg" />
                            <input type="email" placeholder="Your Email" className="w-full p-3 border rounded-lg" />
                            <textarea placeholder="Your Message" rows="5" className="w-full p-3 border rounded-lg"></textarea>
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold">Send</button>
                        </form>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Information</h2>
                        <div className="flex items-start space-x-4">
                            <MapPin size={24} className="text-indigo-600 mt-1"/>
                            <div>
                                <h3 className="font-semibold text-gray-700">Address</h3>
                                <p className="text-gray-600">123 Commerce St, Pimpri-Chinchwad, Maharashtra, India</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <Phone size={24} className="text-indigo-600 mt-1"/>
                            <div>
                                <h3 className="font-semibold text-gray-700">Phone</h3>
                                <p className="text-gray-600">(123) 456-7890</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <Mail size={24} className="text-indigo-600 mt-1"/>
                            <div>
                                <h3 className="font-semibold text-gray-700">Email</h3>
                                <p className="text-gray-600">support@ecomstore.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;