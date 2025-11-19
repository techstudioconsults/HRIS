"use client";

import { PageSection, PageWrapper } from "@/lib/animation";
import { useState } from "react";

import { ResourcesBody } from "../../_components/ResourcesBody";
import { ResourcesHeader } from "../../_components/ResourcesHeader";

export const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <PageWrapper className="space-y-10">
      <PageSection index={0}>
        <ResourcesHeader onSearch={handleSearch} />
      </PageSection>
      <PageSection index={1}>
        <ResourcesBody searchQuery={searchQuery} />
      </PageSection>
    </PageWrapper>
  );
};
