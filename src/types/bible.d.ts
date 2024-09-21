interface Book {
  abbrev: {
    pt: string;
    en: string;
  };
  author: string;
  chapters: number;
  comment?: string;
  group: string;
  name: string;
  testament: string;
  version?: string;
}

type Chapter = {
  number: number;
  verses: number;
} | number;

interface Verse {
  book: {
    id: string;
    abbrev: {
      pt: string;
      en: string;
    };
  };
  chapter: Chapter;
  number: number;
  text: string;
  version: string;
  comment?: string;
}

interface User {
  name: string;
  email: string;
  password: string;
  token: string;
  notifications: boolean;
}

interface Version {
  version: string;
  verses: number;
}

interface SearchResponse {
  occurrence: number;
  version: string;
  verses: Verse[];
}

interface RateLimitResponse {
  msg: string;
}

// Paths

interface GetBooksResponse {
  200: Book[];
  409: RateLimitResponse;
}

interface GetBookResponse {
  200: Book;
  409: RateLimitResponse;
}

interface GetChapterResponse {
  book: Book;
  chapter: Chapter;
  verses: Verse[];
}

interface GetVerseResponse {
  200: Verse;
  409: RateLimitResponse;
}

interface GetRandomVerseResponse {
  200: Verse;
  409: RateLimitResponse;
}

interface GetRandomVerseFromBookResponse {
  200: Verse;
  409: RateLimitResponse;
}

interface SearchRequest {
  version: string;
  search: string;
}

interface SearchResponse {
  200: SearchResponse;
  409: RateLimitResponse;
}

interface GetVersionsResponse {
  200: Version[];
  409: RateLimitResponse;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  notifications: boolean;
}

interface CreateUserResponse {
  200: {
    name: string;
    email: string;
    token: string;
    notifications: boolean;
  };
}

interface RemoveUserRequest {
  email: string;
  password: string;
}

interface RemoveUserResponse {
  200: {
    msg: string;
  };
}

interface GetUserResponse {
  200: {
    name: string;
    email: string;
    token: string;
    notifications: boolean;
    lastLogin?: string;
  };
}

interface GetUserStatsResponse {
  200: {
    lastLogin: string;
    requestsPerMonth: {
      range: string;
      total: number;
    }[];
  };
}

interface UpdateTokenRequest {
  email: string;
  password: string;
}

interface UpdateTokenResponse {
  200: {
    name: string;
    email: string;
    token: string;
  };
}

interface ResendNewPasswordResponse {
  200: {
    msg: string;
  };
}

interface GetRequestsResponse {
  200: {
    url: string;
    date: string;
  }[];
}

interface GetRequestsNumberResponse {
  200: {
    total: number;
    requests: {
      _id: string;
      count: number;
    }[];
  };
}
