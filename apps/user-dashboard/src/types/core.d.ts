/**
 * Core types and utilities for the HRIS application
 */
import React from 'react';

declare global {
  // ============================================================================
  // CORE TYPES AND UTILITIES
  // ============================================================================

  /** Generic data item type for flexible object structures */
  type DataItem = Record<string, unknown>;

  /** Pagination metadata */
  interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  /** Generic API response wrapper */
  interface ApiResponse<T> {
    success: boolean;
    data: T;
  }

  /** Paginated API response wrapper */
  type PaginatedApiResponse<T> = ApiResponse<{
    items: T[];
    metadata: PaginationMetadata;
  }>;

  // ============================================================================
  // HTTP AND API TYPES
  // ============================================================================

  /** HTTP response wrapper */
  interface HttpResponse<T> {
    data: T;
    status: number;
  }

  /** Query parameters type */
  type QueryParameters = Record<string, string | number | boolean>;

  /** Headers type for HTTP requests */
  type HttpHeaders = Record<string, string>;

  /** Short token response */
  interface ShortTokenResponse {
    success: boolean;
    data: {
      token: string;
    };
  }

  // ============================================================================
  // DEPENDENCY INJECTION TYPES
  // ============================================================================

  /** Dependency injection container interface */
  interface DependencyContainer {
    _dependencies: Record<symbol, object>;
    add: (key: symbol, dependency: object) => void;
    get: <T>(key: symbol) => T;
  }

  /** Dependency injector function type */
  type DependencyInjector = (
    Component: React.ElementType,
    dependencies: Record<string, symbol>
  ) => React.ElementType;

  /** Dependency resolution interface */
  interface ResolveDependencies {
    [key: string]: object;
  }

  // ============================================================================
  // FILTER AND QUERY TYPES
  // ============================================================================

  /** Generic filters interface */
  interface Filters {
    page?: number | string;
    limit?: number;
    search?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    sort?: string;
    sortBy?: string;
    role?: string;
    teamId?: string;
    parentId?: string;
    roleId?: string;
    employeeId?: string;
    payProfileId?: string;
    permission?: string;
  }

  interface Timestamp {
    createdAt: string;
    updatedAt: string;
  }
}

export {};
