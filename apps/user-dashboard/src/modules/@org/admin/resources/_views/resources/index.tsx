"use client";

import { useState } from "react";

import { ResourcesBody } from "../../_components/ResourcesBody";
import { ResourcesHeader } from "../../_components/ResourcesHeader";

export const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <section className="space-y-10">
      <ResourcesHeader onSearch={handleSearch} />
      <ResourcesBody searchQuery={searchQuery} />
    </section>
  );
};
