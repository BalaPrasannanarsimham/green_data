import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-6 lg:px-8 space-y-8 text-gray-800 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last updated: March 2026</p>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
                <p>Welcome to Data Leaf. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Data:</strong> We collect your basic profile information (name, email address, profile picture) when you authenticate via Google Auth.</li>
                    <li><strong>Google API Data:</strong> We access your Gmail and Google Drive data strictly to assess storage usage, calculate estimated carbon footprint, and provide the functionality to move unwanted emails to your trash.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
                <p>Your data is used entirely to support the core functionality of the Data Leaf application:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>To authenticate you and associate your data cleaning efforts with your account.</li>
                    <li>To fetch your Google Drive storage limits and usage to display your digital footprint.</li>
                    <li>To identify and list emails matching your designated cleanup criteria.</li>
                    <li>To move selected emails to your Google Trash contextually, depending on your actions.</li>
                </ul>
                <p className="font-bold text-green-700 bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm leading-relaxed">
                    Data Leaf does not store, share, or sell the contents, bodies, or attachments of your emails or Google Drive files on any external servers. Operations related to your mailbox and drive happen securely and temporarily via official Google APIs.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">4. Third-Party Services</h2>
                <p>Data Leaf uses Google Auth and Google APIs to perform actions on your behalf. Please review Google's Privacy Policy as well, to understand how they manage your data globally.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">5. Data Retention</h2>
                <p>We do not permanently store your API access tokens or personal email content. You can revoke Data Leaf's access to your Google Account at any time through your Google Security settings.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">6. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, you can contact us at: support@dataleaf.app</p>
            </section>
        </div>
    );
}
