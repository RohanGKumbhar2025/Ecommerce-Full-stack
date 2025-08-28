import React from 'react';

const AboutPage = ({ onPageChange }) => {
    return (
        <div className="bg-white py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">About EcomStore</h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Founded in 2025, EcomStore was born out of a simple idea: to make high-quality products accessible to everyone, everywhere. We believe that shopping should be an easy and enjoyable experience. That's why we've dedicated ourselves to curating a diverse selection of products, from the latest electronics to stylish apparel and essential home goods. Our mission is to provide exceptional value, unbeatable prices, and outstanding customer service. We work directly with manufacturers to ensure every item we sell meets our rigorous standards for quality and durability.
                </p>
                <button onClick={() => onPageChange('contact')} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700">
                    Get In Touch
                </button>
            </div>
        </div>
    );
};

export default AboutPage;