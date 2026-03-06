import React from 'react';

export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto py-16 px-6 lg:px-8 space-y-8 text-gray-800 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-4xl font-extrabold text-gray-900">Terms of Service</h1>
            <p className="text-sm text-gray-500">Last updated: March 2026</p>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                <p>By accessing and using Data Leaf, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using Data Leaf's services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">2. Service Description</h2>
                <p>Data Leaf provides tools to help you manage and reduce your digital carbon footprint by optimizing your Google Drive storage and bulk-deleting unwanted emails from Gmail.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">3. User Responsibility & Data Loss</h2>
                <p className="font-bold text-red-700 bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm leading-relaxed">
                    Data Leaf automates the process of moving emails to your Google Trash. We are not responsible for any accidental loss of data. You are solely responsible for reviewing the filters and queries you execute. Moved emails will reside in your Google Trash under your explicit control.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">4. Usage of Google Accounts</h2>
                <p>Our service requires you to link your Google Account. We only request the minimum required scopes necessary to operate our functionality. It is your responsibility to manage the app’s access via your Google Security Panel.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">5. Modifications to Service</h2>
                <p>Data Leaf reserves the right to modify or discontinue, temporarily or permanently, the service with or without notice. You agree that Data Leaf shall not be liable to you or to any third party for any modification, suspension or discontinuance of the service.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">6. Contact Information</h2>
                <p>If you have any questions or concerns regarding these Terms, please contact us at: support@dataleaf.app</p>
            </section>
        </div>
    );
}
