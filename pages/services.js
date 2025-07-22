import Layout from '../components/Layout';

export default function Services() {
  return (
    <Layout title="Our Services | Nasi` Cleanings">
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl mb-8">Premium care for your bedding items. Explore our full range of laundry and dry cleaning services.</p>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🛏️</div>
              <h3 className="text-xl font-bold mb-2">Bed Sheets</h3>
              <p className="text-gray-600 mb-2">Professional cleaning for all bed sheet sizes</p>
              <div className="text-blue-700 font-bold text-lg">15 SAR / item</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🛌</div>
              <h3 className="text-xl font-bold mb-2">Pillowcases</h3>
              <p className="text-gray-600 mb-2">Soft and gentle cleaning for pillowcases</p>
              <div className="text-blue-700 font-bold text-lg">8 SAR / item</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🛏️</div>
              <h3 className="text-xl font-bold mb-2">Duvet Covers</h3>
              <p className="text-gray-600 mb-2">Deep cleaning for duvet covers of all sizes</p>
              <div className="text-blue-700 font-bold text-lg">25 SAR / item</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🛋️</div>
              <h3 className="text-xl font-bold mb-2">Blankets</h3>
              <p className="text-gray-600 mb-2">Thorough cleaning for blankets</p>
              <div className="text-blue-700 font-bold text-lg">30 SAR / item</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🛏️</div>
              <h3 className="text-xl font-bold mb-2">Comforters</h3>
              <p className="text-gray-600 mb-2">Gentle cleaning for your comforters</p>
              <div className="text-blue-700 font-bold text-lg">40 SAR / item</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🪡</div>
              <h3 className="text-xl font-bold mb-2">Quilts</h3>
              <p className="text-gray-600 mb-2">Special care for delicate quilts</p>
              <div className="text-blue-700 font-bold text-lg">35 SAR / item</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 