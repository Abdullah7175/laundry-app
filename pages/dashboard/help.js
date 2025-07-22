import Layout from '../../components/Layout';

export default function Help() {
  return (
    <Layout title="Get Help | Nasi` Cleanings">
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Need Help?</h1>
          <p className="text-xl mb-8">We're here to assist you with your orders, profile, and more.</p>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Frequently Asked Questions</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>How do I place a new order? <span className="text-gray-500">Go to 'New Order' and fill out the booking form.</span></li>
              <li>How can I track my orders? <span className="text-gray-500">Use the 'Track Orders' button to view your order status.</span></li>
              <li>How do I edit my profile? <span className="text-gray-500">Click 'Edit Profile' to update your information.</span></li>
              <li>Need more help? <span className="text-gray-500">Contact us via the <a href="/contact" className="text-blue-600 underline">Contact</a> page.</span></li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
} 