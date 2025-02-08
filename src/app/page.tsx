"use client";
import FaucetComponets from "./components/FaucetComponets";
import Header from "./components/Header";

export default function BlockfuseFaucet() {

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 text-black">
      {/* Header */}

      <Header/>

   
      {/* Main Section */}
      <div className="flex w-full flex-col lg:flex-row items-center justify-center py-16">
        <FaucetComponets/>z
      </div>
    </div>
  );
}