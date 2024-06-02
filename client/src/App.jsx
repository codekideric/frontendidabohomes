import React, {lazy, Suspense} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import {PuffLoader} from 'react-spinners';
import ErrorBoundary from './components/ErrorBoundary';
const HomePage = lazy(()=> import ("./pages/HomePage"))
const RegisterPage = lazy(()=> import ("./pages/RegisterPage"))
const LoginPage = lazy(()=> import ("./pages/LoginPage"))
const CreateListing = lazy(()=> import ("./pages/CreateListing"))
const ListingDetails = lazy(()=> import ("./pages/ListingDetails"))
const TripList = lazy(()=> import ("./pages/TripList"))
const WishList = lazy(()=> import ("./pages/WishList"))
const PropertyList = lazy(()=> import ("./pages/PropertyList"))
const ReservationList = lazy(()=> import ("./pages/ReservationList"))
const CategoryPage = lazy(()=> import ("./pages/CategoryPage"))
const SearchPage = lazy(()=> import ("./pages/SearchPage"))

function App() {
  return (
    <div>
      <BrowserRouter>
      <ErrorBoundary>
       <Suspense fallback={<div className='load'><PuffLoader/></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/properties/:listingId" element={<ListingDetails />} />
          <Route path="/properties/category/:category" element={<CategoryPage />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
          <Route path="/:userId/trips" element={<TripList />} />
          <Route path="/:userId/wishList" element={<WishList />} />
          <Route path="/:userId/properties" element={<PropertyList />} />
          <Route path="/:userId/reservations" element={<ReservationList />} />
        </Routes>
        </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}

export default App;
