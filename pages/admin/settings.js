import Layout from '../../components/Layout';

export default function AdminSettings() {
  return (
    <Layout title="Admin Settings | Nasi` Cleanings">
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Admin Settings</h1>
          <p className="text-xl mb-8">Manage your platform settings and preferences here.</p>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">General Settings</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Platform Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-md p-3" value="Nasi` Cleanings" readOnly />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Support Email</label>
              <input type="email" className="w-full border border-gray-300 rounded-md p-3" value="support@nasicleanings.com" readOnly />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Default Language</label>
              <select className="w-full border border-gray-300 rounded-md p-3" value="en" readOnly>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 w-full" disabled>Save Changes (Demo)</button>
          </div>
        </div>
      </section>
    </Layout>
  );
} 