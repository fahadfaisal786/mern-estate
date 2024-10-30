import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import {
  FaBath,
  FaBed,
  FaChair,
  FaChartArea,
  FaLandmark,
  FaLocationArrow,
  FaMapMarkedAlt,
  FaParking,
  FaShare,
  FaSquare,
  FaSquarespace,
} from "react-icons/fa";
import Contact from "../Components/Contact";

export default function Listing() {
  const [message, setMessage] = useState("");
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  // Generate Google Maps URL
  // const googleMapsUrl = listing
  //   ? `https://www.google.com/maps?q=${encodeURIComponent(
  //       listing.address
  //     )}&t=&z=14&ie=UTF8&iwloc=&output=embed`
  //   : null;
  // Generate Google Maps URL using latitude and longitude if available
  const googleMapsUrl = listing
    ? listing.latitude && listing.longitude
      ? `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}&t=&z=14&ie=UTF8&iwloc=&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(
          listing.address
        )}&t=&z=14&ie=UTF8&iwloc=&output=embed`
    : null;
  // const handleSendEmail = () => {
  //   // Code to handle sending email or integration with backend email service
  //   alert(`Email sent to ${listing.email}: ${message}`);
  //   setMessage("");

  const handleSendEmail = () => {
    if (listing.email) {
      const subject = `Inquiry about ${listing.name}`;
      const body = message;
      const mailtoLink = `mailto:${listing.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoLink; // Opens the user's default email client with pre-filled data
    } else {
      alert("No email available for this listing.");
    }
    setMessage(""); // Reset the message field after sending
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name}- ${""}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-Us")
                : listing.regularPrice.toLocaleString("en-Us")}
              {listing.type === "rent" && "/ month"}
            </p>
            <p className="flex items-center mt-2 gap-2 text-slate-600  text-sm">
              <FaLocationArrow className="text-green-700" />
              {listing.area}
            </p>
            <p className="flex items-center mt-2 gap-2 text-slate-600  text-sm">
              <FaMapMarkedAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} Off
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            {/*Right-side contact info div */}
            {/* <div className="flex flex-col max-w-md bg-slate-100 p-4 rounded-md shadow-lg border">
              <h3 className="text-lg font-bold mb-2">Contact Landlord</h3>
              <p>
                <strong>Name:</strong> {listing.landlordName}
              </p>
              <p>
                <strong>Phone:</strong> {listing.phone}
              </p>
              <p>
                <strong>Email:</strong> {listing.email}
              </p> */}

            {/* Message input and send button */}
            {/* <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-2 border mt-3 rounded-md w-full"
                placeholder="Write your message"
                rows="4"
              ></textarea>
              <button
                onClick={handleSendEmail}
                className="bg-green-600 text-white p-2 mt-2 rounded-md w-full hover:bg-green-700"
              >
                Send Email
              </button>
            </div> */}

            {/* Right-side contact info div */}

            {/* <div className=" flex-shrink-0 w-full  lg:w-[300px] bg-slate-100 p-4 rounded-md shadow-lg borders ">
              <h3 className="text-lg font-bold mb-2">Contact Landlord</h3>
              <p>
                <strong>Name:</strong> {listing.landlordName || "Not available"}
              </p>
              <p>
                <strong>Phone:</strong> {listing.phone || "Not available"}
              </p>
              <p>
                <strong>Email:</strong> {listing.email || "Not available"}
              </p> */}

            {/* Message input and send button */}
            {/* <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-2 border mt-3 rounded-md w-full"
                placeholder="Write your message"
                rows="2"
              ></textarea> */}

            {/* <button
                onClick={() => setContact(true)}
                // onClick={handleSendEmail}
                className="bg-green-600 text-white p-2 mt-2 rounded-md w-full hover:bg-green-700"
              >
                Send Email
              </button>
            </div> */}

            <ul className=" text-green-800 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "unfurnished"}
              </li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
          {/* <div className="flex flex-col max-w-10xl mx-auto p-3 my-7 gap-4">
            <iframe src="https://maps.google.com/maps?q=pakistan%20lahore%20&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=&amp;output=embed"></iframe>
          </div> */}
          {/* Google Maps Embed */}
          {/* Google Maps Embed */}
          {googleMapsUrl && (
            <div className="flex flex-col max-w-10xl mx-auto p-3 my-7 gap-4">
              <iframe
                src={googleMapsUrl}
                width="100%"
                height="450"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
