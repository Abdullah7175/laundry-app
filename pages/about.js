import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout title="About Us | Nasi` Cleanings">
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Nasi` Cleanings</h1>
          <p className="text-xl mb-8">A modern laundry and dry cleaning service dedicated to simplifying your life.</p>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Our Mission</h2>
          <p className="mb-6 text-gray-700">To provide premium, convenient, and eco-friendly laundry solutions for busy individuals and families. We believe everyone deserves fresh, clean bedding and garments with zero hassle.</p>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Professional cleaning with eco-friendly products</li>
            <li>On-time pickup and delivery at your doorstep</li>
            <li>Transparent pricing and no hidden fees</li>
            <li>Trusted by hundreds of happy customers</li>
            <li>Dedicated customer support</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
} 