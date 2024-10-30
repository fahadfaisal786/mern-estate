import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../Components/ListingItem";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  // lat: 31.484347321087974, // Latitude of Lahore, Pakistan
  // lng: 74.36394747966126,
  // lat: 31.484270133960397,
  // lng: 74.3980222914905, // Longitude of Lahore, Pakistan
  lat: 31.484270133960397,
  lng: 74.3980222914905,
};

// Define coordinates for specific areas
const allAreas = [
  {
    name: "DHA",
    location: { lat: 31.481021368776425, lng: 74.40785247723944 },
  },
  {
    name: "DHA",
    location: { lat: 31.468559028066238, lng: 74.38831853069014 },
  },
  {
    name: "DHA",
    location: { lat: 31.46905722951075, lng: 74.3641293 },
  },

  {
    name: "DHA",
    location: { lat: 31.4846716909339, lng: 74.39505153861973 },
  },
  {
    name: "DHA",
    location: { lat: 31.46246097958396, lng: 74.4108661 },
  },
  {
    name: "DHA",
    location: { lat: 31.476110335391006, lng: 74.45119157723944 },
  },
  {
    name: "Walton",
    location: { lat: 31.49477015317936, lng: 74.37263346930986 },
  },
  {
    name: "Walton",
    location: { lat: 31.488911480866836, lng: 74.36380247723945 },
  },
  {
    name: "Walton",
    location: { lat: 31.495128733343925, lng: 74.37009022321361 },
  },
  {
    name: "Walton",
    location: { lat: 31.494651754986172, lng: 74.37892867723944 },
  },
];

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function Search() {
  const navigate = useNavigate();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    area: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const allSuggestions = ["Walton", "DHA"];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSidebardata({ ...sidebardata, searchTerm: value });
    if (value.length > 0) {
      const filteredSuggestions = allSuggestions.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    setSidebardata({ ...sidebardata, area: suggestion });
  };

  //Define the geocodeAddress function
  const geocodeAddress = async (address) => {
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      geocoder.geocode(
        { address, key: apiKey }, // Pass the API key here
        (results, status) => {
          if (status === "OK") {
            const { location } = results[0].geometry;
            resolve({ lat: location.lat(), lng: location.lng() });
          } else {
            reject(
              `Geocode was not successful for the following reason: ${status}`
            );
          }
        }
      );
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const areaFromUrl = urlParams.get("area");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      areaFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        area: areaFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();

      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  useEffect(() => {
    const fetchGeocodedListings = async () => {
      const geocodedListings = await Promise.all(
        listings.map(async (listing) => {
          if (listing.address) {
            try {
              const { lat, lng } = await geocodeAddress(listing.address);
              return { ...listing, location: { lat, lng } };
            } catch (error) {
              console.error(error);
              return listing; // Fallback to the original listing
            }
          }
          return listing; // If no address, return original listing
        })
      );
      setListings(geocodedListings);
    };

    if (listings.length > 0) {
      fetchGeocodedListings();
    }
  }, [listings]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]);
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm || query);
    urlParams.set("area", sidebardata.area || query);
    // urlParams.set("area", sidebardata.area || query);
    // urlParams.set("searchTerm", sidebardata.searchTerm);
    // urlParams.set("area", sidebardata.area);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  const filteredAreas = allAreas.filter(
    (area) => area.name.toLowerCase() === sidebardata.area.toLowerCase()
  );

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2 ">
            <div>
              <label className="whitespace-nowrap font-semibold mt-65">
                Search Term:
              </label>

              <input
                type="text"
                id="searchTerm"
                placeholder="Search..."
                className="border rounded-lg p-3 w-full"
                // value={sidebardata.searchTerm}
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              {suggestions.length > 0 && (
                <ul className="border rounded-lg p-8 w-80 bg-white absolute ">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{
                        padding: "8px",
                        height: "12%",
                        borderBottom: "1px solid #ccc",
                        cursor: "pointer",
                        display: "flex",
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center ">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to hight</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>

        <div className="mt-5">
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={12}
              center={defaultCenter}
            >
              {/* Mark specific areas on the map */}
              {filteredAreas.map((area, index) => (
                <Marker
                  key={index}
                  position={area.location}
                  title={area.name}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
