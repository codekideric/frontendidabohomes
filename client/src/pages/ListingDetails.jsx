import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DatePicker } from "antd";
import moment from "moment"; // Import moment library for date manipulation
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { facilities } from "../data";
import "../styles/ListingDetails.scss";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false); // State to track if listing is already booked

  useEffect(() => {
    console.log('Fetching details for listingId:', listingId);
    getListingDetails();
  }, [listingId]);

  const getListingDetails = async () => {
    try {
      console.log('Fetching details from API...');
      const response = await fetch(`https://idabohomebackend-g585.vercel.app/properties/${listingId}`, { method: "GET" });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Received data:', data);
      setListing(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };
  

  const customerId = useSelector((state) => state?.user?._id);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      alert("Please select a date range.");
      return;
    }
  
    if (!userName || !userPhone || !userEmail) {
      alert("Please enter your name, phone number, and email.");
      return;
    }
  
    const dayCount = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  
    try {
      const bookingForm = {
        customerId,
        customerName: userName,
        customerPhone: userPhone,
        customerEmail: userEmail,
        listingId,
        hostId: listing.creator._id,
        startDate: startDate.toDateString(),
        endDate: endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };
  
      const response = await fetch("https://idabohomebackend-g585.vercel.app/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      if (responseData.alreadyBooked) {
        // Show error message if the room is already booked
        setIsAlreadyBooked(true);
        toast.error(`The listing is already booked from ${responseData.existingBooking.startDate} to ${responseData.existingBooking.endDate}`);
      } else {
        // Show success message if the booking was successful
        toast.success('Booking successful!'); // Show success toast
        navigate(`https://idabohomebackend-g585.vercel.app/${customerId}/trips`);
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
      toast.error('Failed to submit booking'); // Show error toast
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>
        <div className="photos">
          {listing.listingPhotoPaths?.map((item, index) => {
            const imgSrc = `/${item.replace("public", "")}`;
            console.log(`Image ${index}:`, imgSrc); // Log the image path
            return (
              <img
                key={index}
                src={imgSrc}
                alt={`listing photo ${index}`}
                className="photo"
                onError={(e) => { e.target.src = '/path/to/placeholder/image.jpg'; }} // Fallback for broken image
              />
            );
          })}
        </div>
        <h2>{listing.type} in {listing.city}, {listing.province}, {listing.country}</h2>
        <p>{listing.guestCount} guests - {listing.bedroomCount} bedroom(s) - {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)</p>
        <hr />
        <div className="profile">
          <img src={`https://idabohomebackend-g585.vercel.app/${listing.creator.profileImagePath.replace("public", "")}`} alt="host" />
          <h3>Hosted by {listing.creator.firstName} {listing.creator.lastName}</h3>
        </div>
        <hr />
        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />
        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />
        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {facilities.find((facility) => facility.name === item)?.icon}
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DatePicker.RangePicker
                disabledDate={(current) => {
                  // Disable dates that are already booked
                  return current && (current < moment().endOf('day') || (endDate && current > moment(endDate, 'YYYY-MM-DD').endOf('day')));
                }}
                onChange={(dates) => {
                  setStartDate(dates[0]?.toDate() || null);
                  setEndDate(dates[1]?.toDate() || null);
                  setIsAlreadyBooked(false); // Reset isAlreadyBooked state when dates are changed
                }}
              />
              {startDate && endDate && (
                <>
                  <h2>
                    ₦{listing.price} x {Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))} {Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) > 1 ? 'nights' : 'night'}
                  </h2>
                  <h2>Total price: ₦{listing.price * Math.round((                  endDate - startDate) / (1000 * 60 * 60 * 24))}</h2>
                  <p>Start Date: {startDate.toDateString()}</p>
                  <p>End Date: {endDate.toDateString()}</p>
                </>
              )}
              <div className="user-details">
                <h2>Enter your details</h2>
                <input
                  type="text"
                  placeholder="Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
              <button className="button" type="submit" onClick={handleSubmit} disabled={isAlreadyBooked}>
                {isAlreadyBooked ? "Already Booked" : "SUBMIT YOUR BOOKINGS"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListingDetails;

