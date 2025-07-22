import Layout from '../../components/Layout';

export default function VendorPricing() {
  return (
    <Layout title="Vendor Pricing | Nasi` Cleanings">
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-xl mb-8">Manage your service pricing here.</p>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white p-8 rounded-lg shadow-md space-y-6 text-center">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Pricing Demo</h2>
            <p className="text-gray-700">This is a demo page for vendor pricing. Integrate your pricing management here.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 