"use client";

import { useEffect, useState } from "react";

type CompanyData = {
  companyName: string;
  website: string;
};

export default function VideoGenerator() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);

  useEffect(() => {
    async function loadCompany() {
      const response = await fetch("/api/dashboard");
      const data = await response.json();

      setCompanyData(data);
    }

    loadCompany();
  }, []);

  return (
    <div>
      <h2>Video Generator</h2>

      {companyData && (
        <div>
          <p>Company: {companyData.companyName}</p>
          <p>Website: {companyData.website}</p>
        </div>
      )}

      {/* Your existing video generator UI */}
    </div>
  );
}