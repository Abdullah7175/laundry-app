import Layout from '../components/Layout';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout title="Contact Us | Nasi` Cleanings">
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl mb-8">We'd love to hear from you! Reach out with any questions or feedback.</p>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-3" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-3" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="w-full border border-gray-300 rounded-md p-3"></textarea>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-300 w-full">Send Message</button>
            {submitted && <div className="text-green-600 font-medium text-center mt-4">Thank you! We'll get back to you soon.</div>}
          </form>
          <div className="mt-12 text-center text-gray-700">
            <div className="mb-2 font-bold">Nasi` Cleanings</div>
            <div>Email: support@nasicleanings.com</div>
            <div>Phone: +966 555 123 456</div>
            <div>Riyadh, Saudi Arabia</div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 