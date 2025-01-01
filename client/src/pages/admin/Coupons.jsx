import axios from "axios";
import React, { useEffect, useState } from "react";
import { showBlockConfirmation } from "../../helper/Sweat";
import { showToast } from "../../helper/toast";

const Coupon = () => {
  const [couponData, setCouponData] = useState([]);

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/get_all_coupons");
      if (res.status === 200) {
        setCouponData(res.data);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  // Toggle status of a coupon
  const toggleCouponStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus; // Determine the new status
    const title = `Do you want to ${newStatus ? 'Unblock' : 'Block'} the coupon?`;
  
    try {
      showBlockConfirmation(title, newStatus, async () => {
        const res = await axios.put(
          `http://localhost:3000/admin/toggle_coupon_status/${id}`,
          { status: newStatus }
        );
        if (res.status === 200) {
          showToast("Coupon status updated successfully!",'light','sccuss');
          fetchCoupons(); // Refresh the coupon list
        }
      }, () => {
        console.log('Action canceled');
      });
    } catch (error) {
      console.error("Error updating coupon status:", error);
      showToast("Failed to update coupon status.",'dark','error');
    }
  };
  


  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h1 className="text-5xl tracking-wider Header">Coupon List</h1>
        <a href="/dashboard/add_coupons" className="button">
          <span> + Add Coupon </span>
        </a>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-center text-sm">
          {/* Table Head */}
          <thead className="th pop uppercase tracking-wider">
            <tr>
              <th className="p-4">Coupon Name</th>
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount Percentage</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {couponData && couponData.length > 0 ? (
              couponData.map((coupon, index) => (
                <tr key={index} className="tb border-y-2 border-black">
                  <td className="p-4">{coupon.name}</td>
                  <td className="p-4">{coupon.code}</td>
                  <td className="p-4">{coupon.discount}%</td>
                  <td className="p-4">
                    {new Date(coupon.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        toggleCouponStatus(coupon._id, coupon.status)
                      }
                      className={`px-8 py-2 font-semibold uppercase ${
                        coupon.status
                          ? "text-white bg-red-600"
                          : "text-white bg-green-600"
                      }`}
                    >
                      {coupon.status ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupon;
