import React from 'react'

const Feedback = () => {
  return (
   <section className="bg-[#f8f6f3] py-20 w-full">
  <div className="max-w-3xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-center mb-4">📬 Contact / Feedback</h2>
    <p className="text-center text-gray-600 text-lg mb-10">
      Have a question, suggestion, or idea? We’d love to hear from you!
    </p>

    <form className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black resize-none"
        ></textarea>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Send Message
        </button>
      </div>
    </form>
  </div>
</section>

  )
}

export default Feedback