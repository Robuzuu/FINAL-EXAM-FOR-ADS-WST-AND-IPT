
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to CourierTrack 📦
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Track your parcels, create new shipments, and manage deliveries easily.
        Whether you're a customer or an admin, CourierTrack makes it simple.
      </p>
      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
        >
          Get Started
        </Link>
        <Link
          to="/track"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md transition"
        >
          Track Shipment
        </Link>
      </div>
    </div>
  );
}
